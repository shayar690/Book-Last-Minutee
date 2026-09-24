// Flight search — uses InvokeLLM with web search to find real flights from Skyscanner,
// Kayak, Google Flights and other major flight search sites. No API key required.
// Returns: airline, times, duration, stops, price, booking URL.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { origin, originCode, destination, destinationCode, departureDate, returnDate, adults = 1, cabinClass = "economy", lang = "en" } = body;

    if (!origin || !destination) return Response.json({ error: "Origin and destination required", flights: [] }, { status: 400 });
    if (!departureDate) return Response.json({ error: "Departure date required", flights: [] }, { status: 400 });

    const tripType = returnDate ? "round-trip" : "one-way";
    const returnClause = returnDate ? ` returning ${returnDate}` : "";
    const languageName = lang === "he" ? "Hebrew" : "English";
    const prompt = `Search the web for ${tripType} flights from "${origin}" (${originCode || "N/A"}) to "${destination}" (${destinationCode || "N/A"}) departing ${departureDate}${returnClause} for ${adults} adults in ${cabinClass} class.

Find REAL flights from Skyscanner, Kayak, Google Flights and other major flight search sites. For each flight provide:
- airline: Real airline name
- flightNumber: Flight number if available
- departureAirport: Departure airport code (e.g. "TLV")
- departureTime: Departure time (HH:MM)
- arrivalAirport: Arrival airport code (e.g. "JFK")
- arrivalTime: Arrival time (HH:MM)
- duration: Flight duration (e.g. "12h 15m")
- stops: Number of stops (0=direct, 1=one stop, etc.)
- price: Total price in USD per person
- currency: "USD"
- url: Direct link to the flight on Skyscanner or similar
- cabinClass: Cabin class

Return at least 12 flight options sorted by price (lowest first). If fewer exist, return as many as available.
Respond in ${languageName}. Airline names should be in ${languageName}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: "gemini_3_8_flash",
      response_json_schema: {
        type: "object",
        additionalProperties: true,
        properties: {
          flights: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
              properties: {
                airline: { type: "string" },
                flightNumber: { type: "string" },
                departureAirport: { type: "string" },
                departureTime: { type: "string" },
                arrivalAirport: { type: "string" },
                arrivalTime: { type: "string" },
                duration: { type: "string" },
                stops: { type: "number" },
                price: { type: "number" },
                currency: { type: "string" },
                url: { type: "string" },
                cabinClass: { type: "string" }
              }
            }
          }
        }
      }
    });

    const flights = Array.isArray(result) ? result : (result.flights || []);
    return Response.json({ flights });
  } catch (error) {
    return Response.json({ error: error.message, flights: [] }, { status: 500 });
  }
}