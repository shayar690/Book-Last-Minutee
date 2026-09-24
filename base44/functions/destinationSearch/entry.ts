// OpenStreetMap Nominatim destination autocomplete — free, no API key.
// Usage policy: identify via User-Agent, max 1 req/sec (debounced client-side).
export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = (body.query || "").trim();
    const lang = body.lang || "en";
    if (query.length < 2) return Response.json({ results: [] });

    const url =
      "https://nominatim.openstreetmap.org/search?format=jsonv2" +
      "&q=" + encodeURIComponent(query) +
      "&addressdetails=1&limit=6&accept-language=" + encodeURIComponent(lang);

    const res = await fetch(url, {
      headers: { "User-Agent": "ATLAS-Travel-Booking/1.0 (atlas.travel)" },
    });

    const data = await res.json().catch(() => []);
    const results = (Array.isArray(data) ? data : []).map((r) => ({
      label: r.display_name,
      lat: r.lat,
      lon: r.lon,
      type: r.type,
      category: r.category,
    }));
    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}