// OpenStreetMap Nominatim destination autocomplete — free, no API key.
// Usage policy: identify via User-Agent, max 1 req/sec (debounced client-side).
const HOTEL_TYPES = ["hotel", "hostel", "motel", "guest_house", "apartment", "chalet", "resort", "apartment_hotel", "apartments"];
const AIRPORT_TYPES = ["aerodrome", "helipad", "heliport"];

function classify(r) {
  const cat = (r.category || "").toLowerCase();
  const typ = (r.type || "").toLowerCase();
  if (cat === "tourism" && HOTEL_TYPES.includes(typ)) return "hotel";
  if (cat === "aeroway" && AIRPORT_TYPES.includes(typ)) return "airport";
  if (cat === "place") return "city";
  return "place";
}

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = (body.query || "").trim();
    const lang = body.lang || "en";
    const filter = body.filter || "";
    if (query.length < 2) return Response.json({ results: [] });

    const url =
      "https://nominatim.openstreetmap.org/search?format=jsonv2" +
      "&q=" + encodeURIComponent(query) +
      "&addressdetails=1&limit=10&accept-language=" + encodeURIComponent(lang);

    const res = await fetch(url, {
      headers: { "User-Agent": "ATLAS-Travel-Booking/1.0 (atlas.travel)" },
    });

    const data = await res.json().catch(() => []);
    const seen = new Set();
    const results = (Array.isArray(data) ? data : [])
      .map((r) => ({
        label: r.display_name,
        lat: r.lat,
        lon: r.lon,
        type: r.type,
        category: r.category,
        result_type: classify(r),
      }))
      .filter((r) => {
        if (filter === "hotels" && !["hotel", "city"].includes(r.result_type)) return false;
        const key = (r.label || "").toLowerCase().split(",")[0];
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}