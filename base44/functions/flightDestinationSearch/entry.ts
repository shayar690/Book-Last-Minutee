// Flight destination autocomplete — airports with IATA codes.
// Searchable by country, city, airport name, or IATA code — in English or Hebrew.
// Free, no API key — curated dataset of major world airports.
// Tuple: [iata, city, country, name, heCity, heCountry]

const AIRPORTS = [
  // Greece
  ["ATH", "Athens", "Greece", "Athens International", "אתונה", "יוון"],
  ["SKG", "Thessaloniki", "Greece", "Makedonia", "סלוניקי", "יוון"],
  ["HER", "Heraklion", "Greece", "Nikos Kazantzakis", "הרקליון", "יוון"],
  ["CHQ", "Chania", "Greece", "Ioannis Daskalogiannis", "קאניה", "יוון"],
  ["RHO", "Rhodes", "Greece", "Diagoras", "רודוס", "יוון"],
  ["KGS", "Kos", "Greece", "Hippocrates", "קוס", "יוון"],
  ["CFU", "Corfu", "Greece", "Ioannis Kapodistrias", "קורפו", "יוון"],
  ["JTR", "Santorini", "Greece", "Santorini Thira", "סנטוריני", "יוון"],
  ["JMK", "Mykonos", "Greece", "Mykonos Island", "מיקונוס", "יוון"],
  ["EFL", "Kefalonia", "Greece", "Anna Pollatou", "קפלוניה", "יוון"],
  // Cyprus
  ["LCA", "Larnaca", "Cyprus", "Larnaca International", "לרנקה", "קפריסין"],
  ["PFO", "Paphos", "Cyprus", "Paphos International", "פאפוס", "קפריסין"],
  // Israel
  ["TLV", "Tel Aviv", "Israel", "Ben Gurion", "תל אביב", "ישראל"],
  ["ETM", "Eilat", "Israel", "Ramon", "אילת", "ישראל"],
  // Turkey
  ["IST", "Istanbul", "Turkey", "Istanbul Airport", "איסטנבול", "טורקיה"],
  ["SAW", "Istanbul", "Turkey", "Sabiha Gokcen", "איסטנבול", "טורקיה"],
  ["AYT", "Antalya", "Turkey", "Antalya", "אנטליה", "טורקיה"],
  ["BJV", "Bodrum", "Turkey", "Milas-Bodrum", "בודרום", "טורקיה"],
  ["DLM", "Dalaman", "Turkey", "Dalaman", "דלמן", "טורקיה"],
  ["ADB", "Izmir", "Turkey", "Adnan Menderes", "איזמיר", "טורקיה"],
  // Italy
  ["FCO", "Rome", "Italy", "Fiumicino", "רומא", "איטליה"],
  ["CIA", "Rome", "Italy", "Ciampino", "רומא", "איטליה"],
  ["MXP", "Milan", "Italy", "Malpensa", "מילאנו", "איטליה"],
  ["LIN", "Milan", "Italy", "Linate", "מילאנו", "איטליה"],
  ["VCE", "Venice", "Italy", "Marco Polo", "ונציה", "איטליה"],
  ["FLR", "Florence", "Italy", "Peretola", "פירנצה", "איטליה"],
  ["NAP", "Naples", "Italy", "Capodichino", "נאפולי", "איטליה"],
  ["CTA", "Catania", "Italy", "Vincenzo Bellini", "קטניה", "איטליה"],
  ["PMO", "Palermo", "Italy", "Falcone-Borsellino", "פלרמו", "איטליה"],
  ["BLQ", "Bologna", "Italy", "Guglielmo Marconi", "בולוניה", "איטליה"],
  ["TRN", "Turin", "Italy", "Sandro Pertini", "טורינו", "איטליה"],
  ["BRI", "Bari", "Italy", "Karol Wojtyla", "בארי", "איטליה"],
  ["PSA", "Pisa", "Italy", "Galileo Galilei", "פיזה", "איטליה"],
  // Spain
  ["MAD", "Madrid", "Spain", "Barajas", "מדריד", "ספרד"],
  ["BCN", "Barcelona", "Spain", "El Prat", "ברצלונה", "ספרד"],
  ["PMI", "Palma de Mallorca", "Spain", "Son Sant Joan", "פלמה דה מיורקה", "ספרד"],
  ["AGP", "Malaga", "Spain", "Costa del Sol", "מאלגה", "ספרד"],
  ["ALC", "Alicante", "Spain", "El Altet", "אליקנטה", "ספרד"],
  ["LPA", "Las Palmas", "Spain", "Gran Canaria", "לאס פאלמס", "ספרד"],
  ["TFS", "Tenerife", "Spain", "Tenerife South", "טנריף", "ספרד"],
  ["IBZ", "Ibiza", "Spain", "Ibiza", "איביזה", "ספרד"],
  ["VLC", "Valencia", "Spain", "Manises", "ולנסיה", "ספרד"],
  ["SVQ", "Seville", "Spain", "San Pablo", "סביליה", "ספרד"],
  ["BIO", "Bilbao", "Spain", "Loiu", "בילבאו", "ספרד"],
  // Portugal
  ["LIS", "Lisbon", "Portugal", "Humberto Delgado", "ליסבון", "פורטוגל"],
  ["FAO", "Faro", "Portugal", "Faro", "פארו", "פורטוגל"],
  ["OPO", "Porto", "Portugal", "Sá Carneiro", "פורטו", "פורטוגל"],
  // France
  ["CDG", "Paris", "France", "Charles de Gaulle", "פריז", "צרפת"],
  ["ORY", "Paris", "France", "Orly", "פריז", "צרפת"],
  ["NCE", "Nice", "France", "Côte d'Azur", "ניס", "צרפת"],
  ["MRS", "Marseille", "France", "Provence", "מרסיי", "צרפת"],
  ["LYS", "Lyon", "France", "Saint-Exupéry", "ליון", "צרפת"],
  ["BOD", "Bordeaux", "France", "Mérignac", "בורדו", "צרפת"],
  ["TLS", "Toulouse", "France", "Blagnac", "טולוז", "צרפת"],
  ["BIA", "Bastia", "France", "Bastia Poretta", "בסטיה", "צרפת"],
  // United Kingdom
  ["LHR", "London", "United Kingdom", "Heathrow", "לונדון", "בריטניה"],
  ["LGW", "London", "United Kingdom", "Gatwick", "לונדון", "בריטניה"],
  ["STN", "London", "United Kingdom", "Stansted", "לונדון", "בריטניה"],
  ["LTN", "London", "United Kingdom", "Luton", "לונדון", "בריטניה"],
  ["MAN", "Manchester", "United Kingdom", "Manchester", "מנצ'סטר", "בריטניה"],
  ["EDI", "Edinburgh", "United Kingdom", "Edinburgh", "אדינבורו", "בריטניה"],
  ["GLA", "Glasgow", "United Kingdom", "Glasgow", "גלזגו", "בריטניה"],
  ["BHX", "Birmingham", "United Kingdom", "Birmingham", "ברמינגהם", "בריטניה"],
  ["BRS", "Bristol", "United Kingdom", "Bristol", "בריסטול", "בריטניה"],
  // Germany
  ["FRA", "Frankfurt", "Germany", "Frankfurt am Main", "פרנקפורט", "גרמניה"],
  ["MUC", "Munich", "Germany", "Munich", "מינכן", "גרמניה"],
  ["BER", "Berlin", "Germany", "Brandenburg", "ברלין", "גרמניה"],
  ["HAM", "Hamburg", "Germany", "Hamburg", "המבורג", "גרמניה"],
  ["DUS", "Düsseldorf", "Germany", "Düsseldorf", "דיסלדורף", "גרמניה"],
  ["CGN", "Cologne", "Germany", "Cologne Bonn", "קלן", "גרמניה"],
  ["STR", "Stuttgart", "Germany", "Stuttgart", "שטוטגרט", "גרמניה"],
  ["NUE", "Nuremberg", "Germany", "Nuremberg", "נירנברג", "גרמניה"],
  // Other Europe
  ["AMS", "Amsterdam", "Netherlands", "Schiphol", "אמסטרדם", "הולנד"],
  ["ZRH", "Zurich", "Switzerland", "Zurich", "ציריך", "שוויץ"],
  ["GVA", "Geneva", "Switzerland", "Geneva", "ז'נבה", "שוויץ"],
  ["BSL", "Basel", "Switzerland", "EuroAirport", "בזל", "שוויץ"],
  ["VIE", "Vienna", "Austria", "Vienna International", "וינה", "אוסטריה"],
  ["BRU", "Brussels", "Belgium", "Brussels", "בריסל", "בלגיה"],
  ["DUB", "Dublin", "Ireland", "Dublin", "דבלין", "אירלנד"],
  ["PRG", "Prague", "Czech Republic", "Václav Havel", "פראג", "צ'כיה"],
  ["BUD", "Budapest", "Hungary", "Budapest", "בודפשט", "הונגריה"],
  ["WAW", "Warsaw", "Poland", "Chopin", "ורשה", "פולין"],
  ["KRK", "Krakow", "Poland", "John Paul II", "קרקוב", "פולין"],
  ["CPH", "Copenhagen", "Denmark", "Copenhagen", "קופנהגן", "דנמרק"],
  ["ARN", "Stockholm", "Sweden", "Arlanda", "סטוקהולם", "שוודיה"],
  ["GOT", "Gothenburg", "Sweden", "Landvetter", "גטבורג", "שוודיה"],
  ["OSL", "Oslo", "Norway", "Gardermoen", "אוסלו", "נורווגיה"],
  ["HEL", "Helsinki", "Finland", "Vantaa", "הלסינקי", "פינלנד"],
  ["SVO", "Moscow", "Russia", "Sheremetyevo", "מוסקבה", "רוסיה"],
  ["LED", "Saint Petersburg", "Russia", "Pulkovo", "סנט פטרסבורג", "רוסיה"],
  ["SPU", "Split", "Croatia", "Split", "ספליט", "קרואטיה"],
  ["DBV", "Dubrovnik", "Croatia", "Dubrovnik", "דוברובניק", "קרואטיה"],
  ["ZAG", "Zagreb", "Croatia", "Zagreb", "זאגרב", "קרואטיה"],
  ["LJU", "Ljubljana", "Slovenia", "Ljubljana", "ליובליאנה", "סלובניה"],
  ["MLA", "Luqa", "Malta", "Malta International", "מלטה", "מלטה"],
  ["KEF", "Keflavik", "Iceland", "Keflavik International", "קפלאוויק", "איסלנד"],
  // Middle East
  ["DXB", "Dubai", "United Arab Emirates", "Dubai International", "דובאי", "איחוד האמירויות"],
  ["AUH", "Abu Dhabi", "United Arab Emirates", "Abu Dhabi", "אבו דאבי", "איחוד האמירויות"],
  ["DOH", "Doha", "Qatar", "Hamad", "דוחה", "קטאר"],
  ["JED", "Jeddah", "Saudi Arabia", "King Abdulaziz", "ג'דה", "ערב הסעודית"],
  ["RUH", "Riyadh", "Saudi Arabia", "King Khalid", "ריאד", "ערב הסעודית"],
  ["AMM", "Amman", "Jordan", "Queen Alia", "עמאן", "ירדן"],
  ["CAI", "Cairo", "Egypt", "Cairo International", "קהיר", "מצרים"],
  ["HRG", "Hurghada", "Egypt", "Hurghada", "הורגדה", "מצרים"],
  ["SSH", "Sharm El Sheikh", "Egypt", "Sharm El Sheikh", "שארם א-שייח'", "מצרים"],
  ["LXR", "Luxor", "Egypt", "Luxor", "לוקסור", "מצרים"],
  ["BEY", "Beirut", "Lebanon", "Beirut", "ביירות", "לבנון"],
  ["BAH", "Manama", "Bahrain", "Bahrain International", "מנמה", "בחריין"],
  ["KWI", "Kuwait City", "Kuwait", "Kuwait International", "כווית סיטי", "כווית"],
  ["MCT", "Muscat", "Oman", "Muscat International", "מסקט", "עומאן"],
  // Asia
  ["DEL", "Delhi", "India", "Indira Gandhi", "דלהי", "הודו"],
  ["BOM", "Mumbai", "India", "Chhatrapati Shivaji", "מומבאי", "הודו"],
  ["BLR", "Bangalore", "India", "Kempegowda", "בנגלור", "הודו"],
  ["MAA", "Chennai", "India", "Chennai", "צ'נאי", "הודו"],
  ["HYD", "Hyderabad", "India", "Rajiv Gandhi", "היידראבד", "הודו"],
  ["CCU", "Kolkata", "India", "Netaji Subhas", "קולקטה", "הודו"],
  ["BKK", "Bangkok", "Thailand", "Suvarnabhumi", "בנגקוק", "תאילנד"],
  ["HKT", "Phuket", "Thailand", "Phuket", "פוקט", "תאילנד"],
  ["CNX", "Chiang Mai", "Thailand", "Chiang Mai", "צ'יאנג מאי", "תאילנד"],
  ["SIN", "Singapore", "Singapore", "Changi", "סינגפור", "סינגפור"],
  ["KUL", "Kuala Lumpur", "Malaysia", "Kuala Lumpur", "קואלה לומפור", "מלזיה"],
  ["PEN", "Penang", "Malaysia", "Penang", "פננג", "מלזיה"],
  ["CGK", "Jakarta", "Indonesia", "Soekarno-Hatta", "ג'קרטה", "אינדונזיה"],
  ["DPS", "Denpasar", "Indonesia", "Ngurah Rai Bali", "באלי", "אינדונזיה"],
  ["SGN", "Ho Chi Minh City", "Vietnam", "Tan Son Nhat", "הו צ'י מין סיטי", "וייטנאם"],
  ["HAN", "Hanoi", "Vietnam", "Noi Bai", "האנוי", "וייטנאם"],
  ["HKG", "Hong Kong", "Hong Kong", "Hong Kong International", "הונג קונג", "הונג קונג"],
  ["PEK", "Beijing", "China", "Capital", "בייג'ין", "סין"],
  ["PVG", "Shanghai", "China", "Pudong", "שנגחאי", "סין"],
  ["CAN", "Guangzhou", "China", "Baiyun", "גואנגג'ואו", "סין"],
  ["CTU", "Chengdu", "China", "Tianfu", "צ'נגדו", "סין"],
  ["NRT", "Tokyo", "Japan", "Narita", "טוקיו", "יפן"],
  ["HND", "Tokyo", "Japan", "Haneda", "טוקיו", "יפן"],
  ["KIX", "Osaka", "Japan", "Kansai", "אוסקה", "יפן"],
  ["CTS", "Sapporo", "Japan", "New Chitose", "סאפורו", "יפן"],
  ["ICN", "Seoul", "South Korea", "Incheon", "סיאול", "דרום קוריאה"],
  ["MNL", "Manila", "Philippines", "Ninoy Aquino", "מנילה", "הפיליפינים"],
  ["CEB", "Cebu", "Philippines", "Mactan-Cebu", "סבו", "הפיליפינים"],
  // Americas
  ["JFK", "New York", "United States", "John F. Kennedy", "ניו יורק", "ארה\"ב"],
  ["LAX", "Los Angeles", "United States", "Los Angeles", "לוס אנג'לס", "ארה\"ב"],
  ["SFO", "San Francisco", "United States", "San Francisco", "סן פרנסיסקו", "ארה\"ב"],
  ["MIA", "Miami", "United States", "Miami", "מיאמי", "ארה\"ב"],
  ["ORD", "Chicago", "United States", "O'Hare", "שיקגו", "ארה\"ב"],
  ["BOS", "Boston", "United States", "Logan", "בוסטון", "ארה\"ב"],
  ["SEA", "Seattle", "United States", "Seattle-Tacoma", "סיאטל", "ארה\"ב"],
  ["IAD", "Washington", "United States", "Dulles", "וושינגטון", "ארה\"ב"],
  ["ATL", "Atlanta", "United States", "Hartsfield-Jackson", "אטלנטה", "ארה\"ב"],
  ["DFW", "Dallas", "United States", "Dallas/Fort Worth", "דאלאס", "ארה\"ב"],
  ["LAS", "Las Vegas", "United States", "Harry Reid", "לאס וגאס", "ארה\"ב"],
  ["HNL", "Honolulu", "United States", "Daniel K. Inouye", "הונולולו", "ארה\"ב"],
  ["MCO", "Orlando", "United States", "Orlando", "אורלנדו", "ארה\"ב"],
  ["YYZ", "Toronto", "Canada", "Pearson", "טורונטו", "קנדה"],
  ["YVR", "Vancouver", "Canada", "Vancouver", "ונקובר", "קנדה"],
  ["YUL", "Montreal", "Canada", "Pierre Elliott Trudeau", "מונטריאול", "קנדה"],
  ["MEX", "Mexico City", "Mexico", "Benito Juárez", "מקסיקו סיטי", "מקסיקו"],
  ["CUN", "Cancun", "Mexico", "Cancun", "קנקון", "מקסיקו"],
  ["GRU", "São Paulo", "Brazil", "Guarulhos", "סאו פאולו", "ברזיל"],
  ["GIG", "Rio de Janeiro", "Brazil", "Galeão", "ריו דה ז'ניירו", "ברזיל"],
  ["EZE", "Buenos Aires", "Argentina", "Ministro Pistarini", "בואנוס איירס", "ארגנטינה"],
  ["SCL", "Santiago", "Chile", "Arturo Merino Benítez", "סנטיאגו", "צ'ילה"],
  ["LIM", "Lima", "Peru", "Jorge Chávez", "לימה", "פרו"],
  ["BOG", "Bogotá", "Colombia", "El Dorado", "בוגוטה", "קולומביה"],
  // Africa
  ["JNB", "Johannesburg", "South Africa", "O. R. Tambo", "יוהנסבורג", "דרום אפריקה"],
  ["CPT", "Cape Town", "South Africa", "Cape Town", "קייפטאון", "דרום אפריקה"],
  ["CMN", "Casablanca", "Morocco", "Mohammed V", "קזבלנקה", "מרוקו"],
  ["RAK", "Marrakech", "Morocco", "Menara", "מרקש", "מרוקו"],
  ["NBO", "Nairobi", "Kenya", "Jomo Kenyatta", "ניירובי", "קניה"],
  ["ADD", "Addis Ababa", "Ethiopia", "Bole", "אדיס אבבה", "אתיופיה"],
  ["DAR", "Dar es Salaam", "Tanzania", "Julius Nyerere", "דאר א-סלאם", "טנזניה"],
  ["ZNZ", "Zanzibar", "Tanzania", "Abeid Amani Karume", "זנזיבר", "טנזניה"],
  ["LOS", "Lagos", "Nigeria", "Murtala Muhammed", "לאגוס", "ניגריה"],
  ["ACC", "Accra", "Ghana", "Kotoka", "אקרה", "גאנה"],
  // Oceania
  ["SYD", "Sydney", "Australia", "Kingsford Smith", "סידני", "אוסטרליה"],
  ["MEL", "Melbourne", "Australia", "Tullamarine", "מלבורן", "אוסטרליה"],
  ["BNE", "Brisbane", "Australia", "Brisbane", "בריזביין", "אוסטרליה"],
  ["PER", "Perth", "Australia", "Perth", "פרת'", "אוסטרליה"],
  ["AKL", "Auckland", "New Zealand", "Auckland", "אוקלנד", "ניו זילנד"],
  ["CHC", "Christchurch", "New Zealand", "Christchurch", "קרייסטצ'רץ'", "ניו זילנד"],
];

