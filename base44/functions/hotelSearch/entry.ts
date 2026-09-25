// Hotel search — uses InvokeLLM with web search to find real hotels.
// Returns BASIC info only (name, stars, rating, price, images, amenities, url).
// Full details (room types, guest reviews, policies) are fetched separately
// by the hotelDetail function when the user opens a hotel page.
// This split allows the search to return 20 hotels fast.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const MEAL_NAMES: Record<string, string> = {
  ro: "room only (no meals)",
  bb: "bed and breakfast",
  hb: "half board (breakfast and dinner)",
  fb: "full board (breakfast, lunch, and dinner)",
  ai: "all inclusive (all meals and drinks)",
};

// Fallback hotel images — high-quality travel/hotel photos from Unsplash.
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
  "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80",
  "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800&q=80",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&q=80",
  "https://images.unsplash.com/photo-1571003123894-1f5884c9a3d0?w=800&q=80",
  "https://images.unsplash.com/photo-1568084680786-a84f91d115c9?w=800&q=80",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
  "https://images.unsplash.com/photo-1535827841776-24afc1e128ac?w=800&q=80",
];

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
    if (stars && stars !== "none") filters.push(`Only ${stars}-star hotels`);
    if (meal && MEAL_NAMES[meal]) filters.push(`Include ${MEAL_NAMES[meal]} meal plan in the rate`);
    if (earlyIn) filters.push(`Early check-in requested at ${earlyIn}`);
    if (lateOut) filters.push(`Late check-out requested at ${lateOut}`);
    if (freeCancel) filters.push(`Only hotels with free cancellation`);
    if (citizenship) filters.push(`Guests' citizenship: ${citizenship}`);
    const filterText = filters.length > 0
      ? `\n\nApply these filters:\n${filters.map((f) => `- ${f}`).join("\n")}`
      : "";

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
3. For each hotel, provide 3-5 REAL image URLs from Booking.com's CDN (https://cf.bstatic.com/ or https://q-xx.bstatic.com/). If you cannot find real image URLs, leave the images array empty.

For each hotel provide ONLY these fields:
- name: Real hotel name
- stars: Star rating (1-5)
- rating: Guest rating (0-10, as on Booking.com)
- reviews: Number of guest reviews
- pricePerNight: Price per night in ${currencyName}
- currency: "${currency}"
- images: Array of 3-5 REAL photo URLs from cf.bstatic.com or q-xx.bstatic.com (leave empty if not found)
- amenities: Array of 5-8 key amenities (e.g. ["Free WiFi","Pool","Spa","Parking","Gym","Restaurant","Bar"])
- url: EXACT Booking.com URL for this hotel
- description: Short description (1-2 sentences)
- location: Area or neighborhood within the city
- distanceToCenter: Distance from city center in km (number, e.g. 0.5 = 500m, 2.5 = 2.5km)

Return exactly ${hotelCount} hotels sorted by price (lowest first).
Respond in ${languageName}. Hotel names and descriptions must be in ${languageName}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
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
                stars: { type: "number" },
                rating: { type: "number" },
                reviews: { type: "number" },
                pricePerNight: { type: "number" },
                currency: { type: "string" },
                images: { type: "array", items: { type: "string" } },
                amenities: { type: "array", items: { type: "string" } },
                url: { type: "string" },
                description: { type: "string" },
                location: { type: "string" },
                distanceToCenter: { type: "number" },
              }
            }
          }
        }
      }
    });

    const hotels = Array.isArray(result) ? result : (result.hotels || []);

    const isLikelyRealBstatic = (url) => {
      if (!url || !url.includes('bstatic.com')) return false;
      const match = url.match(/\/(\d+)\.(?:jpg|jpeg|png|webp)/i);
      if (!match) return false;
      const id = match[1];
      return id.length >= 7 && !/^12345[0-9]/.test(id) && !/^99999/.test(id);
    };

    const enrichedHotels = hotels.map((hotel, idx) => {
      const realImages = (hotel.images || []).filter(isLikelyRealBstatic);
      if (realImages.length >= 3) {
        hotel.images = realImages.slice(0, 5);
      } else {
        hotel.images = [
          FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
          FALLBACK_IMAGES[(idx + 1) % FALLBACK_IMAGES.length],
          FALLBACK_IMAGES[(idx + 2) % FALLBACK_IMAGES.length],
          FALLBACK_IMAGES[(idx + 3) % FALLBACK_IMAGES.length],
          FALLBACK_IMAGES[(idx + 4) % FALLBACK_IMAGES.length],
        ];
      }
      return hotel;
    });

    return Response.json({ hotels: enrichedHotels, batch });
  } catch (error) {
    return Response.json({ error: error.message, hotels: [], batch }, { status: 500 });
  }
}