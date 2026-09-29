// Hotel images — real photos scraped from each hotel's own pages.
// 1. Cache lookup (instant on repeat views).
// 2. LLM + web search finds the hotel's official site / TripAdvisor page.
// 3. Every candidate page is VERIFIED: its <title>/og:title must contain the
//    hotel's distinctive name, otherwise the page (and all its photos) is
//    discarded — this is what prevents photos of other hotels.
// 4. Photos are de-duplicated by real photo identity (CDN size variants
//    collapse into one) and interleaved by category (pool, spa, lobby, room…).
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const FETCH_TIMEOUT = 2500;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
const MAX_IMAGES = 10;

const HDR = {
  'User-Agent': UA,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Upgrade-Insecure-Requests': '1',
};

async function fetchPage(url: string): Promise<string> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT);
    const res = await fetch(url, { headers: HDR, redirect: 'follow', signal: ctrl.signal });
    clearTimeout(t);
    return res.ok ? await res.text() : '';
  } catch {
    return '';
  }
}

const NON_PHOTO_RE = new RegExp(
  'logo|icon|favicon|sprite|1x1|pixel|button|arrow|avatar|social|flag|blank|placeholder|tracking|loader|spinner|' +
  'award|rating|badge|certificate|seal|stamp|ribbon|_next\\/|\\/static\\/|whatsapp|facebook|twitter|instagram|' +
  'linkedin|youtube|ytimg|tiktok|share|newsletter|signup|promo|flyer|coupon|voucher|credit-?card|bonvoy|' +
  'mastercard|amex|loyalty|qr|barcode|map-|amenity-|service-|facility-|chevron|star-icon|hqdefault|default-thumb|' +
  'maps\\.wikimedia|osm-intl|250x200|\\.svg|\\.gif',
  'i'
);
const AD_ALT_RE = /credit\s*card|bonvoy|visa|mastercard|amex|loyalty|reward|apply\s*now|sign\s*up|join\s*now|sponsor|advertisement|limited\s*time|exclusive\s*offer/i;

const GENERIC = new Set(['the', 'hotel', 'hotels', 'resort', 'resorts', 'spa', 'and', 'by', 'at', 'of', 'in', 'suites', 'suite', 'inn', 'palace', 'grand', 'royal', 'residence', 'residences', 'collection', 'city', 'center', 'centre', 'downtown', 'beach', 'club', 'boutique', 'luxury', 'international', 'plaza', 'tower', 'towers']);

function nameTokens(name: string): string[] {
  const all = name.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((t) => t.length > 1);
  const distinct = all.filter((t) => !GENERIC.has(t));
  return distinct.length > 0 ? distinct : all;
}