export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const q = (body.query || "").trim().toLowerCase();
    if (q.length < 1) return Response.json({ results: [] });

    const scored = AIRPORTS.map(([iata, city, country, name, heCity, heCountry]) => {
      const ci = city.toLowerCase(), co = country.toLowerCase(), nm = name.toLowerCase(), it = iata.toLowerCase();
      const hc = (heCity || "").toLowerCase(), hco = (heCountry || "").toLowerCase();
      let score = -1;
      if (it === q) score = 100;
      else if (it.startsWith(q)) score = 95;
      else if (ci === q || hc === q) score = 92;
      else if (ci.startsWith(q) || hc.startsWith(q)) score = 90;
      else if (co === q || hco === q) score = 85;
      else if (co.startsWith(q) || hco.startsWith(q)) score = 80;
      else if (ci.includes(q) || hc.includes(q)) score = 70;
      else if (co.includes(q) || hco.includes(q)) score = 60;
      else if (nm.includes(q)) score = 30;
      return { iata, city, country, name, heCity, heCountry, score };
    })
      .filter((a) => a.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    const results = scored.map((a) => ({
      iata: a.iata,
      city: a.city,
      country: a.country,
      name: a.name,
      heCity: a.heCity,
      heCountry: a.heCountry,
    }));

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}