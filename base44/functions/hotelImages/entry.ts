// Hotel images — finds REAL image URLs by scraping each hotel's official website.
// Step 1: Check the HotelImageCache for previously scraped images (instant for
//         repeat searches).
// Step 2: For uncached hotels, LLM with web search finds candidate website URLs.
// Step 3: Scrape each candidate website (homepage + gallery/rooms pages).
// Step 4: Validate each URL with a lightweight GET request (content-type + size
//         check) so the client only receives URLs that resolve to a real photo.
// Step 5: Cache the results for future searches.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const FETCH_TIMEOUT = 4500;
const VALIDATE_TIMEOUT = 3000;
const MAX_CONCURRENT_VALIDATE = 40;
const MIN_IMAGE_BYTES = 12000; // Skip icons/logos (< 12 KB)

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
  // Ads / promos / credit cards / loyalty programs
  'promo|flyer|advertisement|ad-banner|ad_|coupon|deal|offer|discount|' +
  'sale|voucher|gift-card|credit-card|creditcard|bonvoy|boundless|' +
  'mastercard|amex|loyalty|reward|earn-points|' +
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

// Ad-related alt text — catches credit card promos, loyalty banners, etc.
// that slip past URL filtering (e.g., a Marriott Bonvoy Visa card image).
const AD_ALT_RE = /credit\s*card|bonvoy|visa|mastercard|amex|loyalty|reward|earn\s*points|apply\s*now|sign\s*up|join\s*now|sponsor|advertisement|partnership|co-branded|limited\s*time|exclusive\s*offer/i;

// Major hotel brands and well-known properties — used to filter out images
// from third-party pages (e.g., a "Best Hotels in Dubai" article) that include
// photos of OTHER hotels. If an image URL contains a brand NOT in the current
// hotel's name, the image is almost certainly of a different hotel.
const HOTEL_BRANDS = [
  'marriott', 'hilton', 'hyatt', 'intercontinental', 'holiday-inn', 'novotel',
  'ibis', 'accor', 'four-seasons', 'ritz-carlton', 'st-regis', 'westin',
  'sheraton', 'jumeirah', 'mandarin-oriental', 'peninsula', 'shangri-la',
  'fairmont', 'radisson', 'crowne-plaza', 'le-meridien', 'renaissance',
  'moxy', 'aloft', 'sofitel', 'pullman', 'movenpick', 'steigenberger',
  'kempinski', 'langham', 'rosewood', 'aman', 'six-senses', 'banyan-tree',
  'anantara', 'oberoi', 'burj-al-arab', 'bvlgari', 'bulgari', 'caesar',
  'mgm', 'venetian', 'palazzo', 'w-hotel', 'grand-hyatt', 'park-hyatt',
];

function filterByBrand(images: string[], hotelName: string): string[] {
  const normalized = hotelName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filtered = images.filter(url => {
    const u = url.toLowerCase();
    for (const brand of HOTEL_BRANDS) {
      if (u.includes(brand) && !normalized.includes(brand)) return false;
    }
    return true;
  });
  // Keep filtered only if it has enough images; otherwise fall back to unfiltered.
  return filtered.length >= 2 ? filtered : images;
}

function extractImagesFromHtml(html: string, baseUrl: string): string[] {
  const matches: string[] = [];
  let m;

  // Match full <img> tags to extract src + alt + dimensions together, so we
  // can filter out ad images (credit card promos, loyalty banners) by their
  // alt text and skip unusual aspect ratios (wide banner ads, tiny buttons).
  const imgTagRegex = /<img\b[^>]*>/gi;
  while ((m = imgTagRegex.exec(html)) !== null) {
    const tag = m[0];
    const srcMatch = tag.match(/(?:src|data-src|data-lazy-src|data-original)=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/i);
    if (!srcMatch) continue;
    const src = srcMatch[1];

    // Filter by alt text — skip ad/promo images (credit cards, loyalty banners)
    const altMatch = tag.match(/\balt=["']([^"']*)["']/i);
    if (altMatch && AD_ALT_RE.test(altMatch[1])) continue;

    // Filter by aspect ratio — skip very wide banners (ads) and very tall images
    const wMatch = tag.match(/\bwidth=["']?(\d+)["']?/i);
    const hMatch = tag.match(/\bheight=["']?(\d+)["']?/i);
    if (wMatch && hMatch) {
      const w = parseInt(wMatch[1], 10);
      const h = parseInt(hMatch[1], 10);
      if (w > 0 && h > 0) {
        const ratio = w / h;
        if (ratio > 3.5 || ratio < 0.25) continue;
      }
    }

    matches.push(src);
  }

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
  return [...new Set(links)].slice(0, 2);
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
  if (images.length < 8) {
    for (const link of findGalleryLinks(homeHtml, url)) {
      if (images.length >= 12) break;
      const pageHtml = await fetchPage(link);
      if (pageHtml) images = [...new Set([...images, ...extractImagesFromHtml(pageHtml, link)])];
    }
  }
  const toValidate = images.slice(0, 12);
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
      prompt: `For each hotel below, find 2 website URLs that contain real photos of the hotel:
1. The hotel's OWN official website (e.g., www.hotelname.com)
2. A third-party page with hotel photos (e.g., a tourism site, travel blog, or review site — NOT booking.com, expedia.com, hotels.com, or tripadvisor.com)

Hotels:
${hotelList}

Return a JSON object with a "hotels" array. Each element has "name" (exactly as given above) and "urls" (array of up to 2 website URLs, best first). If you cannot find any suitable URL, return an empty array.`,
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

    // Step 3: Scrape each uncached hotel's candidate URLs in parallel.
    // Trying both URLs at once (instead of sequentially) saves 2-4 s when the
    // first URL blocks scraping (e.g., Marriott/Hilton return 403).
    const scraped = await Promise.all(uncached.map(async (hotel) => {
      const candidates = urlMap[normalize(hotel.name)] || [];
      const scrapeResults = await Promise.all(candidates.slice(0, 2).map(url => scrapeImages(url)));
      for (const images of scrapeResults) {
        if (images.length >= 2) return { hotel, key: hotelKey(hotel), images: filterByBrand(images, hotel.name) };
      }
      const best = scrapeResults.reduce((a, b) => a.length >= b.length ? a : b, []);
      return { hotel, key: hotelKey(hotel), images: filterByBrand(best, hotel.name) };
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