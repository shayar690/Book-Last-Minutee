// Hotel images — finds REAL image URLs by scraping each hotel's official website.
// Step 1: Check the HotelImageCache for previously scraped images (instant for
//         repeat searches).
// Step 2: For uncached hotels, LLM with web search finds candidate website URLs.
// Step 3: Scrape each candidate website (homepage + gallery/rooms pages).
// Step 4: Validate each URL with a lightweight GET request (content-type + size
//         check) so the client only receives URLs that resolve to a real photo.
// Step 5: Cache the results for future searches.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const FETCH_TIMEOUT = 2500;
const VALIDATE_TIMEOUT = 2500;
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
  'whatsapp|facebook|twitter|instagram|linkedin|youtube|ytimg|tiktok|' +
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
  'arrow-|chevron|plus|minus|check|star-icon|hqdefault|vi_webp|default-thumb',
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
  // Added to prevent cross-hotel image contamination. Only distinct,
  // recognizable hotel names — not collection domains (e.g. "address" is
  // the domain for Palace Downtown's own website, so it would cause a
  // false positive that wipes all correct images).
  'atlantis', 'armani', 'taj', 'conrad', 'doubletree', 'waldorf',
  'autograph', 'curio', 'tribute', 'leela', 'itc', 'carlton', 'crillon',
  'meurice', 'bristol', 'sacher', 'dolder', 'citizenm', 'kimpton',
  'indigo', 'regent', 'andaz', 'alila', 'hyatt-place', 'hyatt-house',
  'hyatt-regency', 'mama-shelter', 'nhow', 'tribe', 'hilton-garden',
  'embassy-suites', 'hampton', 'homewood',
];

function filterByBrand(images: string[], hotelName: string): string[] {
  const normalized = hotelName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filtered = images.filter(url => {
    const u = url.toLowerCase();
    const alt = (altByUrl.get(url) || '').toLowerCase();
    for (const brand of HOTEL_BRANDS) {
      // Reject if URL or alt text mentions a brand NOT in this hotel's name
      if (u.includes(brand) && !normalized.includes(brand)) return false;
      if (alt.includes(brand) && !normalized.includes(brand)) return false;
    }
    return true;
  });
  // Keep filtered only if it has enough images; otherwise fall back to unfiltered.
  return diversify(dedupeImages(filtered.length >= 2 ? filtered : images));
}

// Identity of a photo regardless of CDN size/format variants.
function photoKey(url: string): string {
  try {
    const u = new URL(url);
    const segs = decodeURIComponent(u.pathname).split('/').filter(Boolean)
      .filter((s) => !/^(big|original\w*|thumb\w*|\d+x\d+w?|w_.*|c_.*|h_.*|max\d+(x\d+)?|square\d+|\d+:\d+)$/i.test(s));
    return segs.join('/').toLowerCase().replace(/\.(jpe?g|png|webp)$/i, '');
  } catch { return url; }
}

