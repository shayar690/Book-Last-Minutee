// Hotel images — finds REAL image URLs by scraping each hotel's official website.
// Step 1: Check the HotelImageCache for previously scraped images (instant for
//         repeat searches).
// Step 2: For uncached hotels, LLM with web search finds candidate website URLs.
// Step 3: Scrape each candidate website (homepage + gallery/rooms pages).
// Step 4: Validate each URL with a lightweight GET request (content-type + size
//         check) so the client only receives URLs that resolve to a real photo.
// Step 5: Cache the results for future searches.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const FETCH_TIMEOUT = 8000;
const VALIDATE_TIMEOUT = 5000;
const MAX_CONCURRENT_VALIDATE = 40;
const MIN_IMAGE_BYTES = 15000; // Skip icons/logos (< 15 KB)

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

// Filter out non-photo images: social media icons, ads, flyers, logos, UI elements.
const NON_PHOTO_RE = new RegExp(
  'logo|icon|favicon|sprite|1x1|pixel|button|arrow|banner-tiny|avatar|' +
  'social-|flag|blank|placeholder|tracking|loader|spinner|award|rating|' +
  'badge|certificate|seal|stamp|ribbon|_next\\/|\\/static\\/|hero\\.|' +
  // Social media
  'whatsapp|facebook|twitter|instagram|linkedin|youtube|tiktok|' +
  'social|share|follow|subscribe|messenger|telegram|wechat|' +
  // Ads / promos
  'promo|flyer|advertisement|ad-banner|ad_|coupon|deal|offer|discount|' +
  'sale|voucher|gift-card|' +
  // App / download
  'app-store|google-play|download-app|qr|barcode|' +
  // Newsletter / signup
  'newsletter|signup|register|' +
  // Maps / directions
  'map-direction|map-pin|location-pin|' +
  // Misc UI
  'amenity-icon|service-icon|facility-icon|close|menu-icon|search-icon|' +
  'arrow-|chevron|plus|minus|check|star-icon',
  'i'
);

function extractImagesFromHtml(html: string, baseUrl: string): string[] {
  const matches: string[] = [];
  let m;

  const imgSrcRegex = /<img[^>]+(?:src|data-src|data-lazy-src|data-original)=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
  while ((m = imgSrcRegex.exec(html)) !== null) matches.push(m[1]);

  // Extract from srcset — URLs in srcset can contain commas (e.g., Cloudinary
  // transformation params like f_auto,c_auto,w_640), so we extract by URL pattern
  // instead of splitting by comma (which would break Cloudinary URLs).
  const srcsetRegex = /(?:srcset|data-srcset)=["']([^"']+)["']/gi;
  while ((m = srcsetRegex.exec(html)) !== null) {
    const urlRegex = /https?:\/\/\S+/g;
    let um;
    while ((um = urlRegex.exec(m[1])) !== null) {
      const u = um[0].replace(/[,;]$/, ''); // remove trailing comma/semicolon
      if (u && /\.(?:jpg|jpeg|png|webp)$/i.test(u)) matches.push(u);
    }
  }

  const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  if (ogMatch) matches.unshift(ogMatch[1]);

  const filtered = matches.filter((u) => !NON_PHOTO_RE.test(u));

  let base: URL;
  try { base = new URL(baseUrl); } catch { return []; }
  // Dedup by "image identity" — the path after any CDN transformation params.
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

// Validate that a URL resolves to a real photo (not an icon or broken link).
// Uses a GET with Range to get content-type AND total size from Content-Range.
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
    if (!ct.startsWith('image/')) return false;
    // Determine total image size — skip small images (icons, logos, buttons).
    // For 206 Partial Content, only Content-Range has the true total size
    // (Content-Length is just the partial body length, e.g. 1 byte).
    let totalSize = 0;
    if (res.status === 206) {
      const cr = res.headers.get('content-range');
      if (cr) {
        const m = cr.match(/\/(\d+)$/);
        if (m) totalSize = parseInt(m[1], 10);
      }
    } else {
      totalSize = parseInt(res.headers.get('content-length') || '0', 10);
    }
    if (totalSize > 0 && totalSize < MIN_IMAGE_BYTES) return false;
    return true;
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

    const normalize = (s: string) => (s || "").toLowerCase().trim();
    function hotelKey(h: { name: string; url?: string; destination?: string }): string {
      return h.url || `${normalize(h.name)}|${normalize(h.destination || '')}`;
    }

    const batch = hotels.slice(0, 20);
    const keys = batch.map(hotelKey);
    const results: Record<string, string[]> = {};
    const uncached: typeof batch = [];

    // Step 1: Check cache — instant for repeat searches.
    try {
      const cached = await base44.asServiceRole.entities.HotelImageCache.filter({
        hotel_key: { $in: keys }
      }, { limit: 50 });
      const cacheMap = new Map<string, string[]>();
      (cached.items || []).forEach((c: any) => {
        if (c.images && c.images.length > 0) cacheMap.set(c.hotel_key, c.images);
      });
      batch.forEach((hotel) => {
        const key = hotelKey(hotel);
        if (cacheMap.has(key)) {
          results[hotel.url || hotel.name] = cacheMap.get(key)!;
        } else {
          uncached.push(hotel);
        }
      });
    } catch {
      uncached.push(...batch);
    }

    if (uncached.length === 0) return Response.json({ results });

    // Step 2: LLM with web search finds candidate website URLs for uncached hotels.
    const hotelList = uncached.map((h, i) =>
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

    // Step 3: Scrape each uncached hotel's candidate URLs.
    const scraped = await Promise.all(uncached.map(async (hotel) => {
      const candidates = urlMap[normalize(hotel.name)] || [];
      for (const candidateUrl of candidates.slice(0, 3)) {
        const images = await scrapeImages(candidateUrl);
        if (images.length >= 2) return { hotel, key: hotelKey(hotel), images };
      }
      return { hotel, key: hotelKey(hotel), images: [] };
    }));

    // Step 4: Cache successful scrapes and merge into results.
    const toCache: any[] = [];
    scraped.forEach((s) => {
      results[s.hotel.url || s.hotel.name] = s.images;
      if (s.images.length >= 2) {
        toCache.push({
          hotel_key: s.key,
          hotel_name: s.hotel.name,
          destination: s.hotel.destination || "",
          url: s.hotel.url || "",
          images: s.images
        });
      }
    });

    if (toCache.length > 0) {
      try {
        await base44.asServiceRole.entities.HotelImageCache.bulkCreate(toCache);
      } catch {}
    }

    return Response.json({ results });
  } catch (error) {
    return Response.json({ results: {}, error: error.message });
  }
}