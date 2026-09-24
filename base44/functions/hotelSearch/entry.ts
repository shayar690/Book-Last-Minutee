// Hotel search — uses InvokeLLM with web search to find real hotels from Booking.com
// and other major booking sites. No API key required (uses built-in AI + web search).
// Returns: name, stars, rating, reviews, price, photos, amenities, Booking.com URL.
// Supports filtering by star rating, meal plan, early check-in, late check-out,
// free cancellation, and citizenship. Currency adapts to language (ILS for Hebrew).
// Progressive loading: batch 1 returns 20 hotels fast, batch 2 returns 20 more.
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

    // Build filter instructions for the LLM prompt
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

    // Exclusion list for batch 2 — avoid returning the same hotels twice.
    const excludeText = exclude.length > 0
      ? `\n\nIMPORTANT: Do NOT include any of these hotels (already shown to the user):\n${exclude.map((n) => `- ${n}`).join("\n")}\nReturn DIFFERENT hotels only.`
      : "";

    const hotelCount = 20;

    const prompt = `Search the web for hotels in "${destination}" available for check-in ${checkIn} and check-out ${checkOut} for ${adults} adults in ${rooms} room(s).${filterText}${excludeText}

CRITICAL INSTRUCTIONS:
1. Find REAL hotels from Booking.com, Hotels.com, Expedia, and other major booking sites. Major cities (Rome, Milan, Paris, London) have HUNDREDS of hotels — you MUST find at least ${hotelCount} real hotels. Even with filters applied, there are still many matching hotels. Do NOT return fewer than ${hotelCount} unless the city genuinely has fewer.
2. For each hotel, search the web to find REAL, WORKING image URLs. Visit the hotel's Booking.com page or search Google Images for the hotel. Valid image URL sources:
   - cf.bstatic.com, q-xx.bstatic.com (Booking.com CDN)
   - images.trvl-media.com (Expedia)
   - Hotel's official website
   - Google Images results
   Do NOT fabricate or guess image URLs. Only return URLs you actually found. If you cannot find real images, return an empty array [].
3. For each hotel, provide 5-8 DIFFERENT room types. Each room type must have its own real image, detailed description (2-3 sentences), and list of room-specific amenities.

For each hotel provide:
- name: Real hotel name
- stars: Star rating (1-5)
- rating: Guest rating (0-10, as on Booking.com)
- reviews: Number of guest reviews
- pricePerNight: Price per night in ${currencyName}
- currency: "${currency}"
- images: Array of 3-5 REAL photo URLs (search the web for each hotel)
- amenities: Array of key amenities (e.g. ["Free WiFi","Pool","Spa","Parking","Gym","Restaurant","Bar"])
- url: Direct link to the hotel on Booking.com
- description: Short description (1-2 sentences)
- fullDescription: Longer description (3-5 sentences) with more details about the hotel
- location: Area or neighborhood within the city
- distanceToCenter: Distance from city center in km (number, e.g. 0.5 = 500m, 2.5 = 2.5km)
- checkInTime: Check-in time (e.g. "14:00")
- checkOutTime: Check-out time (e.g. "12:00")
- policies: Hotel policies (cancellation, pets, smoking, etc.)
- guestReviews: Array of 3-5 recent guest reviews, each with: author (name), country, rating (0-10), date (e.g. "2024-06-15"), text (1-3 sentences)
- roomTypes: Array of 5-8 room types, each with: name, description (2-3 sentences), pricePerNight (in ${currencyName}), maxGuests (number), beds (e.g. "1 King bed"), image (REAL photo URL of the room — same rule as hotel images), amenities (array of room-specific amenities like ["Free WiFi","Air conditioning","Flat-screen TV","Minibar","Safe","Private bathroom","City view"])

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
                fullDescription: { type: "string" },
                location: { type: "string" },
                distanceToCenter: { type: "number" },
                checkInTime: { type: "string" },
                checkOutTime: { type: "string" },
                policies: { type: "string" },
                guestReviews: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      author: { type: "string" },
                      country: { type: "string" },
                      rating: { type: "number" },
                      date: { type: "string" },
                      text: { type: "string" }
                    }
                  }
                },
                roomTypes: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      pricePerNight: { type: "number" },
                      maxGuests: { type: "number" },
                      beds: { type: "string" },
                      image: { type: "string" },
                      amenities: { type: "array", items: { type: "string" } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const hotels = Array.isArray(result) ? result : (result.hotels || []);
    return Response.json({ hotels, batch });
  } catch (error) {
    return Response.json({ error: error.message, hotels: [], batch }, { status: 500 });
  }
}