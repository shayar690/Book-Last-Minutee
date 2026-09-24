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
- images: Array of 5-8 real photo URLs from the hotel's listing (exterior, lobby, rooms, pool, restaurant)
- amenities: Array of key amenities (e.g. ["Free WiFi","Pool","Spa","Parking","Gym","Restaurant","Bar"])
- url: Direct link to the hotel on Booking.com
- description: Short description (1-2 sentences)
- fullDescription: Longer description (3-5 sentences) with more details about the hotel
- location: Area or neighborhood within the city
- distanceToCenter: Distance from city center in km (number, e.g. 0.5 = 500m, 2.5 = 2.5km)
- checkInTime: Check-in time (e.g. "14:00")
- checkOutTime: Check-out time (e.g. "12:00")
- policies: Hotel policies (cancellation, pets, smoking, etc.)
- reviews: Array of 3-5 recent guest reviews, each with: author (name), country, rating (0-10), date (e.g. "2024-06-15"), text (1-3 sentences)
- roomTypes: Array of 3-5 room types available, each with: name, description (1 sentence), pricePerNight (USD), maxGuests (number), beds (e.g. "1 King bed"), image (photo URL of the room)

Return at least 40 hotels sorted by price (lowest first). If fewer exist, return as many as available.
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
                reviews: {
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
                      image: { type: "string" }
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
    return Response.json({ hotels });
  } catch (error) {
    return Response.json({ error: error.message, hotels: [] }, { status: 500 });
  }
}