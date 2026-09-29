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

// "Boring" imagery that doesn't sell a hotel: people/lifestyle shots, event/
// meeting photos, co-working / office spaces, casual lounge / sitting areas
// (poufs, beanbags, TV nooks), and kids' areas. We only want attractive,
// promotional photography — pool, facilities, lobby, building exterior, views,
// rooms. Matched against both the image URL/filename and its alt text.
// Lookarounds (not \b) treat "_" and "-" as boundaries, so "under_construction"
// and "British_tabloids" match the "construction" / "tabloids" terms.
const BORING_RE = /(?<![a-z0-9])(people|person|persons|crowd|crowds|portrait|selfie|lifestyle|staff|team|teams|group|groups|guests|event|events|party|parties|wedding|weddings|meeting|meetings|conference|conferences|seminar|seminars|boardroom|gala|galas|banquet|banquets|celebration|workspace|workspaces|coworking|co-working|office|offices|startup|startups|lounge|lounges|livingroom|living-room|sitting|commonroom|common-room|beanbag|beanbags|pouf|poufs|kids|child|children|baby|babies|toddler|toddlers|tabloid|tabloids|newspaper|newspapers|construction|scaffolding|renovation|renovations|blueprint|diagram|cartoon|drawing|painting|illustration)(?![a-z0-9])/i;

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
  ['lobby', /lobby|reception|entrance|hall/i],
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
  return found.filter((u) => {
    if (!/^https?:/i.test(u) || !/\.(?:jpe?g|png|webp)/i.test(u) || NON_PHOTO_RE.test(u)) return false;
    const alt = altByUrl.get(u) || '';
    if (BORING_RE.test(u) || BORING_RE.test(alt)) return false;
    return true;
  });
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
  return [...new Set(out)].slice(0, 5);
}

