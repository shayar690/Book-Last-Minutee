// Hotel detail — fetches FULL details for a single hotel.
// Called when the user opens a hotel page. Returns:
// fullDescription, guestReviews, roomTypes, policies, checkInTime, checkOutTime.
// Uses InvokeLLM with web search to find real data from Booking.com.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
  "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80",
  "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800&q=80",
];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const {
      hotelName, hotelUrl = "", destination, checkIn, checkOut,
      adults = 2, rooms = 1, lang = "en",
    } = body;

    if (!hotelName) return Response.json({ error: "Hotel name required" }, { status: 400 });

    const languageName = lang === "he" ? "Hebrew" : "English";
    const currency = lang === "he" ? "ILS" : "USD";
    const currencyName = lang === "he" ? "Israeli Shekels (ILS)" : "USD";

    const urlInstruction = hotelUrl
      ? `The hotel's Booking.com URL is: ${hotelUrl}. Visit this page to get accurate details.`
      : "";

    const prompt = `Search the web for detailed information about the hotel "${hotelName}" in "${destination}".${urlInstruction}

The hotel is being booked for check-in ${checkIn} and check-out ${checkOut} for ${adults} adults in ${rooms} room(s).

Provide the following details for this hotel:

1. fullDescription: A detailed description of the hotel (3-5 sentences) covering its style, location, and key features.
2. checkInTime: Check-in time (e.g. "14:00")
3. checkOutTime: Check-out time (e.g. "12:00")
4. policies: Hotel policies (cancellation, pets, smoking, etc.) — 2-3 sentences.
5. guestReviews: Array of 3-5 recent guest reviews, each with:
   - author: Guest name
   - country: Guest's country
   - rating: Rating (0-10)
   - date: Review date (e.g. "2024-06-15")
   - text: Review text (1-3 sentences)
6. roomTypes: Array of 5-8 room types available at this hotel, each with:
   - name: Room type name
   - description: Room description (2-3 sentences)
   - pricePerNight: Price per night in ${currencyName}
   - maxGuests: Maximum guests (number)
   - beds: Bed configuration (e.g. "1 King bed")
   - amenities: Array of room-specific amenities (e.g. ["Free WiFi","Air conditioning","Flat-screen TV","Minibar","Safe","Private bathroom","City view"])
7. images: Array of 5-8 REAL photo URLs of THIS SPECIFIC hotel. Search the web for actual photos from the hotel's Booking.com page, official website, or Google Images. Return ONLY direct image URLs (ending in .jpg, .jpeg, .png, or .webp) that can be loaded in an <img> tag. Do NOT return page URLs — only direct image file URLs. The photos must show the actual hotel, its rooms, lobby, exterior, pool, restaurant, etc.

Respond in ${languageName}. All text must be in ${languageName}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: "gemini_3_flash",
      response_json_schema: {
        type: "object",
        additionalProperties: true,
        properties: {
          fullDescription: { type: "string" },
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
                amenities: { type: "array", items: { type: "string" } }
              }
            }
          },
          images: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });

    const details = Array.isArray(result) ? {} : (result || {});

    // Add fallback images to room types
    if (details.roomTypes && details.roomTypes.length > 0) {
      details.roomTypes = details.roomTypes.map((room, i) => ({
        ...room,
        image: room.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
      }));
    }

    return Response.json({ details });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}