// A page belongs to the hotel only if its title mentions the hotel's name.
function pageIsForHotel(html: string, hotelName: string): boolean {
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '';
  const og = (html.match(/<meta[^>]+property=["']og:(?:title|site_name)["'][^>]+content=["']([^"']*)["']/i) || [])[1] || '';
  const haystack = (title + ' ' + og).toLowerCase();
  const tokens = nameTokens(hotelName);
  if (tokens.length === 0) return true;
  const hits = tokens.filter((t) => haystack.includes(t)).length;
  return hits >= Math.min(tokens.length, 2) || hits / tokens.length >= 0.6;
}

// Wikipedia thumbnail URLs are served at a small default size (often 120px or
// 320px), which looks blurry on screen. Upgrade them to the largest standard
// render (1280px) so displayed photos are crisp. Only applies to upload/thumb
// wikimedia URLs; other URLs pass through unchanged.
function upgradeWikiThumb(url: string): string {
  try {
    const u = new URL(url);
    if (!/upload\.wikimedia\.org|thumb\.wikimedia\.org/i.test(u.hostname)) return url;
    if (!/\/thumb\//i.test(u.pathname)) return url;
    // Replace the leading "<digits>px-" size in the final path segment.
    u.pathname = u.pathname.replace(/\/\d+px-([^/]+)$/, '/1280px-$1');
    // Drop tracking query so the browser caches the canonical URL.
    u.search = '';
    return u.href;
  } catch {
    return url;
  }
}

// Identity of a photo regardless of CDN size/format variants.
function photoKey(url: string): string {
  try {
    const u = new URL(url);
    const segs = decodeURIComponent(u.pathname).split('/').filter(Boolean);
    const file = (segs.pop() || '').toLowerCase()
      .replace(/(\.(jpe?g|png|webp))+$/i, '')
      .replace(/^\d+px-/, '')
      .replace(/[-_@]?\d{2,4}x\d{2,4}/g, '')
      .replace(/[-_](scaled|copy|small|medium|large|thumb\w*|original|big|\d{1,3})$/g, '');
    const dir = segs.filter((s) => !/^(big|original\w*|thumb\w*|\d+x\d+w?|w_.*|c_.*|h_.*|f_.*|q_.*|max\d+(x\d+)?|square\d+|\d+:\d+|v\d+)$/i.test(s)).join('/').toLowerCase();
    return (dir + '/' + file).replace(/[^a-z0-9/]/g, '');
  } catch {
    return url;
  }
}

function dedupe(images: string[]): string[] {
  const seen = new Set<string>();
  return images.filter((u) => {
    const k = photoKey(u);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const CATEGORIES: [string, RegExp][] = [
  ['exterior', /exterior|facade|building|aerial|outside|front|skyline/i],
  ['pool', /pool|swim|lagoon|aquapark|water-?park/i],
  ['beach', /beach|ocean|shore|coast|sea/i],
  ['lobby', /lobby|reception|entrance|lounge|hall/i],
  ['spa', /\bspa\b|wellness|massage|sauna|hammam|jacuzzi|treatment/i],
  ['gym', /gym|fitness|sport|tennis|golf/i],
  ['restaurant', /restaurant|dining|breakfast|\bbar\b|cafe|buffet|kitchen|food|cuisine/i],
  ['view', /view|panoram|terrace|balcony|garden|sunset/i],
  ['room', /room|suite|bed|bath|guest/i],
];
const altByUrl = new Map<string, string>();

function categoryOf(url: string): string {
  let text = url;
  try { text = decodeURIComponent(url); } catch {}
  text += ' ' + (altByUrl.get(url) || '');
  for (const [name, re] of CATEGORIES) if (re.test(text)) return name;
  return 'other';
}

// Round-robin across categories; rooms are limited to 3 so the gallery is a
// real mix instead of 10 bedrooms.
function diversify(images: string[]): string[] {
  const buckets = new Map<string, string[]>();
  images.forEach((u) => {
    const c = categoryOf(u);
    if (!buckets.has(c)) buckets.set(c, []);
    buckets.get(c)!.push(u);
  });
  const order = ['pool', 'view', 'exterior', 'beach', 'spa', 'gym', 'lobby', 'restaurant', 'other', 'room'];
  const out: string[] = [];
  for (let round = 0; round < 12 && out.length < images.length; round++) {
    for (const c of order) {
      const b = buckets.get(c);
      if (!b || b.length <= round) continue;
      if (c === 'room' && round >= 2) continue;
      out.push(b[round]);
    }
  }
  return out;
}

function extractImages(html: string, baseUrl: string): string[] {
  const found: string[] = [];
  let m;
  const imgRe = /<img\b[^>]*>/gi;
  while ((m = imgRe.exec(html)) !== null) {
    const tag = m[0];
    const src = tag.match(/(?:src|data-src|data-lazy-src|data-original)=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
    if (!src) continue;
    const alt = (tag.match(/\balt=["']([^"']*)["']/i) || [])[1] || '';
    if (AD_ALT_RE.test(alt)) continue;
    const w = parseInt((tag.match(/\bwidth=["']?(\d+)/i) || [])[1] || '0', 10);
    const h = parseInt((tag.match(/\bheight=["']?(\d+)/i) || [])[1] || '0', 10);
    if (w > 0 && h > 0 && (w / h > 3.5 || w / h < 0.25 || w < 200)) continue;
    try {
      const abs = new URL(src[1], baseUrl).href;
      found.push(abs);
      altByUrl.set(abs, alt);
    } catch {}
  }
  // srcset / data-srcset: take the largest candidate (URLs may contain commas).
  const setRe = /(?:srcset|data-srcset)=["']([^"']+)["']/gi;
  while ((m = setRe.exec(html)) !== null) {
    const urls = m[1].match(/https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"']*)?/gi) || [];
    if (urls.length) found.push(urls[urls.length - 1].replace(/[,;]$/, ''));
  }
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  if (og && /\.(?:jpe?g|png|webp)/i.test(og[1])) { try { found.unshift(new URL(og[1], baseUrl).href); } catch {} }
  return found.filter((u) => /^https?:/i.test(u) && /\.(?:jpe?g|png|webp)/i.test(u) && !NON_PHOTO_RE.test(u));
}

function galleryLinks(html: string, baseUrl: string): string[] {
  let base: URL;
  try { base = new URL(baseUrl); } catch { return []; }
  const out: string[] = [];
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!/gallery|photo|pool|spa|dining|rooms|suites|facilit|bilder|foto/i.test(m[1] + ' ' + m[2])) continue;
    try {
      const r = new URL(m[1], baseUrl);
      if (r.hostname === base.hostname && r.pathname !== base.pathname) out.push(r.href);
    } catch {}
  }
  return [...new Set(out)].slice(0, 3);
}

// Scrape one candidate site: home page (verified) + up to 3 gallery pages.
async function scrapeSite(url: string, hotelName: string): Promise<string[]> {
  const home = await fetchPage(url);
  if (!home || !pageIsForHotel(home, hotelName)) return [];
  let images = extractImages(home, url);
  if (images.length < 14) {
    const links = galleryLinks(home, url);
    const pages = await Promise.all(links.map((l) => fetchPage(l)));
    pages.forEach((p, i) => { if (p) images = images.concat(extractImages(p, links[i])); });
  }
  return images;
}

// Wikipedia fallback — reliable real photos for notable hotels that block
// direct scraping (Atlantis, JW Marriott Marquis, etc.). Uses the public
// Wikipedia REST/search APIs (no auth, not bot-blocked) to find the article,
// then pulls the lead image + infobox photos from upload.wikimedia.org.
async function wikiImages(hotelName: string): Promise<string[]> {
  const out: string[] = [];
  let title = '';
  try {
    const s = await fetchPage(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(hotelName + ' hotel')}&srnamespace=0&srlimit=1&format=json`);
    title = (JSON.parse(s).query?.search?.[0]?.title) || '';
  } catch {}
  if (!title) return out;
  // Reject obviously unrelated articles (must share a distinctive name token).
  const tokens = nameTokens(hotelName);
  const tlow = title.toLowerCase();
  if (tokens.length > 0 && !tokens.some((tk) => tlow.includes(tk)) && !tlow.includes('hotel') && !tlow.includes('resort')) return out;
  const slug = encodeURIComponent(title.replace(/ /g, '_'));
  try {
    const sum = await fetchPage(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`);
    const j = JSON.parse(sum);
    // Prefer the original (full-resolution) image; skip the low-res thumbnail.
    if (j.originalimage?.source) out.push(j.originalimage.source);
  } catch {}
  const html = await fetchPage(`https://en.wikipedia.org/wiki/${slug}`);
  if (html) {
    const imgs = extractImages(html, 'https://en.wikipedia.org/wiki/' + slug)
      .filter((u) => /upload\.wikimedia\.org\/wikipedia\//i.test(u) && !out.includes(u))
      .map(upgradeWikiThumb);
    out.push(...imgs);
  }
  return out;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { hotels = [] } = body;
    if (!hotels || hotels.length === 0) return Response.json({ results: {} });

    const normalize = (s: string) => (s || '').toLowerCase().trim();
    const hotelKey = (h: any) => `v3|${normalize(h.name)}|${normalize(h.destination || '')}`;

    const batch = hotels.slice(0, 10);
    const results: Record<string, string[]> = {};
    let uncached = batch;

    try {
      const cached = await base44.asServiceRole.entities.HotelImageCache.filter(
        { hotel_key: { $in: batch.map(hotelKey) } }, { limit: 50 }
      );
      const map = new Map<string, string[]>();
      (cached.items || []).forEach((c: any) => { if (c.images && c.images.length > 0) map.set(c.hotel_key, c.images); });
      uncached = [];
      batch.forEach((h: any) => {
        const imgs = map.get(hotelKey(h));
        if (imgs) results[h.url || h.name] = imgs.map(upgradeWikiThumb);
        else uncached.push(h);
      });
    } catch {
      uncached = batch;
    }
    if (uncached.length === 0) return Response.json({ results });

    // Start Wikipedia fetches immediately — they don't depend on the LLM, so
    // running them concurrently with the web-search call makes images for
    // blocked hotels (sourced from Wikipedia) arrive much sooner.
    const wikiPromise = Promise.all(uncached.map((h: any) => wikiImages(h.name)));

    const list = uncached.map((h: any, i: number) => `${i + 1}. "${h.name}" — hotel in ${h.destination || ''}`).join('\n');
    const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `For each hotel find up to 4 web pages with real photos of that EXACT hotel: (1) its official website home page, (2) its official gallery/photos page, (3) its English Wikipedia article page (https://en.wikipedia.org/wiki/...) if the hotel is notable enough to have one, (4) its TripAdvisor Hotel_Review page. Never return other hotels, "best hotels in city" lists, or booking-aggregator sites (booking.com, expedia, hotels.com, agoda). If unsure about a URL, omit it.\n\n${list}\n\nReturn JSON {"hotels":[{"name":"exactly as given","urls":["..."]}]}.`,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        additionalProperties: true,
        properties: {
          hotels: { type: 'array', items: { type: 'object', additionalProperties: true, properties: { name: { type: 'string' }, urls: { type: 'array', items: { type: 'string' } } } } },
        },
      },
    });

    const BOOKING = ['booking.com', 'expedia.com', 'hotels.com', 'agoda.com', 'kayak.com', 'trivago.com'];
    const urlMap: Record<string, string[]> = {};
    ((llm && llm.hotels) || []).forEach((h: any) => {
      if (!h.name || !Array.isArray(h.urls)) return;
      urlMap[normalize(h.name)] = h.urls.filter((u: string) => {
        try { const host = new URL(u).hostname; return !BOOKING.some((d) => host === d || host.endsWith('.' + d)); } catch { return false; }
      });
    });

    const wikiResults = await wikiPromise;
    const wikiByHotel = new Map<string, string[]>();
    uncached.forEach((h: any, i: number) => wikiByHotel.set(normalize(h.name), wikiResults[i]));

    const scraped = await Promise.all(uncached.map(async (hotel: any) => {
      const candidates = (urlMap[normalize(hotel.name)] || []).slice(0, 3);
      const siteLists = await Promise.all(candidates.map((u) => scrapeSite(u, hotel.name)));
      const wiki = wikiByHotel.get(normalize(hotel.name)) || [];
      const images = diversify(dedupe([...siteLists.flat(), ...wiki])).slice(0, MAX_IMAGES);
      return { hotel, images };
    }));

    const toCache: any[] = [];
    scraped.forEach((s) => {
      results[s.hotel.url || s.hotel.name] = s.images.map(upgradeWikiThumb);
      if (s.images.length >= 3) {
        toCache.push({
          hotel_key: hotelKey(s.hotel),
          hotel_name: s.hotel.name,
          destination: s.hotel.destination || '',
          url: s.hotel.url || '',
          images: s.images,
        });
      }
    });
    if (toCache.length > 0) {
      try { await base44.asServiceRole.entities.HotelImageCache.bulkCreate(toCache); } catch {}
    }
    return Response.json({ results });
  } catch (error) {
    return Response.json({ results: {}, error: error.message });
  }
}