// Scrape one candidate site: home page (verified) + up to 3 gallery pages.
async function scrapeSite(url: string, hotelName: string): Promise<string[]> {
  const home = await fetchPage(url);
  if (!home || !pageIsForHotel(home, hotelName)) return [];
  let images = extractImages(home, url);
  if (images.length < 20) {
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
// Bing image search — returns real photos (Booking.com / TripAdvisor / hotel
// sites CDNs) for the hotel. Several queries run in parallel for variety.
async function bingImages(hotelName: string, destination: string): Promise<string[]> {
  // Bing is very sensitive to phrasing, so several variants run in parallel and
  // their results are merged ("Citymax Hotel Bur Dubai" works where
  // "Citymax Bur Dubai hotel" returns anime art).
  const words = hotelName.trim().split(/\s+/);
  const hasHotel = /hotel|resort|inn|suites/i.test(hotelName);
  const withDest = destination && !hotelName.toLowerCase().includes(destination.toLowerCase()) ? `${hotelName} ${destination}` : hotelName;
  const queries = [...new Set([
    hasHotel ? hotelName : [words[0], 'Hotel', ...words.slice(1)].join(' '),
    hasHotel ? withDest : `Hotel ${hotelName}`,
    withDest,
    hasHotel ? `${withDest} photos` : `${[words[0], 'Hotel', ...words.slice(1)].join(' ')} ${destination}`.trim(),
  ])];
  const trusted = /bstatic\.com|tripadvisor\.com|travelapi\.com|agoda\.net|mmtcdn\.com|hotelimages|cdn-zen/i;
  const destWords = new Set(destination.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean));
  const tokens = nameTokens(hotelName).filter((tk) => !destWords.has(tk) && tk.length > 2);
  // Keep only photos from Booking/TripAdvisor-type CDNs, or whose URL mentions the hotel's name.
  const relevant = (list: string[]) => list.filter((u) => {
    if (!/^https?:/i.test(u) || !/\.(?:jpe?g|png|webp)/i.test(u) || NON_PHOTO_RE.test(u) || BORING_RE.test(u)) return false;
    if (trusted.test(u)) return true;
    const low = u.toLowerCase();
    return tokens.length > 0 && tokens.every((tk) => low.includes(tk));
  });
  const parse = (html: string) => [...html.matchAll(/murl&quot;:&quot;(.*?)&quot;/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  const lists = await Promise.all(queries.map(async (q) => {
    let best: string[] = [];
    // Bing results vary from request to request (sometimes unrelated art, or a
    // stripped page); retry until the query yields enough relevant photos.
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 4000);
        const res = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(q)}&first=1`, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' }, signal: ctrl.signal });
        clearTimeout(t);
        const got = relevant(res.ok ? parse(await res.text()) : []);
        if (got.length > best.length) best = got;
        if (best.length >= 8) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 300));
    }
    return best;
  }));
  // Interleave the result lists so the pool mixes exterior/pool/room shots.
  const merged: string[] = [];
  for (let i = 0; i < 60; i++) lists.forEach((l) => { if (l[i]) merged.push(l[i]); });
  return dedupe([...merged.filter((u) => trusted.test(u)), ...merged.filter((u) => !trusted.test(u))]);
}

async function wikiImages(hotelName: string, destination = ''): Promise<string[]> {
  const out: string[] = [];
  let title = '';
  try {
    const s = await fetchPage(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(hotelName + ' hotel')}&srnamespace=0&srlimit=1&format=json`);
    title = (JSON.parse(s).query?.search?.[0]?.title) || '';
  } catch {}
  if (!title) return out;
  // Reject obviously unrelated articles (must share a distinctive name token).
  // Strict: every distinctive word of the hotel name (excluding the city) must
  // appear as a whole word in the article title — "Citymax Bur Dubai" must NOT
  // match "Burj Al Arab".
  const destWords = new Set(destination.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean));
  const tokens = nameTokens(hotelName).filter((tk) => !destWords.has(tk));
  const twords = new Set(title.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean));
  if (tokens.length === 0 || !tokens.every((tk) => twords.has(tk))) return out;
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

// Vision-based curation: a multimodal LLM looks at each candidate photo and
// keeps only attractive, promotional shots of THIS hotel — exterior, pool,
// beach, lobby, restaurant, spa, gym, room, view. People, boring workspace/
// lounge areas, construction, documents/maps and anything that isn't a real
// photo of the hotel are rejected. This is the only reliable way to detect
// people and boring content, since most hotel image filenames are generic
// (e.g. "DOW-5.jpg") and carry no keyword signal.
async function visionFilter(base44: any, hotelName: string, destination: string, candidates: string[]): Promise<string[]> {
  if (!candidates || candidates.length === 0) return [];
  const pool = candidates.slice(0, 16);
  try {
    const labeled = pool.map((u, i) => `${i + 1}. ${u}`).join('\n');
    const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are curating the photo gallery for a luxury hotel booking website. The hotel is "${hotelName}" in ${destination || 'the city'}.\n\nBelow are ${pool.length} candidate image URLs. Look at EACH image and decide whether it is an ATTRACTIVE, PROMOTIONAL photograph of THIS hotel that would make a guest want to book — for example: exterior/building, pool, beach, lobby, restaurant, spa, gym, room/suite, or a scenic view/landscape of the property.\n\nEXCLUDE any image that:\n- contains people (guests, staff, models, crowds) — even partially\n- shows a boring workspace, co-working area, meeting room, or lounge with beanbags/poufs/low tables\n- shows construction, renovation, scaffolding, or unfinished interiors\n- is a document, newspaper, tabloid, map, logo, screenshot, or anything that is NOT a real photo of this hotel\n- is blurry, dark, or low quality
- clearly shows a DIFFERENT, famous property or landmark (e.g. Burj Al Arab, Burj Khalifa, Atlantis) rather than this hotel
- is a floor plan, ad banner, or has large text overlays\n\nReturn JSON with a "keep" array of the 1-based INDICES of the best images, ordered from most attractive to least, maximum 10. Only include images you are confident show the actual hotel. If fewer than 10 are good, return fewer.\n\nCandidate images (index → URL):\n${labeled}`,
      file_urls: pool,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        additionalProperties: true,
        properties: {
          keep: { type: 'array', items: { type: 'number' } },
        },
      },
    });
    const keep: number[] = (res && Array.isArray(res.keep)) ? res.keep.map((n: any) => Number(n)).filter((n: number) => !Number.isNaN(n)) : [];
    const selected: string[] = [];
    const seen = new Set<number>();
    for (const idx of keep) {
      const i = idx - 1;
      if (i >= 0 && i < pool.length && !seen.has(i)) {
        seen.add(i);
        selected.push(pool[i]);
      }
    }
    return selected;
  } catch {
    return [];
  }
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { hotels = [] } = body;
    if (!hotels || hotels.length === 0) return Response.json({ results: {} });

    const normalize = (s: string) => (s || '').toLowerCase().trim();
    const hotelKey = (h: any) => `v8|${normalize(h.name)}|${normalize(h.destination || '')}`;

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
    const wikiPromise = Promise.all(uncached.map((h: any) => wikiImages(h.name, h.destination || '')));
    const bingPromise = Promise.all(uncached.map((h: any) => bingImages(h.name, h.destination || '')));

    const wikiResults = await wikiPromise;
    const bingResults = await bingPromise;
    const wikiByHotel = new Map<string, string[]>();
    uncached.forEach((h: any, i: number) => wikiByHotel.set(normalize(h.name), wikiResults[i]));

    const scraped = await Promise.all(uncached.map(async (hotel: any, idx: number) => {
      const wikiUrls = (wikiByHotel.get(normalize(hotel.name)) || []).map(upgradeWikiThumb);
      // Bing candidates (Booking.com / TripAdvisor / hotel-site photos) are
      // checked by a vision model in two parallel batches: it removes people,
      // boring rooms, and photos that clearly belong to another property.
      const cands = bingResults[idx].slice(0, 30);
      const batches = [cands.slice(0, 15), cands.slice(15, 30)].filter((b) => b.length > 0);
      const picked = (await Promise.all(batches.map((b) => visionFilter(base44, hotel.name, hotel.destination || '', b)))).flat();
      const images = dedupe([...picked, ...wikiUrls]).slice(0, MAX_IMAGES);
      console.log('DBG', cands.length, picked.length, JSON.stringify(cands.slice(0, 4)));
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