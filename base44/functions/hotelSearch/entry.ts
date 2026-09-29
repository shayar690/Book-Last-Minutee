// Hotel search — uses InvokeLLM with web search to find real hotels.
// Returns BASIC info only (name, stars, rating, price, images, amenities, url).
// Full details (room types, guest reviews, policies) are fetched separately
// by the hotelDetail function when the user opens a hotel page.
// This split allows the search to return 20 hotels fast.
// Real images are fetched by the hotelImages function (LLM web search) as a
// background enhancement — no generic/illustration fallbacks here.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const MEAL_NAMES: Record<string, string> = {
  ro: "room only (no meals)",
  bb: "bed and breakfast",
  hb: "half board (breakfast and dinner)",
  fb: "full board (breakfast, lunch, and dinner)",
  ai: "all inclusive (all meals and drinks)",
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const {
      destination, checkIn, checkOut, adults = 2, rooms = 1, lang = "en",
      stars = "", meal = "", earlyIn = "", lateOut = "", freeCancel = false, citizenship = "",
      batch = 1, exclude = [],
    } = body;

    if (!destination) return Response.json({ error: "Destination required", hotels: [] }, { status: 400 });
    if (!checkIn || !checkOut) return Response.json({ error: "Dates required", hotels: [] }, { status: 400 });

    const languageName = lang === "he" ? "Hebrew" : "English";
    const currency = lang === "he" ? "ILS" : "USD";
    const currencyName = lang === "he" ? "Israeli Shekels (ILS)" : "USD";

    const filters: string[] = [];
    const starList = String(stars || "").split(",").map((s) => s.trim()).filter((s) => s && s !== "none");
    if (starList.length === 1) filters.push(`Only ${starList[0]}-star hotels`);
    else if (starList.length > 1) filters.push(`Only hotels with ${starList.join(", ")} stars`);
    const mealList = String(meal || "").split(",").map((m) => m.trim()).filter((m) => m && MEAL_NAMES[m]);
    if (mealList.length === 1) filters.push(`Include ${MEAL_NAMES[mealList[0]]} meal plan in the rate`);
    else if (mealList.length > 1) filters.push(`Include one of these meal plans in the rate: ${mealList.map((m) => MEAL_NAMES[m]).join(", ")}`);
    if (earlyIn) filters.push(`Early check-in requested at ${earlyIn}`);
    if (lateOut) filters.push(`Late check-out requested at ${lateOut}`);
    if (freeCancel) filters.push(`Only hotels with free cancellation`);
    if (citizenship) filters.push(`Guests' citizenship: ${citizenship}`);
    const filterText = filters.length > 0
      ? `\n\nApply these filters:\n${filters.map((f) => `- ${f}`).join("\n")}`
      : `\n\nNo additional filters were selected — return ALL available hotels matching only the destination, dates and guest count. Do NOT restrict by star rating, meal plan, cancellation policy, check-in/out time, citizenship or any other parameter.`;

    const excludeText = exclude.length > 0
      ? `\n\nIMPORTANT: Do NOT include any of these hotels (already shown to the user):\n${exclude.map((n) => `- ${n}`).join("\n")}\nReturn DIFFERENT hotels only.`
      : "";

    const hotelCount = 20;

    // SIMPLIFIED prompt — basic info only. No room types, no guest reviews,
    // no full description. This allows the LLM to return 20 hotels fast.
    // Full details are fetched by the hotelDetail function when the user
    // clicks on a hotel.
    const prompt = `Search the web for hotels in "${destination}" available for check-in ${checkIn} and check-out ${checkOut} for ${adults} adults in ${rooms} room(s).${filterText}${excludeText}

CRITICAL INSTRUCTIONS:
1. Find REAL hotels from Booking.com, Hotels.com, Expedia, and other major booking sites. Major cities (Rome, Milan, Paris, London, Dubai) have HUNDREDS of hotels — you MUST find at least ${hotelCount} real hotels. Do NOT return fewer than ${hotelCount} unless the city genuinely has fewer.
2. For each hotel, provide the EXACT Booking.com URL (e.g., https://www.booking.com/hotel/XX/NAME.html).

For each hotel provide ONLY these fields:
- name: Real hotel name
- stars: Star rating (1-5)
- rating: Guest rating (0-10, as on Booking.com)
- reviews: Number of guest reviews
- pricePerNight: Price per night in ${currencyName}
- currency: "${currency}"
- amenities: Array of 5-8 key amenities (e.g. ["Free WiFi","Pool","Spa","Parking","Gym","Restaurant","Bar"])
- url: EXACT Booking.com URL for this hotel
- description: Short description (1-2 sentences)
- location: Area or neighborhood within the city
- distanceToCenter: Distance from city center in km (number, e.g. 0.5 = 500m, 2.5 = 2.5km)

Return exactly ${hotelCount} hotels sorted by price (lowest first).
Also provide "totalFound": your best estimate of the TOTAL number of real hotels available in "${destination}" matching the dates and filters (not just the ${hotelCount} returned here). For major cities this should be in the hundreds; for small towns it may be only a few dozen.
HOTEL NAMES — CRITICAL RULES:
- For hotels OUTSIDE Israel: use the hotel's ORIGINAL ENGLISH name (e.g., "Taj Dubai", "Hilton Paris Opera", "Atlantis The Palm"). NEVER translate to Hebrew.
- For hotels IN Israel: use the HEBREW name (e.g., "דן תל אביב", "ירושלים גולד", "מצפה נופית").
- NEVER prefix or include the word "Hotel" or "מלון" in the name — just the proper hotel name itself (e.g., write "Taj Dubai" NOT "Hotel Taj Dubai", write "דן תל אביב" NOT "מלון דן תל אביב").
Descriptions should be in ${languageName}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: "gemini_3_flash",
      response_json_schema: {
        type: "object",
        additionalProperties: true,
        properties: {
          totalFound: { type: "number", description: "Estimated total number of hotels in this destination matching the search criteria" },
          hotels: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
              properties: {
                name: { type: "string" },
                stars: { type: "number" },
                rating: { type: "number" },
                reviews: { type: "number" },
                pricePerNight: { type: "number" },
                currency: { type: "string" },
                amenities: { type: "array", items: { type: "string" } },
                url: { type: "string" },
                description: { type: "string" },
                location: { type: "string" },
                distanceToCenter: { type: "number" },
                images: { type: "array", items: { type: "string" } },
              }
            }
          }
        }
      }
    });

    const hotels = Array.isArray(result) ? result : (result.hotels || []);
    const totalFound = !Array.isArray(result) && typeof result.totalFound === "number" && result.totalFound > 0
      ? result.totalFound
      : hotels.length;

    // Filter out invalid image URLs (page URLs, non-http, etc.). No generic
    // fallback images — the hotelImages function fetches real photos as a
    // background enhancement. If no valid images remain, the card shows a
    // clean placeholder until the real photos arrive.
    // LLM-provided image URLs are unreliable (hallucinated), so they are
    // discarded. The hotelImages function supplies verified real photos.
    const enrichedHotels = hotels.map((hotel) => ({ ...hotel, images: [] }));

    return Response.json({ hotels: enrichedHotels, totalFound, batch });
  } catch (error) {
    return Response.json({ error: error.message, hotels: [], totalFound: 0, batch }, { status: 500 });
  }
}