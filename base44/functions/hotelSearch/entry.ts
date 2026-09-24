// Hotel search — uses InvokeLLM with web search to find real hotels from Booking.com
// and other major booking sites. No API key required (uses built-in AI + web search).
// Returns: name, stars, rating, reviews, price, photos, amenities, Booking.com URL.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { destination, checkIn, checkOut, adults = 2, rooms = 1, lang = "en" } = body;

    if (!destination) return Response.json({ error: "Destination required", hotels: [] }, { status: 400 });
    if (!checkIn || !checkOut) return Response.json({ error: "Dates required", hotels: [] }, { status: 400 });

    const languageName = lang === "he" ? "Hebrew" : "English";
    const prompt = `Search the web for hotels in "${destination}" available for check-in ${checkIn} and check-out ${checkOut} for ${adults} adults in ${rooms} room(s).

Find REAL hotels from Booking.com, Hotels.com, Expedia, and other major booking sites. For each hotel provide:
- name: Real hotel name
- stars: Star rating (1-5)
- rating: Guest rating (0-10, as on Booking.com)
- reviews: Number of guest reviews
- pricePerNight: Price per night in USD
- currency: "USD"
- image: Real photo URL from the hotel's listing
- amenities: Array of key amenities (e.g. ["Free WiFi","Pool","Spa","Parking","Gym","Restaurant","Bar"])
- url: Direct link to the hotel on Booking.com
- description: Short description (1-2 sentences)
- location: Area or neighborhood within the city

Return at least 12 hotels sorted by price (lowest first). If fewer exist, return as many as available.
Respond in ${languageName}. Hotel names and descriptions must be in ${languageName}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: "gemini_3_8_flash",
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
                image: { type: "string" },
                amenities: { type: "array", items: { type: "string" } },
                url: { type: "string" },
                description: { type: "string" },
                location: { type: "string" }
              }
            }
          }
        }
      }
    });

    const hotels = Array.isArray(result) ? result : (result.hotels || []);
    return Response.json({ hotels });
  } catch (error) {
    return Response.json({ error: error.message, hotels: [] }, { status: 500 });
  }
}