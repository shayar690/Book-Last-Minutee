// Hotel images — finds REAL image URLs by scraping each hotel's official website.
// Step 1: LLM with web search finds candidate website URLs for each hotel
//         (official site, and other non-booking pages that might have photos).
// Step 2: Scrape each candidate website (homepage + gallery/rooms pages).
// Step 3: Validate each URL with a lightweight GET request (content-type check)
//         so the client only receives URLs that actually resolve to an image.
// This is the source of truth for hotel photos — the LLM image URLs from
// hotelSearch are often hallucinated, so we don't use them as fill.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const FETCH_TIMEOUT = 8000;
const VALIDATE_TIMEOUT = 5000;
const MAX_CONCURRENT_VALIDATE = 40;

async function fetchPage(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
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

function extractImagesFromHtml(html: string, baseUrl: string): string[] {
  const matches: string[] = [];
  let m;

  const imgSrcRegex = /<img[^>]+(?:src|data-src|data-lazy-src|data-original)=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
  while ((m = imgSrcRegex.exec(html)) !== null) matches.push(m[1]);

  const srcsetRegex = /(?:srcset|data-srcset)=["']([^"']+)["']/gi;
  while ((m = srcsetRegex.exec(html)) !== null) {
    m[1].split(",").forEach((part: string) => {
      const u = part.trim().split(/\s+/)[0];
      if (u && /\.(?:jpg|jpeg|png|webp)$/i.test(u)) matches.push(u);
    });
  }

  const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  if (ogMatch) matches.unshift(ogMatch[1]);

  const filtered = matches.filter((u) =>
    !/logo|icon|favicon|sprite|1x1|pixel|button|arrow|banner-tiny|avatar|social-|flag|blank|placeholder|tracking|loader|spinner|award|rating|badge|certificate|seal|stamp|ribbon|_next\/|\/static\/|hero\./i.test(u)
  );

  let base: URL;
  try { base = new URL(baseUrl); } catch { return []; }
  // Dedup by "image identity" — the path after any CDN transformation params.
  // Cloudinary-style URLs (/transformations/v{version}/path/file.jpg) produce
  // different URLs for the same image (different crop params); we dedup on the
  // path after the version so the same photo only appears once.
  function imageIdentity(url: string): string {
    try {
      const u = new URL(url);
      const m = u.pathname.match(/\/v\d+\/(.+)$/);
      return m ? m[1] : u.pathname;
    } catch { return url; }
  }
  const seen = new Set<string>();
  const resolved = filtered
    .map((u) => { try { return new URL(u, base).href; } catch { return null; } })
    .filter((x): x is string => Boolean(x))
    .filter((url) => {
      const id = imageIdentity(url);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  return resolved;
}

function findGalleryLinks(html: string, baseUrl: string): string[] {
  let base: URL;
  try { base = new URL(baseUrl); } catch { return []; }
  // Only follow links within the same path prefix — prevents scraping images
  // of other properties on the same hotel-group website (e.g. other hotels in
  // the same chain listed on the same domain).
  const pathParts = base.pathname.replace(/\/$/, "").split("/");
  const prefix = pathParts.length > 1 ? pathParts.slice(0, 2).join("/") : pathParts[0];
  const links: string[] = [];
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi;
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    const href = m[1];
    const text = (m[2] || "").toLowerCase();
    if (/gallery|photo|rooms|suite|accommodation|image|bilder|foto|galler/i.test(href + " " + text)) {
      try {
        const resolved = new URL(href, baseUrl);
        if (resolved.hostname === base.hostname && resolved.pathname.startsWith(prefix)) {
          links.push(resolved.href);
        }
      } catch {}
    }
  }
  return [...new Set(links)].slice(0, 3);
}

async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), VALIDATE_TIMEOUT);
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Range': 'bytes=0-0' },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok && res.status !== 206) return false;
    const ct = res.headers.get('content-type') || '';
    return ct.startsWith('image/');
  } catch {
    return false;
  }
}

async function mapWithConcurrency<T, R>(items: T[], fn: (item: T) => Promise<R>, limit: number): Promise<R[]> {
  const results = new Array<R>(items.length);
  let idx = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

async function scrapeImages(url: string): Promise<string[]> {
  const homeHtml = await fetchPage(url);
  if (!homeHtml) return [];
  let images = extractImagesFromHtml(homeHtml, url);
  if (images.length < 12) {
    for (const link of findGalleryLinks(homeHtml, url)) {
      if (images.length >= 15) break;
      const pageHtml = await fetchPage(link);
      if (pageHtml) images = [...new Set([...images, ...extractImagesFromHtml(pageHtml, link)])];
    }
  }
  // Validate each URL — only keep URLs that actually resolve to an image.
  const toValidate = images.slice(0, 15);
  const validated = await mapWithConcurrency(toValidate, validateImageUrl, MAX_CONCURRENT_VALIDATE);
  return images.filter((_, i) => validated[i]).slice(0, 10);
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { hotels = [] } = body;

    if (!hotels || hotels.length === 0) return Response.json({ results: {} });

    // Step 1: LLM with web search finds candidate website URLs for each hotel.
    // Ask for up to 3 URLs per hotel to maximize the chance one is scrapable.
    const hotelList = hotels.map((h, i) =>
      `${i + 1}. "${h.name}" — a hotel in ${h.destination || ''}`
    ).join("\n");

    const llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Search the web for each of these hotels and find website URLs that contain real photos of the hotel. For each hotel, return up to 3 candidate URLs in priority order:
1. The hotel's OWN official website (e.g., www.hotelname.com) — this is best
2. A local tourism or directory site with hotel photos
3. Any other non-booking-site page with real photos of this specific hotel

Do NOT include URLs from booking.com, expedia.com, hotels.com, or tripadvisor.com — those sites block scraping.

Hotels:
${hotelList}

Return a JSON object with a "hotels" array. Each element has "name" (exactly as given above) and "urls" (array of up to 3 website URLs, best first). If you cannot find any suitable URL for a hotel, return an empty array.`,
      add_context_from_internet: true,
      model: "gemini_3_flash",
      response_json_schema: {
        type: "object",
        additionalProperties: true,
        properties: {
          hotels: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
              properties: {
                name: { type: "string" },
                urls: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    });

    const llmHotels = (llmResult && Array.isArray(llmResult.hotels)) ? llmResult.hotels : [];
    const normalize = (s: string) => (s || "").toLowerCase().trim();

    // Check if a URL belongs to a booking aggregator (by hostname, not substring
    // — so "claytonhotels.com" and "tajhotels.com" are NOT filtered out).
    const BOOKING_DOMAINS = ["booking.com", "expedia.com", "hotels.com", "tripadvisor.com"];
    function isBookingSite(url: string): boolean {
      try {
        const host = new URL(url).hostname.toLowerCase();
        return BOOKING_DOMAINS.some((d) => host === d || host.endsWith("." + d));
      } catch { return false; }
    }

    const urlMap: Record<string, string[]> = {};
    llmHotels.forEach((h: any) => {
      if (h.name && Array.isArray(h.urls)) {
        const valid = h.urls.filter((u: string) => u && !isBookingSite(u));
        if (valid.length > 0) urlMap[normalize(h.name)] = valid;
      }
    });

    // Step 2: Scrape each hotel's candidate URLs (try them in order until we
    // get enough validated images).
    const batch = hotels.slice(0, 20);
    const scraped = await Promise.all(batch.map(async (hotel) => {
      const candidates = urlMap[normalize(hotel.name)] || [];
      for (const candidateUrl of candidates.slice(0, 3)) {
        const images = await scrapeImages(candidateUrl);
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