// Detects the visitor's country from the request for locale auto-selection.
// Priority: CDN/proxy geo headers (no external call) → server-side IP geolocation.
// Returns { country: "IL" | "US" | ... , source } or { country: "" } when unknown.

const GEO_HEADERS = [
  "cf-ipcountry",
  "x-vercel-ip-country",
  "x-country-code",
  "geo-country",
  "x-geo-country",
  "x-geoip-country",
  "x-amz-cf-ipcountry",
];

function header(req, name) {
  return req.headers.get(name) || req.headers.get(name.toLowerCase()) || "";
}

function clientIp(req) {
  const xff = header(req, "x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return header(req, "cf-connecting-ip") || header(req, "x-real-ip") || header(req, "true-client-ip");
}

export default async function (req) {
  try {
    // 1. CDN/proxy geo headers — fastest and most reliable when present.
    for (const h of GEO_HEADERS) {
      const val = header(req, h);
      if (val && /^[A-Z]{2}$/i.test(val)) {
        return Response.json({ country: val.toUpperCase(), source: "header:" + h });
      }
    }

    // 2. Server-side IP geolocation using the visitor's real IP.
    const ip = clientIp(req);
    if (ip && !/^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|::1$|fc|fd)/.test(ip)) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: controller.signal });
        clearTimeout(timer);
        if (res.ok) {
          const data = await res.json();
          const country = (data?.country_code || "").toUpperCase();
          if (country) return Response.json({ country, source: "ipapi" });
        }
      } catch {
        // fall through
      }
    }

    return Response.json({ country: "", source: "unknown" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}