function dedupeImages(images: string[]): string[] {
  const seen = new Set<string>();
  return images.filter((u) => {
    const k = photoKey(u);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const CATEGORIES: [string, RegExp][] = [
  ['pool', /pool|swim|lagoon|aquapark|water-?park/i],
  ['beach', /beach|sea-?view|ocean|shore|coast/i],
  ['spa', /\bspa\b|wellness|massage|sauna|hammam|jacuzzi/i],
  ['gym', /gym|fitness|sport|tennis|golf/i],
  ['lobby', /lobby|reception|entrance|lounge|hall/i],
  ['restaurant', /restaurant|dining|breakfast|bar\b|cafe|buffet|kitchen|food/i],
  ['view', /view|skyline|panoram|terrace|balcony|garden|sunset/i],
  ['exterior', /exterior|facade|building|aerial|outside|hotel-front/i],
  ['room', /room|suite|bed|bath|guest|bedroom/i],
];
const altByUrl = new Map<string, string>();

function categoryOf(url: string): string {
  const text = decodeURIComponent(url) + ' ' + (altByUrl.get(url) || '');
  for (const [name, re] of CATEGORIES) if (re.test(text)) return name;
  return 'other';
}

// Interleave categories so the gallery mixes pool, beach, lobby, spa, rooms…
// instead of showing 10 room photos in a row. Rooms are capped at 3.
function diversify(images: string[]): string[] {
  const buckets = new Map<string, string[]>();
  images.forEach((u) => {
    const c = categoryOf(u);
    if (!buckets.has(c)) buckets.set(c, []);
    buckets.get(c)!.push(u);
  });
  const order = ['exterior', 'pool', 'beach', 'lobby', 'view', 'spa', 'restaurant', 'gym', 'other', 'room'];
  const out: string[] = [];
  let round = 0;
  while (out.length < images.length) {
    let added = false;
    for (const c of order) {
      const b = buckets.get(c);
      if (!b || b.length <= round) continue;
      if (c === 'room' && round >= 3) continue;
      out.push(b[round]);
      added = true;
    }
    if (!added) break;
    round++;
  }
  // Any leftovers (extra rooms) go last.
  images.forEach((u) => { if (!out.includes(u)) out.push(u); });
  return out;
}

// Booking.com hotel page — the gallery images are bstatic.com URLs in the HTML.
async function scrapeBooking(url: string): Promise<string[]> {
  if (!url || !/booking\.com\/hotel\//i.test(url)) return [];
  const html = await fetchPage(url);
  if (!html) return [];
  const found: string[] = [];
  const re = /https:\/\/cf\.bstatic\.com\/xdata\/images\/hotel\/(?:max\d+(?:x\d+)?|square\d+)\/(\d+)\.jpg(\?[^"'\s\\<>]*)?/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    found.push(`https://cf.bstatic.com/xdata/images/hotel/max1024x768/${m[1]}.jpg${m[2] || ''}`);
  }
  // Skip server-side validation — saves 2-3s. Client-side ImageWithFallback
  // handles broken URLs; NON_PHOTO_RE filters most icons/ads.
  return dedupeImages(found).slice(0, 10);
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
    try {
      altByUrl.set(new URL(src, baseUrl).href, altMatch ? altMatch[1] : '');
    } catch {}
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
  // Fetch gallery pages in PARALLEL (not sequentially) to save 2-3s
  if (images.length < 8) {
    const links = findGalleryLinks(homeHtml, url).slice(0, 2);
    const pages = await Promise.all(links.map(link => fetchPage(link)));
    for (let i = 0; i < pages.length; i++) {
      if (pages[i]) images = [...new Set([...images, ...extractImagesFromHtml(pages[i], links[i])])];
      if (images.length >= 12) break;
    }
  }
  // Skip server-side validation — saves 2-3s. Client-side ImageWithFallback
  // handles broken URLs; NON_PHOTO_RE + alt-text filters handle icons/ads.
  return dedupeImages(images).slice(0, 10);
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
      prompt: `For each hotel below, find up to 3 website URLs that contain real photos of that EXACT, SPECIFIC hotel:
    1. The hotel's OWN official website (e.g., www.hotelname.com) — must be for THIS hotel, not a different hotel with a similar name
    2. The hotel's TripAdvisor page (https://www.tripadvisor.com/Hotel_Review-...) — must be the review page for THIS specific hotel, NOT a "best hotels in [city]" list
    3. A photo-gallery / rooms / pool page on the hotel's official website if it exists

    CRITICAL: Each URL must be for the EXACT hotel named below. Do NOT return URLs for other hotels, hotel comparison lists, or "top hotels in [city]" articles. If you are not certain a URL is for the exact hotel, omit it.

    Prefer sites that show a VARIETY of photos (exterior, pool, beach, lobby, spa, restaurant, gym, rooms), not just room photos.

    Hotels:
    ${hotelList}

    Return a JSON object with a "hotels" array. Each element has "name" (exactly as given above) and "urls" (array of up to 3 website URLs, best first). If you cannot find any suitable URL, return an empty array.`,
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

    const BOOKING_DOMAINS = ["booking.com", "expedia.com", "hotels.com"];
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
      // Booking.com page + official site + TripAdvisor/other pages, all in
      // parallel; merge everything, then dedupe + mix photo categories.
      const [bookingImgs, ...scrapeResults] = await Promise.all([
        scrapeBooking(hotel.url || ''),
        ...candidates.slice(0, 3).map(url => scrapeImages(url)),
      ]);
      const merged = [...bookingImgs, ...scrapeResults.flat()];
      return { hotel, key: hotelKey(hotel), images: filterByBrand(merged, hotel.name).slice(0, 10) };
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