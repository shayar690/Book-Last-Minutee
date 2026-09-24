// Flight destination autocomplete — airports with IATA codes.
// Searchable by country, city, airport name, or IATA code — in English or Hebrew.
// Free, no API key — curated dataset of major world airports.
// Tuple: [iata, city, country, name, heCity, heCountry, heName]
// Order within a city = popularity (busiest first); ties keep this order (stable sort).

const AIRPORTS = [
  // Greece
  ["ATH", "Athens", "Greece", "Athens International", "אתונה", "יוון", "אל. וניזלוס"],
  ["SKG", "Thessaloniki", "Greece", "Makedonia", "סלוניקי", "יוון", "מקדוניה"],
  ["HER", "Heraklion", "Greece", "Nikos Kazantzakis", "הרקליון", "יוון", "ניקוס קזנצאקיס"],
  ["CHQ", "Chania", "Greece", "Ioannis Daskalogiannis", "קאניה", "יוון", "יואניס דסקלוגיאניס"],
  ["RHO", "Rhodes", "Greece", "Diagoras", "רודוס", "יוון", "דיאגורס"],
  ["KGS", "Kos", "Greece", "Hippocrates", "קוס", "יוון", "היפוקרטס"],
  ["CFU", "Corfu", "Greece", "Ioannis Kapodistrias", "קורפו", "יוון", "יואניס קפודיסטריאס"],
  ["JTR", "Santorini", "Greece", "Santorini Thira", "סנטוריני", "יוון", "סנטוריני (תירה)"],
  ["JMK", "Mykonos", "Greece", "Mykonos Island", "מיקונוס", "יוון", "מיקונוס"],
  ["EFL", "Kefalonia", "Greece", "Anna Pollatou", "קפלוניה", "יוון", "אנה פולאטו"],
  // Cyprus
  ["LCA", "Larnaca", "Cyprus", "Larnaca International", "לרנקה", "קפריסין", "לרנקה הבינלאומי"],
  ["PFO", "Paphos", "Cyprus", "Paphos International", "פאפוס", "קפריסין", "פאפוס הבינלאומי"],
  // Israel
  ["TLV", "Tel Aviv", "Israel", "Ben Gurion", "תל אביב", "ישראל", "בן גוריון"],
  ["ETM", "Eilat", "Israel", "Ramon", "אילת", "ישראל", "רמון"],
  // Turkey
  ["IST", "Istanbul", "Turkey", "Istanbul Airport", "איסטנבול", "טורקיה", "איסטנבול"],
  ["SAW", "Istanbul", "Turkey", "Sabiha Gokcen", "איסטנבול", "טורקיה", "סביהה גקצ'ן"],
  ["AYT", "Antalya", "Turkey", "Antalya", "אנטליה", "טורקיה", "אנטליה"],
  ["BJV", "Bodrum", "Turkey", "Milas-Bodrum", "בודרום", "טורקיה", "מילאס-בודרום"],
  ["DLM", "Dalaman", "Turkey", "Dalaman", "דלמן", "טורקיה", "דלמן"],
  ["ADB", "Izmir", "Turkey", "Adnan Menderes", "איזמיר", "טורקיה", "אדנאן מנדרס"],
  // Italy
  ["FCO", "Rome", "Italy", "Fiumicino", "רומא", "איטליה", "פיומיצ'ינו"],
  ["CIA", "Rome", "Italy", "Ciampino", "רומא", "איטליה", "צ'אמפינו"],
  ["MXP", "Milan", "Italy", "Malpensa", "מילאנו", "איטליה", "מלפנסה"],
  ["LIN", "Milan", "Italy", "Linate", "מילאנו", "איטליה", "לינאטה"],
  ["BGY", "Milan", "Italy", "Bergamo Orio al Serio", "מילאנו", "איטליה", "ברגמו (אוריו אל סריו)"],
  ["VCE", "Venice", "Italy", "Marco Polo", "ונציה", "איטליה", "מרקו פולו"],
  ["FLR", "Florence", "Italy", "Peretola", "פירנצה", "איטליה", "פרטולה"],
  ["NAP", "Naples", "Italy", "Capodichino", "נאפולי", "איטליה", "קפודיקינו"],
  ["CTA", "Catania", "Italy", "Vincenzo Bellini", "קטניה", "איטליה", "וינצ'נצו בליני"],
  ["PMO", "Palermo", "Italy", "Falcone-Borsellino", "פלרמו", "איטליה", "פלקונה-בורסלינו"],
  ["BLQ", "Bologna", "Italy", "Guglielmo Marconi", "בולוניה", "איטליה", "גוליילמו מרקוני"],
  ["TRN", "Turin", "Italy", "Sandro Pertini", "טורינו", "איטליה", "סנדרו פרטיני"],
  ["BRI", "Bari", "Italy", "Karol Wojtyla", "בארי", "איטליה", "קרול וויטילה"],
  ["PSA", "Pisa", "Italy", "Galileo Galilei", "פיזה", "איטליה", "גלילאו גליליי"],
  // Spain
  ["MAD", "Madrid", "Spain", "Barajas", "מדריד", "ספרד", "בראחס"],
  ["BCN", "Barcelona", "Spain", "El Prat", "ברצלונה", "ספרד", "אל פראט"],
  ["PMI", "Palma de Mallorca", "Spain", "Son Sant Joan", "פלמה דה מיורקה", "ספרד", "סון סאן ז'ואן"],
  ["AGP", "Malaga", "Spain", "Costa del Sol", "מאלגה", "ספרד", "קוסטה דל סול"],
  ["ALC", "Alicante", "Spain", "El Altet", "אליקנטה", "ספרד", "אל אלטט"],
  ["LPA", "Las Palmas", "Spain", "Gran Canaria", "לאס פאלמס", "ספרד", "גראן קנריה"],
  ["TFS", "Tenerife", "Spain", "Tenerife South", "טנריף", "ספרד", "טנריף דרום"],
  ["IBZ", "Ibiza", "Spain", "Ibiza", "איביזה", "ספרד", "איביזה"],
  ["VLC", "Valencia", "Spain", "Manises", "ולנסיה", "ספרד", "מניסס"],
  ["SVQ", "Seville", "Spain", "San Pablo", "סביליה", "ספרד", "סן פבלו"],
  ["BIO", "Bilbao", "Spain", "Loiu", "בילבאו", "ספרד", "לויו"],
  // Portugal
  ["LIS", "Lisbon", "Portugal", "Humberto Delgado", "ליסבון", "פורטוגל", "אומברטו דלגדו"],
  ["FAO", "Faro", "Portugal", "Faro", "פארו", "פורטוגל", "פארו"],
  ["OPO", "Porto", "Portugal", "Sá Carneiro", "פורטו", "פורטוגל", "סה קרניירו"],
  // France
  ["CDG", "Paris", "France", "Charles de Gaulle", "פריז", "צרפת", "שארל דה גול"],
  ["ORY", "Paris", "France", "Orly", "פריז", "צרפת", "אורלי"],
  ["BVA", "Paris", "France", "Beauvais-Tillé", "פריז", "צרפת", "בובה"],
  ["NCE", "Nice", "France", "Côte d'Azur", "ניס", "צרפת", "קוט ד'אזור"],
  ["MRS", "Marseille", "France", "Provence", "מרסיי", "צרפת", "פרובאנס"],
  ["LYS", "Lyon", "France", "Saint-Exupéry", "ליון", "צרפת", "סנט-אכזופרי"],
  ["BOD", "Bordeaux", "France", "Mérignac", "בורדו", "צרפת", "מריניאק"],
  ["TLS", "Toulouse", "France", "Blagnac", "טולוז", "צרפת", "בלאניאק"],
  ["BIA", "Bastia", "France", "Bastia Poretta", "בסטיה", "צרפת", "בסטיה פורטה"],
  // United Kingdom
  ["LHR", "London", "United Kingdom", "Heathrow", "לונדון", "בריטניה", "הית'רו"],
  ["LGW", "London", "United Kingdom", "Gatwick", "לונדון", "בריטניה", "גטוויק"],
  ["STN", "London", "United Kingdom", "Stansted", "לונדון", "בריטניה", "סטנסטד"],
  ["LTN", "London", "United Kingdom", "Luton", "לונדון", "בריטניה", "לוטון"],
  ["LCY", "London", "United Kingdom", "London City", "לונדון", "בריטניה", "לונדון סיטי"],
  ["MAN", "Manchester", "United Kingdom", "Manchester", "מנצ'סטר", "בריטניה", "מנצ'סטר"],
  ["EDI", "Edinburgh", "United Kingdom", "Edinburgh", "אדינבורו", "בריטניה", "אדינבורו"],
  ["GLA", "Glasgow", "United Kingdom", "Glasgow", "גלזגו", "בריטניה", "גלזגו"],
  ["BHX", "Birmingham", "United Kingdom", "Birmingham", "ברמינגהם", "בריטניה", "ברמינגהם"],
  ["BRS", "Bristol", "United Kingdom", "Bristol", "בריסטול", "בריטניה", "בריסטול"],
  // Germany
  ["FRA", "Frankfurt", "Germany", "Frankfurt am Main", "פרנקפורט", "גרמניה", "פרנקפורט"],
  ["MUC", "Munich", "Germany", "Munich", "מינכן", "גרמניה", "מינכן"],
  ["BER", "Berlin", "Germany", "Brandenburg", "ברלין", "גרמניה", "ברנדנבורג"],
  ["HAM", "Hamburg", "Germany", "Hamburg", "המבורג", "גרמניה", "המבורג"],
  ["DUS", "Düsseldorf", "Germany", "Düsseldorf", "דיסלדורף", "גרמניה", "דיסלדורף"],
  ["CGN", "Cologne", "Germany", "Cologne Bonn", "קלן", "גרמניה", "קלן-בון"],
  ["STR", "Stuttgart", "Germany", "Stuttgart", "שטוטגרט", "גרמניה", "שטוטגרט"],
  ["NUE", "Nuremberg", "Germany", "Nuremberg", "נירנברג", "גרמניה", "נירנברג"],
  // Other Europe
  ["AMS", "Amsterdam", "Netherlands", "Schiphol", "אמסטרדם", "הולנד", "סכיפהול"],
  ["ZRH", "Zurich", "Switzerland", "Zurich", "ציריך", "שוויץ", "ציריך"],
  ["GVA", "Geneva", "Switzerland", "Geneva", "ז'נבה", "שוויץ", "ז'נבה"],
  ["BSL", "Basel", "Switzerland", "EuroAirport", "בזל", "שוויץ", "יורו-איירפורט"],
  ["VIE", "Vienna", "Austria", "Vienna International", "וינה", "אוסטריה", "וינה הבינלאומי"],
  ["BRU", "Brussels", "Belgium", "Brussels", "בריסל", "בלגיה", "בריסל"],
  ["DUB", "Dublin", "Ireland", "Dublin", "דבלין", "אירלנד", "דבלין"],
  ["PRG", "Prague", "Czech Republic", "Václav Havel", "פראג", "צ'כיה", "ואצלב האוול"],
  ["BUD", "Budapest", "Hungary", "Budapest", "בודפשט", "הונגריה", "בודפשט"],
  ["WAW", "Warsaw", "Poland", "Chopin", "ורשה", "פולין", "שופן"],
  ["KRK", "Krakow", "Poland", "John Paul II", "קרקוב", "פולין", "יוחנן פאולוס השני"],
  ["CPH", "Copenhagen", "Denmark", "Copenhagen", "קופנהגן", "דנמרק", "קופנהגן"],
  ["ARN", "Stockholm", "Sweden", "Arlanda", "סטוקהולם", "שוודיה", "ארלנדה"],
  ["GOT", "Gothenburg", "Sweden", "Landvetter", "גטבורג", "שוודיה", "לנדווטר"],
  ["OSL", "Oslo", "Norway", "Gardermoen", "אוסלו", "נורווגיה", "גרדרמואן"],
  ["HEL", "Helsinki", "Finland", "Vantaa", "הלסינקי", "פינלנד", "ונטאה"],
  ["SVO", "Moscow", "Russia", "Sheremetyevo", "מוסקבה", "רוסיה", "שרמטייבו"],
  ["DME", "Moscow", "Russia", "Domodedovo", "מוסקבה", "רוסיה", "דומודדובו"],
  ["VKO", "Moscow", "Russia", "Vnukovo", "מוסקבה", "רוסיה", "וונוקובו"],
  ["LED", "Saint Petersburg", "Russia", "Pulkovo", "סנט פטרסבורג", "רוסיה", "פולקובו"],
  ["SPU", "Split", "Croatia", "Split", "ספליט", "קרואטיה", "ספליט"],
  ["DBV", "Dubrovnik", "Croatia", "Dubrovnik", "דוברובניק", "קרואטיה", "דוברובניק"],
  ["ZAG", "Zagreb", "Croatia", "Zagreb", "זאגרב", "קרואטיה", "זאגרב"],
  ["LJU", "Ljubljana", "Slovenia", "Ljubljana", "ליובליאנה", "סלובניה", "ליובליאנה"],
  ["MLA", "Luqa", "Malta", "Malta International", "מלטה", "מלטה", "מלטה הבינלאומי"],
  ["KEF", "Keflavik", "Iceland", "Keflavik International", "קפלאוויק", "איסלנד", "קפלאוויק הבינלאומי"],
  // Middle East
  ["DXB", "Dubai", "United Arab Emirates", "Dubai International", "דובאי", "איחוד האמירויות", "דובאי הבינלאומי"],
  ["DWC", "Dubai", "United Arab Emirates", "Al Maktoum International", "דובאי", "איחוד האמירויות", "אל-מכתום הבינלאומי"],
  ["AUH", "Abu Dhabi", "United Arab Emirates", "Abu Dhabi", "אבו דאבי", "איחוד האמירויות", "אבו דאבי הבינלאומי"],
  ["DOH", "Doha", "Qatar", "Hamad", "דוחה", "קטאר", "חמד"],
  ["JED", "Jeddah", "Saudi Arabia", "King Abdulaziz", "ג'דה", "ערב הסעודית", "המלך עבד אל-עזיז"],
  ["RUH", "Riyadh", "Saudi Arabia", "King Khalid", "ריאד", "ערב הסעודית", "המלך ח'אלד"],
  ["AMM", "Amman", "Jordan", "Queen Alia", "עמאן", "ירדן", "המלכה עאליה"],
  ["CAI", "Cairo", "Egypt", "Cairo International", "קהיר", "מצרים", "קהיר הבינלאומי"],
  ["HRG", "Hurghada", "Egypt", "Hurghada", "הורגדה", "מצרים", "הורגדה"],
  ["SSH", "Sharm El Sheikh", "Egypt", "Sharm El Sheikh", "שארם א-שייח'", "מצרים", "שארם א-שייח'"],
  ["LXR", "Luxor", "Egypt", "Luxor", "לוקסור", "מצרים", "לוקסור"],
  ["BEY", "Beirut", "Lebanon", "Beirut", "ביירות", "לבנון", "ביירות"],
  ["BAH", "Manama", "Bahrain", "Bahrain International", "מנמה", "בחריין", "בחריין הבינלאומי"],
  ["KWI", "Kuwait City", "Kuwait", "Kuwait International", "כווית סיטי", "כווית", "כווית הבינלאומי"],
  ["MCT", "Muscat", "Oman", "Muscat International", "מסקט", "עומאן", "מסקט הבינלאומי"],
  // Asia
  ["DEL", "Delhi", "India", "Indira Gandhi", "דלהי", "הודו", "אינדירה גנדי"],
  ["BOM", "Mumbai", "India", "Chhatrapati Shivaji", "מומבאי", "הודו", "צ'טרפטי שיוואג'י"],
  ["BLR", "Bangalore", "India", "Kempegowda", "בנגלור", "הודו", "קמפגאודה"],
  ["MAA", "Chennai", "India", "Chennai", "צ'נאי", "הודו", "צ'נאי"],
  ["HYD", "Hyderabad", "India", "Rajiv Gandhi", "היידראבד", "הודו", "רג'יב גנדי"],
  ["CCU", "Kolkata", "India", "Netaji Subhas", "קולקטה", "הודו", "נטאג'י סובהאש"],
  ["BKK", "Bangkok", "Thailand", "Suvarnabhumi", "בנגקוק", "תאילנד", "סוברנבהומי"],
  ["DMK", "Bangkok", "Thailand", "Don Mueang", "בנגקוק", "תאילנד", "דון מואנג"],
  ["HKT", "Phuket", "Thailand", "Phuket", "פוקט", "תאילנד", "פוקט"],
  ["CNX", "Chiang Mai", "Thailand", "Chiang Mai", "צ'יאנג מאי", "תאילנד", "צ'יאנג מאי"],
  ["SIN", "Singapore", "Singapore", "Changi", "סינגפור", "סינגפור", "צ'נגי"],
  ["KUL", "Kuala Lumpur", "Malaysia", "Kuala Lumpur", "קואלה לומפור", "מלזיה", "קואלה לומפור"],
  ["PEN", "Penang", "Malaysia", "Penang", "פננג", "מלזיה", "פננג"],
  ["CGK", "Jakarta", "Indonesia", "Soekarno-Hatta", "ג'קרטה", "אינדונזיה", "סוקרנו-האטה"],
  ["HLP", "Jakarta", "Indonesia", "Halim Perdanakusuma", "ג'קרטה", "אינדונזיה", "חלים פרדנאקוסומה"],
  ["DPS", "Denpasar", "Indonesia", "Ngurah Rai Bali", "באלי", "אינדונזיה", "נגורה ראי (באלי)"],
  ["SGN", "Ho Chi Minh City", "Vietnam", "Tan Son Nhat", "הו צ'י מין סיטי", "וייטנאם", "טאן סון נהאט"],
  ["HAN", "Hanoi", "Vietnam", "Noi Bai", "האנוי", "וייטנאם", "נוי באי"],
  ["HKG", "Hong Kong", "Hong Kong", "Hong Kong International", "הונג קונג", "הונג קונג", "הונג קונג הבינלאומי"],
  ["PEK", "Beijing", "China", "Capital", "בייג'ין", "סין", "שאנג-דו (הבירתי)"],
  ["PKX", "Beijing", "China", "Daxing", "בייג'ין", "סין", "דאשינג"],
  ["PVG", "Shanghai", "China", "Pudong", "שנגחאי", "סין", "פודונג"],
  ["SHA", "Shanghai", "China", "Hongqiao", "שנגחאי", "סין", "הונגצ'יאו"],
  ["CAN", "Guangzhou", "China", "Baiyun", "גואנגג'ואו", "סין", "באייון"],
  ["CTU", "Chengdu", "China", "Tianfu", "צ'נגדו", "סין", "טיינפו"],
  ["NRT", "Tokyo", "Japan", "Narita", "טוקיו", "יפן", "נאריטה"],
  ["HND", "Tokyo", "Japan", "Haneda", "טוקיו", "יפן", "האנדה"],
  ["KIX", "Osaka", "Japan", "Kansai", "אוסקה", "יפן", "קנסאי"],
  ["CTS", "Sapporo", "Japan", "New Chitose", "סאפורו", "יפן", "ניו צ'יטוסה"],
  ["ICN", "Seoul", "South Korea", "Incheon", "סיאול", "דרום קוריאה", "אינצ'ון"],
  ["GMP", "Seoul", "South Korea", "Gimpo", "סיאול", "דרום קוריאה", "גימפו"],
  ["MNL", "Manila", "Philippines", "Ninoy Aquino", "מנילה", "הפיליפינים", "נינוי אקינו"],
  ["CEB", "Cebu", "Philippines", "Mactan-Cebu", "סבו", "הפיליפינים", "מקטן-סבו"],
  // Americas
  ["JFK", "New York", "United States", "John F. Kennedy", "ניו יורק", "ארה\"ב", "ג'ון פ. קנדי"],
  ["EWR", "New York", "United States", "Newark Liberty", "ניו יורק", "ארה\"ב", "ניוארק ליברטי"],
  ["LGA", "New York", "United States", "LaGuardia", "ניו יורק", "ארה\"ב", "לה גוארדיה"],
  ["LAX", "Los Angeles", "United States", "Los Angeles", "לוס אנג'לס", "ארה\"ב", "לוס אנג'לס"],
  ["SFO", "San Francisco", "United States", "San Francisco", "סן פרנסיסקו", "ארה\"ב", "סן פרנסיסקו"],
  ["MIA", "Miami", "United States", "Miami", "מיאמי", "ארה\"ב", "מיאמי"],
  ["ORD", "Chicago", "United States", "O'Hare", "שיקגו", "ארה\"ב", "או'הייר"],
  ["MDW", "Chicago", "United States", "Midway", "שיקגו", "ארה\"ב", "מידוויי"],
  ["BOS", "Boston", "United States", "Logan", "בוסטון", "ארה\"ב", "לוגן"],
  ["SEA", "Seattle", "United States", "Seattle-Tacoma", "סיאטל", "ארה\"ב", "סיאטל-טקומה"],
  ["IAD", "Washington", "United States", "Dulles", "וושינגטון", "ארה\"ב", "דאלס"],
  ["DCA", "Washington", "United States", "Reagan National", "וושינגטון", "ארה\"ב", "רייגן נשיונל"],
  ["ATL", "Atlanta", "United States", "Hartsfield-Jackson", "אטלנטה", "ארה\"ב", "הרטספילד-ג'קסון"],
  ["DFW", "Dallas", "United States", "Dallas/Fort Worth", "דאלאס", "ארה\"ב", "דאלאס/פורט וורת'"],
  ["DAL", "Dallas", "United States", "Love Field", "דאלאס", "ארה\"ב", "לאב פילד"],
  ["LAS", "Las Vegas", "United States", "Harry Reid", "לאס וגאס", "ארה\"ב", "הארי ריד"],
  ["HNL", "Honolulu", "United States", "Daniel K. Inouye", "הונולולו", "ארה\"ב", "דניאל ק. אינואה"],
  ["MCO", "Orlando", "United States", "Orlando", "אורלנדו", "ארה\"ב", "אורלנדו"],
  ["YYZ", "Toronto", "Canada", "Pearson", "טורונטו", "קנדה", "פירסון"],
  ["YTZ", "Toronto", "Canada", "Billy Bishop", "טורונטו", "קנדה", "בילי בישופ"],
  ["YVR", "Vancouver", "Canada", "Vancouver", "ונקובר", "קנדה", "ונקובר"],
  ["YUL", "Montreal", "Canada", "Pierre Elliott Trudeau", "מונטריאול", "קנדה", "פייר אליוט טרודו"],
  ["MEX", "Mexico City", "Mexico", "Benito Juárez", "מקסיקו סיטי", "מקסיקו", "בניטו חוארס"],
  ["CUN", "Cancun", "Mexico", "Cancun", "קנקון", "מקסיקו", "קנקון"],
  ["GRU", "São Paulo", "Brazil", "Guarulhos", "סאו פאולו", "ברזיל", "גוארוליוס"],
  ["CGH", "São Paulo", "Brazil", "Congonhas", "סאו פאולו", "ברזיל", "קונגוניאס"],
  ["GIG", "Rio de Janeiro", "Brazil", "Galeão", "ריו דה ז'ניירו", "ברזיל", "גאליאו"],
  ["SDU", "Rio de Janeiro", "Brazil", "Santos Dumont", "ריו דה ז'ניירו", "ברזיל", "סנטוס דומונט"],
  ["EZE", "Buenos Aires", "Argentina", "Ministro Pistarini", "בואנוס איירס", "ארגנטינה", "פיסטריני"],
  ["AEP", "Buenos Aires", "Argentina", "Aeroparque", "בואנוס איירס", "ארגנטינה", "אירופארקה"],
  ["SCL", "Santiago", "Chile", "Arturo Merino Benítez", "סנטיאגו", "צ'ילה", "ארטורו מרינו בניטס"],
  ["LIM", "Lima", "Peru", "Jorge Chávez", "לימה", "פרו", "חורחה צ'אבס"],
  ["BOG", "Bogotá", "Colombia", "El Dorado", "בוגוטה", "קולומביה", "אל דוראדו"],
  // Africa
  ["JNB", "Johannesburg", "South Africa", "O. R. Tambo", "יוהנסבורג", "דרום אפריקה", "או. אר. טמבו"],
  ["CPT", "Cape Town", "South Africa", "Cape Town", "קייפטאון", "דרום אפריקה", "קייפטאון"],
  ["CMN", "Casablanca", "Morocco", "Mohammed V", "קזבלנקה", "מרוקו", "מוחמד החמישי"],
  ["RAK", "Marrakech", "Morocco", "Menara", "מרקש", "מרוקו", "מנארה"],
  ["NBO", "Nairobi", "Kenya", "Jomo Kenyatta", "ניירובי", "קניה", "ג'ומו קניאטה"],
  ["ADD", "Addis Ababa", "Ethiopia", "Bole", "אדיס אבבה", "אתיופיה", "בולה"],
  ["DAR", "Dar es Salaam", "Tanzania", "Julius Nyerere", "דאר א-סלאם", "טנזניה", "ג'וליוס נייררה"],
  ["ZNZ", "Zanzibar", "Tanzania", "Abeid Amani Karume", "זנזיבר", "טנזניה", "אבייד אמאני קארומה"],
  ["LOS", "Lagos", "Nigeria", "Murtala Muhammed", "לאגוס", "ניגריה", "מורטלה מוחמד"],
  ["ACC", "Accra", "Ghana", "Kotoka", "אקרה", "גאנה", "קוטוקה"],
  // Oceania
  ["SYD", "Sydney", "Australia", "Kingsford Smith", "סידני", "אוסטרליה", "קינגספורד סמית'"],
  ["MEL", "Melbourne", "Australia", "Tullamarine", "מלבורן", "אוסטרליה", "טולאמארין"],
  ["BNE", "Brisbane", "Australia", "Brisbane", "בריזביין", "אוסטרליה", "בריזביין"],
  ["PER", "Perth", "Australia", "Perth", "פרת'", "אוסטרליה", "פרת'"],
  ["AKL", "Auckland", "New Zealand", "Auckland", "אוקלנד", "ניו זילנד", "אוקלנד"],
  ["CHC", "Christchurch", "New Zealand", "Christchurch", "קרייסטצ'רץ'", "ניו זילנד", "קרייסטצ'רץ'"],
];

export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const q = (body.query || "").trim().toLowerCase();
    if (q.length < 1) return Response.json({ results: [] });

    const scored = AIRPORTS.map(([iata, city, country, name, heCity, heCountry, heName]) => {
      const ci = city.toLowerCase(), co = country.toLowerCase(), nm = name.toLowerCase(), it = iata.toLowerCase();
      const hc = (heCity || "").toLowerCase(), hco = (heCountry || "").toLowerCase(), hn = (heName || "").toLowerCase();
      let score = -1;
      if (it === q) score = 100;
      else if (it.startsWith(q)) score = 95;
      else if (ci === q || hc === q) score = 92;
      else if (ci.startsWith(q) || hc.startsWith(q)) score = 90;
      else if (co === q || hco === q) score = 85;
      else if (co.startsWith(q) || hco.startsWith(q)) score = 80;
      else if (ci.includes(q) || hc.includes(q)) score = 70;
      else if (co.includes(q) || hco.includes(q)) score = 60;
      else if (nm.includes(q) || hn.includes(q)) score = 30;
      return { iata, city, country, name, heCity, heCountry, heName, score };
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
      heName: a.heName,
    }));

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}