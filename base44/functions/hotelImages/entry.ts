// Hotel images — fetches REAL image URLs for hotels by scraping each hotel's
// official website. The LLM image URLs returned by hotelSearch are often wrong
// or hallucinated, so this function is the source of truth for real photos.
// It runs as a background enhancement on the results list and on the detail page.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const FETCH_TIMEOUT_MS = 8000;

async function fetchPage(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
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
    if (!response.ok) return "";
    return response.text();
  } catch {
    return "";
  }
}

// Extract direct image URLs from HTML — handles src, data-src, data-lazy-src,
// data-original, srcset/data-srcset, and og:image. Resolves relative URLs.
function extractImagesFromHtml(html: string, baseUrl: string): string[] {
  const matches: string[] = [];
  let m;

  // <img src="…"> / data-src / data-lazy-src / data-original
  const imgSrcRegex = /<img[^>]+(?:src|data-src|data-lazy-src|data-original)=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
  while ((m = imgSrcRegex.exec(html)) !== null) matches.push(m[1]);

  // srcset / data-srcset — "url1 1x, url2 2x" → take the first URL of each part
  const srcsetRegex = /(?:srcset|data-srcset)=["']([^"']+)["']/gi;
  while ((m = srcsetRegex.exec(html)) !== null) {
    m[1].split(",").forEach((part: string) => {
      const u = part.trim().split(/\s+/)[0];
      if (u && /\.(?:jpg|jpeg|png|webp)$/i.test(u)) matches.push(u);
    });
  }

  // og:image meta
  const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  if (ogMatch) matches.unshift(ogMatch[1]);

  // Filter out icons/logos/UI sprites
  const filtered = matches.filter((u) =>
    !/logo|icon|favicon|sprite|1x1|pixel|button|arrow|banner-tiny|avatar|social-|flag|blank|placeholder/i.test(u)
  );

  // Resolve relative URLs against the page base
  let base: URL;
  try { base = new URL(baseUrl); } catch { return []; }
  const resolved = filtered
    .map((u) => { try { return new URL(u, base).href; } catch { return null; } })
    .filter((x): x is string => Boolean(x));
  return [...new Set(resolved)];
}

// Find links to gallery/rooms/photos pages so we can scrape more images.
function findGalleryLinks(html: string, baseUrl: string): string[] {
  const links: string[] = [];
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi;
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    const href = m[1];
    const text = (m[2] || "").toLowerCase();
    if (/gallery|photo|rooms|suite|accommodation|image|bilder|foto|galler/i.test(href + " " + text)) {
      try { links.push(new URL(href, baseUrl).href); } catch {}
    }
  }
  return [...new Set(links)].slice(0, 2);
}

async function scrapeImages(url: string): Promise<string[]> {
  const homeHtml = await fetchPage(url);
  if (!homeHtml) return [];
  let images = extractImagesFromHtml(homeHtml, url);
  // If the homepage doesn't expose enough photos, follow a gallery/rooms link.
  if (images.length < 10) {
    for (const link of findGalleryLinks(homeHtml, url).slice(0, 1)) {
      if (images.length >= 10) break;
      const pageHtml = await fetchPage(link);
      if (pageHtml) images = [...new Set([...images, ...extractImagesFromHtml(pageHtml, link)])];
    }
  }
  return images.slice(0, 10);
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { hotels = [] } = body;
    // hotels: [{ name, url, destination }]

    if (!hotels || hotels.length === 0) return Response.json({ results: {} });

    // Step 1: Use LLM with web search to find official website URLs for all hotels
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

    // Step 2: Scrape each hotel's official website for real images in parallel.
    // Falls back to the Booking.com URL passed in if no official site was found.
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
    scraped.forEach((s) => { results[s.key] = s.images; });

    return Response.json({ results });
  } catch (error) {
    return Response.json({ results: {}, error: error.message });
  }
}