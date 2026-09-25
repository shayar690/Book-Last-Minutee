// Hotel images — fetches real image URLs for hotels.
// Strategy: Use InvokeLLM with web search to find each hotel's official website,
// then scrape that website for real image URLs. Hotel official websites rarely
// block scrapers, unlike Booking.com which has aggressive anti-bot protection.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

async function scrapeImages(url: string): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) return [];
    const html = await response.text();

    // Extract all image URLs from HTML — <img src>, data-src, and og:image meta
    const imgSrcRegex = /<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
    const ogRegex = /<meta\s+property="og:image"\s+content="([^"]+)"/i;
    const matches: string[] = [];
    let m;
    while ((m = imgSrcRegex.exec(html)) !== null) matches.push(m[1]);
    const ogMatch = html.match(ogRegex);
    if (ogMatch) matches.unshift(ogMatch[1]);

    // Filter out tiny icons/logos and deduplicate
    const filtered = matches.filter(u =>
      !u.includes('logo') && !u.includes('icon') && !u.includes('favicon') &&
      !u.includes('sprite') && !u.includes('1x1') && !u.includes('pixel') &&
      !u.includes('button') && !u.includes('arrow') && !u.includes('banner-tiny')
    );
    const unique = [...new Set(filtered)].map(u => u.replace(/&amp;/g, '&')).slice(0, 8);
    return unique;
  } catch {
    return [];
  }
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { hotels = [] } = body;
    // hotels: [{ name, url, destination }]

    if (!hotels || hotels.length === 0) return Response.json({ results: {} });

    // Step 1: Use LLM to find official website URLs for all hotels in one call
    const hotelList = hotels.map((h, i) =>
      `${i + 1}. "${h.name}" in ${h.destination || ''}`
    ).join("\n");

    const llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Search the web and find the OFFICIAL WEBSITE URL for each of these hotels (the hotel's own website, NOT Booking.com, Expedia, or other booking sites). The official website is typically the hotel's own domain.

Hotels:
${hotelList}

Return an array of objects, each with the hotel "name" (exactly as given above) and its official website "url". If you cannot find the official website for a hotel, set its "url" to an empty string.`,
      add_context_from_internet: true,
      model: "gemini_3_flash",
      response_json_schema: {
        type: "object",
        additionalProperties: true,
        properties: {
          websites: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
              properties: {
                name: { type: "string" },
                url: { type: "string" }
              }
            }
          }
        }
      }
    });

    const websiteList = (llmResult && llmResult.websites) ? llmResult.websites : [];
    const websiteMap: Record<string, string> = {};
    websiteList.forEach((w: any) => {
      if (w.name) websiteMap[w.name] = w.url || "";
    });

    // Step 2: Scrape each hotel's official website for images in parallel
    const batch = hotels.slice(0, 20);
    const scraped = await Promise.all(batch.map(async (hotel) => {
      const officialUrl = websiteMap[hotel.name] || "";
      const urlsToTry = [officialUrl, hotel.url].filter(Boolean);
      for (const tryUrl of urlsToTry) {
        const images = await scrapeImages(tryUrl);
        if (images.length >= 2) return { key: hotel.url || hotel.name, images };
      }
      return { key: hotel.url || hotel.name, images: [] };
    }));

    const results: Record<string, string[]> = {};
    scraped.forEach(s => { results[s.key] = s.images; });

    return Response.json({ results });
  } catch (error) {
    return Response.json({ results: {}, error: error.message });
  }
}