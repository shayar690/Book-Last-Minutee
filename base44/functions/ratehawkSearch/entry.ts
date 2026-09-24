import { secrets } from "base44:runtime";

// RateHawk B2B API (worldota.net) — live hotel, flight and transfer inventory.
// Docs: https://docs.worldota.net/  (RateHawk partner access required)
// Secrets required: RATEHAWK_API_ID, RATEHAWK_API_KEY (set in dashboard env vars).

const API_BASE = "https://api.worldota.net/api/b2b/v3";

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const service = (body.service || "hotels").toLowerCase();

    const apiId = secrets.get("RATEHAWK_API_ID");
    const apiKey = secrets.get("RATEHAWK_API_KEY");
    if (!apiId || !apiKey) {
      return Response.json(
        { error: "RateHawk credentials not configured. Set RATEHAWK_API_ID and RATEHAWK_API_KEY in dashboard environment variables." },
        { status: 503 }
      );
    }

    const auth = "Basic " + btoa(`${apiId}:${apiKey}`);

    let endpoint = "/hotel_search/";
    let payload = {};

    if (service === "hotels") {
      endpoint = "/hotel_search/";
      payload = {
        ids: body.ids || [],
        checkin: body.checkin,
        checkout: body.checkout,
        adults: body.adults || 2,
        children: body.children || 0,
        residency: body.residency || "us",
        language: body.language || "en",
        currency: body.currency || "USD",
      };
    } else if (service === "flights") {
      endpoint = "/flight_search/";
      payload = {
        from: body.from,
        to: body.to,
        date: body.date,
        return_date: body.returnDate || null,
        adults: body.adults || 1,
        currency: body.currency || "USD",
      };
    } else if (service === "cars") {
      endpoint = "/car_rental/search/";
      payload = {
        pickup_location: body.pickup,
        date: body.date,
        time: body.time || "10:00",
        currency: body.currency || "USD",
      };
    } else if (service === "transfers") {
      endpoint = "/transfer/search/";
      payload = {
        from: body.pickup,
        to: body.dropoff,
        date: body.date,
        time: body.time || "10:00",
        passengers: body.adults || 2,
        currency: body.currency || "USD",
      };
    } else {
      return Response.json({ error: "Unknown service: " + service }, { status: 400 });
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return Response.json({ error: "RateHawk API error", status: res.status, details: data }, { status: res.status });
    }

    return Response.json({ service, results: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}