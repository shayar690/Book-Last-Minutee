// Flight destination autocomplete — airports with IATA codes.
// Searchable by country, city, airport name, or IATA code.
// Free, no API key — curated dataset of major world airports.

const AIRPORTS = [
  // Greece
  ["ATH", "Athens", "Greece", "Athens International"],
  ["SKG", "Thessaloniki", "Greece", "Makedonia"],
  ["HER", "Heraklion", "Greece", "Nikos Kazantzakis"],
  ["CHQ", "Chania", "Greece", "Ioannis Daskalogiannis"],
  ["RHO", "Rhodes", "Greece", "Diagoras"],
  ["KGS", "Kos", "Greece", "Hippocrates"],
  ["CFU", "Corfu", "Greece", "Ioannis Kapodistrias"],
  ["JTR", "Santorini", "Greece", "Santorini Thira"],
  ["JMK", "Mykonos", "Greece", "Mykonos Island"],
  ["EFL", "Kefalonia", "Greece", "Anna Pollatou"],
  // Cyprus
  ["LCA", "Larnaca", "Cyprus", "Larnaca International"],
  ["PFO", "Paphos", "Cyprus", "Paphos International"],
  // Israel
  ["TLV", "Tel Aviv", "Israel", "Ben Gurion"],
  ["ETM", "Eilat", "Israel", "Ramon"],
  // Turkey
  ["IST", "Istanbul", "Turkey", "Istanbul Airport"],
  ["SAW", "Istanbul", "Turkey", "Sabiha Gokcen"],
  ["AYT", "Antalya", "Turkey", "Antalya"],
  ["BJV", "Bodrum", "Turkey", "Milas-Bodrum"],
  ["DLM", "Dalaman", "Turkey", "Dalaman"],
  ["ADB", "Izmir", "Turkey", "Adnan Menderes"],
  // Italy
  ["FCO", "Rome", "Italy", "Fiumicino"],
  ["CIA", "Rome", "Italy", "Ciampino"],
  ["MXP", "Milan", "Italy", "Malpensa"],
  ["LIN", "Milan", "Italy", "Linate"],
  ["VCE", "Venice", "Italy", "Marco Polo"],
  ["FLR", "Florence", "Italy", "Peretola"],
  ["NAP", "Naples", "Italy", "Capodichino"],
  ["CTA", "Catania", "Italy", "Vincenzo Bellini"],
  ["PMO", "Palermo", "Italy", "Falcone-Borsellino"],
  ["BLQ", "Bologna", "Italy", "Guglielmo Marconi"],
  ["TRN", "Turin", "Italy", "Sandro Pertini"],
  ["BRI", "Bari", "Italy", "Karol Wojtyla"],
  ["PSA", "Pisa", "Italy", "Galileo Galilei"],
  // Spain
  ["MAD", "Madrid", "Spain", "Barajas"],
  ["BCN", "Barcelona", "Spain", "El Prat"],
  ["PMI", "Palma de Mallorca", "Spain", "Son Sant Joan"],
  ["AGP", "Malaga", "Spain", "Costa del Sol"],
  ["ALC", "Alicante", "Spain", "El Altet"],
  ["LPA", "Las Palmas", "Spain", "Gran Canaria"],
  ["TFS", "Tenerife", "Spain", "Tenerife South"],
  ["IBZ", "Ibiza", "Spain", "Ibiza"],
  ["VLC", "Valencia", "Spain", "Manises"],
  ["SVQ", "Seville", "Spain", "San Pablo"],
  ["BIO", "Bilbao", "Spain", "Loiu"],
  // Portugal
  ["LIS", "Lisbon", "Portugal", "Humberto Delgado"],
  ["FAO", "Faro", "Portugal", "Faro"],
  ["OPO", "Porto", "Portugal", "Sá Carneiro"],
  // France
  ["CDG", "Paris", "France", "Charles de Gaulle"],
  ["ORY", "Paris", "France", "Orly"],
  ["NCE", "Nice", "France", "Côte d'Azur"],
  ["MRS", "Marseille", "France", "Provence"],
  ["LYS", "Lyon", "France", "Saint-Exupéry"],
  ["BOD", "Bordeaux", "France", "Mérignac"],
  ["TLS", "Toulouse", "France", "Blagnac"],
  ["BIA", "Bastia", "France", "Bastia Poretta"],
  // United Kingdom
  ["LHR", "London", "United Kingdom", "Heathrow"],
  ["LGW", "London", "United Kingdom", "Gatwick"],
  ["STN", "London", "United Kingdom", "Stansted"],
  ["LTN", "London", "United Kingdom", "Luton"],
  ["MAN", "Manchester", "United Kingdom", "Manchester"],
  ["EDI", "Edinburgh", "United Kingdom", "Edinburgh"],
  ["GLA", "Glasgow", "United Kingdom", "Glasgow"],
  ["BHX", "Birmingham", "United Kingdom", "Birmingham"],
  ["BRS", "Bristol", "United Kingdom", "Bristol"],
  // Germany
  ["FRA", "Frankfurt", "Germany", "Frankfurt am Main"],
  ["MUC", "Munich", "Germany", "Munich"],
  ["BER", "Berlin", "Germany", "Brandenburg"],
  ["HAM", "Hamburg", "Germany", "Hamburg"],
  ["DUS", "Düsseldorf", "Germany", "Düsseldorf"],
  ["CGN", "Cologne", "Germany", "Cologne Bonn"],
  ["STR", "Stuttgart", "Germany", "Stuttgart"],
  ["NUE", "Nuremberg", "Germany", "Nuremberg"],
  // Other Europe
  ["AMS", "Amsterdam", "Netherlands", "Schiphol"],
  ["ZRH", "Zurich", "Switzerland", "Zurich"],
  ["GVA", "Geneva", "Switzerland", "Geneva"],
  ["BSL", "Basel", "Switzerland", "EuroAirport"],
  ["VIE", "Vienna", "Austria", "Vienna International"],
  ["BRU", "Brussels", "Belgium", "Brussels"],
  ["DUB", "Dublin", "Ireland", "Dublin"],
  ["PRG", "Prague", "Czech Republic", "Václav Havel"],
  ["BUD", "Budapest", "Hungary", "Budapest"],
  ["WAW", "Warsaw", "Poland", "Chopin"],
  ["KRK", "Krakow", "Poland", "John Paul II"],
  ["CPH", "Copenhagen", "Denmark", "Copenhagen"],
  ["ARN", "Stockholm", "Sweden", "Arlanda"],
  ["GOT", "Gothenburg", "Sweden", "Landvetter"],
  ["OSL", "Oslo", "Norway", "Gardermoen"],
  ["HEL", "Helsinki", "Finland", "Vantaa"],
  ["SVO", "Moscow", "Russia", "Sheremetyevo"],
  ["LED", "Saint Petersburg", "Russia", "Pulkovo"],
  ["SPU", "Split", "Croatia", "Split"],
  ["DBV", "Dubrovnik", "Croatia", "Dubrovnik"],
  ["ZAG", "Zagreb", "Croatia", "Zagreb"],
  ["LJU", "Ljubljana", "Slovenia", "Ljubljana"],
  ["MLA", "Luqa", "Malta", "Malta International"],
  ["KEF", "Keflavik", "Iceland", "Keflavik International"],
  // Middle East
  ["DXB", "Dubai", "United Arab Emirates", "Dubai International"],
  ["AUH", "Abu Dhabi", "United Arab Emirates", "Abu Dhabi"],
  ["DOH", "Doha", "Qatar", "Hamad"],
  ["JED", "Jeddah", "Saudi Arabia", "King Abdulaziz"],
  ["RUH", "Riyadh", "Saudi Arabia", "King Khalid"],
  ["AMM", "Amman", "Jordan", "Queen Alia"],
  ["CAI", "Cairo", "Egypt", "Cairo International"],
  ["HRG", "Hurghada", "Egypt", "Hurghada"],
  ["SSH", "Sharm El Sheikh", "Egypt", "Sharm El Sheikh"],
  ["LXR", "Luxor", "Egypt", "Luxor"],
  ["BEY", "Beirut", "Lebanon", "Beirut"],
  ["BAH", "Manama", "Bahrain", "Bahrain International"],
  ["KWI", "Kuwait City", "Kuwait", "Kuwait International"],
  ["MCT", "Muscat", "Oman", "Muscat International"],
  // Asia
  ["DEL", "Delhi", "India", "Indira Gandhi"],
  ["BOM", "Mumbai", "India", "Chhatrapati Shivaji"],
  ["BLR", "Bangalore", "India", "Kempegowda"],
  ["MAA", "Chennai", "India", "Chennai"],
  ["HYD", "Hyderabad", "India", "Rajiv Gandhi"],
  ["CCU", "Kolkata", "India", "Netaji Subhas"],
  ["BKK", "Bangkok", "Thailand", "Suvarnabhumi"],
  ["HKT", "Phuket", "Thailand", "Phuket"],
  ["CNX", "Chiang Mai", "Thailand", "Chiang Mai"],
  ["SIN", "Singapore", "Singapore", "Changi"],
  ["KUL", "Kuala Lumpur", "Malaysia", "Kuala Lumpur"],
  ["PEN", "Penang", "Malaysia", "Penang"],
  ["CGK", "Jakarta", "Indonesia", "Soekarno-Hatta"],
  ["DPS", "Denpasar", "Indonesia", "Ngurah Rai Bali"],
  ["SGN", "Ho Chi Minh City", "Vietnam", "Tan Son Nhat"],
  ["HAN", "Hanoi", "Vietnam", "Noi Bai"],
  ["HKG", "Hong Kong", "Hong Kong", "Hong Kong International"],
  ["PEK", "Beijing", "China", "Capital"],
  ["PVG", "Shanghai", "China", "Pudong"],
  ["CAN", "Guangzhou", "China", "Baiyun"],
  ["CTU", "Chengdu", "China", "Tianfu"],
  ["NRT", "Tokyo", "Japan", "Narita"],
  ["HND", "Tokyo", "Japan", "Haneda"],
  ["KIX", "Osaka", "Japan", "Kansai"],
  ["CTS", "Sapporo", "Japan", "New Chitose"],
  ["ICN", "Seoul", "South Korea", "Incheon"],
  ["MNL", "Manila", "Philippines", "Ninoy Aquino"],
  ["CEB", "Cebu", "Philippines", "Mactan-Cebu"],
  // Americas
  ["JFK", "New York", "United States", "John F. Kennedy"],
  ["LAX", "Los Angeles", "United States", "Los Angeles"],
  ["SFO", "San Francisco", "United States", "San Francisco"],
  ["MIA", "Miami", "United States", "Miami"],
  ["ORD", "Chicago", "United States", "O'Hare"],
  ["BOS", "Boston", "United States", "Logan"],
  ["SEA", "Seattle", "United States", "Seattle-Tacoma"],
  ["IAD", "Washington", "United States", "Dulles"],
  ["ATL", "Atlanta", "United States", "Hartsfield-Jackson"],
  ["DFW", "Dallas", "United States", "Dallas/Fort Worth"],
  ["LAS", "Las Vegas", "United States", "Harry Reid"],
  ["HNL", "Honolulu", "United States", "Daniel K. Inouye"],
  ["MCO", "Orlando", "United States", "Orlando"],
  ["YYZ", "Toronto", "Canada", "Pearson"],
  ["YVR", "Vancouver", "Canada", "Vancouver"],
  ["YUL", "Montreal", "Canada", "Pierre Elliott Trudeau"],
  ["MEX", "Mexico City", "Mexico", "Benito Juárez"],
  ["CUN", "Cancun", "Mexico", "Cancun"],
  ["GRU", "São Paulo", "Brazil", "Guarulhos"],
  ["GIG", "Rio de Janeiro", "Brazil", "Galeão"],
  ["EZE", "Buenos Aires", "Argentina", "Ministro Pistarini"],
  ["SCL", "Santiago", "Chile", "Arturo Merino Benítez"],
  ["LIM", "Lima", "Peru", "Jorge Chávez"],
  ["BOG", "Bogotá", "Colombia", "El Dorado"],
  // Africa
  ["JNB", "Johannesburg", "South Africa", "O. R. Tambo"],
  ["CPT", "Cape Town", "South Africa", "Cape Town"],
  ["CMN", "Casablanca", "Morocco", "Mohammed V"],
  ["RAK", "Marrakech", "Morocco", "Menara"],
  ["NBO", "Nairobi", "Kenya", "Jomo Kenyatta"],
  ["ADD", "Addis Ababa", "Ethiopia", "Bole"],
  ["DAR", "Dar es Salaam", "Tanzania", "Julius Nyerere"],
  ["ZNZ", "Zanzibar", "Tanzania", "Abeid Amani Karume"],
  ["LOS", "Lagos", "Nigeria", "Murtala Muhammed"],
  ["ACC", "Accra", "Ghana", "Kotoka"],
  // Oceania
  ["SYD", "Sydney", "Australia", "Kingsford Smith"],
  ["MEL", "Melbourne", "Australia", "Tullamarine"],
  ["BNE", "Brisbane", "Australia", "Brisbane"],
  ["PER", "Perth", "Australia", "Perth"],
  ["AKL", "Auckland", "New Zealand", "Auckland"],
  ["CHC", "Christchurch", "New Zealand", "Christchurch"],
];

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const q = (body.query || "").trim().toLowerCase();
    if (q.length < 1) return Response.json({ results: [] });

    const scored = AIRPORTS.map(([iata, city, country, name]) => {
      const ci = city.toLowerCase(), co = country.toLowerCase(), nm = name.toLowerCase(), it = iata.toLowerCase();
      let score = -1;
      if (it === q) score = 100;
      else if (it.startsWith(q)) score = 95;
      else if (ci === q) score = 92;
      else if (ci.startsWith(q)) score = 90;
      else if (co === q) score = 85;
      else if (co.startsWith(q)) score = 80;
      else if (ci.includes(q)) score = 70;
      else if (co.includes(q)) score = 60;
      else if (nm.includes(q)) score = 30;
      return { iata, city, country, name, score };
    })
      .filter((a) => a.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    const results = scored.map((a) => ({
      iata: a.iata,
      city: a.city,
      country: a.country,
      name: a.name,
      label: `${a.city}, ${a.country} — ${a.name} (${a.iata})`,
      short: `${a.city} (${a.iata})`,
    }));

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}