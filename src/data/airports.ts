export interface Airport {
  code: string
  name: string
  city: string
  state: string
  country: string
  region: string
  aliases?: string[] // extra search terms
}

// All 36 states + FCT — every state capital mapped to nearest/serving airport
export const nigerianAirports: Airport[] = [
  // ── States with their own airports ───────────────────────────────────────
  { code: 'ABV', name: 'Nnamdi Azikiwe International Airport', city: 'Abuja', state: 'FCT', country: 'Nigeria', region: 'Africa', aliases: ['fct', 'federal capital territory', 'abuja'] },
  { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', state: 'Lagos', country: 'Nigeria', region: 'Africa', aliases: ['ikeja', 'lagos island', 'victoria island'] },
  { code: 'KAN', name: 'Mallam Aminu Kano International Airport', city: 'Kano', state: 'Kano', country: 'Nigeria', region: 'Africa', aliases: ['kano state'] },
  { code: 'PHC', name: 'Port Harcourt International Airport', city: 'Port Harcourt', state: 'Rivers', country: 'Nigeria', region: 'Africa', aliases: ['rivers', 'rivers state', 'omagwa', 'ph'] },
  { code: 'ENU', name: 'Akanu Ibiam International Airport', city: 'Enugu', state: 'Enugu', country: 'Nigeria', region: 'Africa', aliases: ['enugu state'] },
  { code: 'ILR', name: 'Ilorin International Airport', city: 'Ilorin', state: 'Kwara', country: 'Nigeria', region: 'Africa', aliases: ['kwara', 'kwara state'] },
  { code: 'CBQ', name: 'Margaret Ekpo International Airport', city: 'Calabar', state: 'Cross River', country: 'Nigeria', region: 'Africa', aliases: ['cross river', 'cross river state'] },
  { code: 'BNI', name: 'Benin Airport', city: 'Benin City', state: 'Edo', country: 'Nigeria', region: 'Africa', aliases: ['edo', 'edo state', 'benin'] },
  { code: 'SKO', name: 'Sadiq Abubakar III International Airport', city: 'Sokoto', state: 'Sokoto', country: 'Nigeria', region: 'Africa', aliases: ['sokoto state'] },
  { code: 'MIU', name: 'Maiduguri International Airport', city: 'Maiduguri', state: 'Borno', country: 'Nigeria', region: 'Africa', aliases: ['borno', 'borno state'] },
  { code: 'QOW', name: 'Sam Mbakwe International Cargo Airport', city: 'Owerri', state: 'Imo', country: 'Nigeria', region: 'Africa', aliases: ['imo', 'imo state'] },
  { code: 'AKR', name: 'Akure Airport', city: 'Akure', state: 'Ondo', country: 'Nigeria', region: 'Africa', aliases: ['ondo', 'ondo state'] },
  { code: 'ABB', name: 'Asaba International Airport', city: 'Asaba', state: 'Delta', country: 'Nigeria', region: 'Africa', aliases: ['delta', 'delta state', 'asaba'] },
  { code: 'YOL', name: 'Yola Airport', city: 'Yola', state: 'Adamawa', country: 'Nigeria', region: 'Africa', aliases: ['adamawa', 'adamawa state'] },
  { code: 'JOS', name: 'Yakubu Gowon Airport', city: 'Jos', state: 'Plateau', country: 'Nigeria', region: 'Africa', aliases: ['plateau', 'plateau state'] },
  { code: 'KAD', name: 'Kaduna Airport', city: 'Kaduna', state: 'Kaduna', country: 'Nigeria', region: 'Africa', aliases: ['kaduna state'] },
  { code: 'MXJ', name: 'Minna Airport', city: 'Minna', state: 'Niger', country: 'Nigeria', region: 'Africa', aliases: ['niger state', 'niger'] },
  { code: 'BCU', name: 'Bauchi Airport', city: 'Bauchi', state: 'Bauchi', country: 'Nigeria', region: 'Africa', aliases: ['bauchi state'] },
  { code: 'GMO', name: 'Gombe Lawanti International Airport', city: 'Gombe', state: 'Gombe', country: 'Nigeria', region: 'Africa', aliases: ['gombe state'] },
  { code: 'IBA', name: 'Ibadan Airport', city: 'Ibadan', state: 'Oyo', country: 'Nigeria', region: 'Africa', aliases: ['oyo', 'oyo state'] },
  { code: 'QRW', name: 'Warri Airport', city: 'Warri', state: 'Delta', country: 'Nigeria', region: 'Africa', aliases: ['effurun'] },
  { code: 'ZAR', name: 'Zaria Airport', city: 'Zaria', state: 'Kaduna', country: 'Nigeria', region: 'Africa' },
  { code: 'KTS', name: 'Katsina Airport', city: 'Katsina', state: 'Katsina', country: 'Nigeria', region: 'Africa', aliases: ['katsina state'] },
  { code: 'SKO', name: 'Kebbi Airport (via Sokoto)', city: 'Birnin Kebbi', state: 'Kebbi', country: 'Nigeria', region: 'Africa', aliases: ['kebbi', 'kebbi state', 'birnin kebbi'] },
  { code: 'SKO', name: 'Gusau Airport (via Sokoto)', city: 'Gusau', state: 'Zamfara', country: 'Nigeria', region: 'Africa', aliases: ['zamfara', 'zamfara state', 'gusau'] },
  { code: 'KAN', name: 'Dutse Airport (via Kano)', city: 'Dutse', state: 'Jigawa', country: 'Nigeria', region: 'Africa', aliases: ['jigawa', 'jigawa state', 'dutse'] },
  // ── Benue ─────────────────────────────────────────────────────────────────
  { code: 'MKD', name: 'Makurdi Airport', city: 'Makurdi', state: 'Benue', country: 'Nigeria', region: 'Africa', aliases: ['benue', 'benue state', 'makurdi'] },
  // ── States served via nearest airport ─────────────────────────────────────
  { code: 'ABV', name: 'Nearest Airport: Abuja (ABV)', city: 'Lafia', state: 'Nasarawa', country: 'Nigeria', region: 'Africa', aliases: ['nasarawa', 'nasarawa state'] },
  { code: 'ABV', name: 'Nearest Airport: Abuja (ABV)', city: 'Lokoja', state: 'Kogi', country: 'Nigeria', region: 'Africa', aliases: ['kogi', 'kogi state'] },
  { code: 'ABV', name: 'Nearest Airport: Abuja (ABV)', city: 'Abeokuta', state: 'Ogun', country: 'Nigeria', region: 'Africa', aliases: ['ogun', 'ogun state'] },
  { code: 'ENU', name: 'Nearest Airport: Enugu (ENU)', city: 'Abakaliki', state: 'Ebonyi', country: 'Nigeria', region: 'Africa', aliases: ['ebonyi', 'ebonyi state', 'abakaliki'] },
  { code: 'ENU', name: 'Nearest Airport: Enugu (ENU)', city: 'Awka', state: 'Anambra', country: 'Nigeria', region: 'Africa', aliases: ['anambra', 'anambra state', 'awka', 'onitsha'] },
  { code: 'PHC', name: 'Nearest Airport: Port Harcourt (PHC)', city: 'Uyo', state: 'Akwa Ibom', country: 'Nigeria', region: 'Africa', aliases: ['akwa ibom', 'akwa ibom state'] },
  { code: 'PHC', name: 'Nearest Airport: Port Harcourt (PHC)', city: 'Aba', state: 'Abia', country: 'Nigeria', region: 'Africa', aliases: ['abia', 'abia state', 'umuahia'] },
  { code: 'ILR', name: 'Nearest Airport: Ilorin (ILR)', city: 'Ado-Ekiti', state: 'Ekiti', country: 'Nigeria', region: 'Africa', aliases: ['ekiti', 'ekiti state', 'ado ekiti'] },
  { code: 'IBA', name: 'Nearest Airport: Ibadan (IBA)', city: 'Osogbo', state: 'Osun', country: 'Nigeria', region: 'Africa', aliases: ['osun', 'osun state', 'osogbo'] },
  { code: 'YOL', name: 'Nearest Airport: Yola (YOL)', city: 'Jalingo', state: 'Taraba', country: 'Nigeria', region: 'Africa', aliases: ['taraba', 'taraba state', 'jalingo'] },
]

export const internationalAirports: Airport[] = [
  // West Africa
  { code: 'ACC', name: 'Kotoka International Airport', city: 'Accra', state: '', country: 'Ghana', region: 'Africa' },
  { code: 'DKR', name: 'Blaise Diagne International Airport', city: 'Dakar', state: '', country: 'Senegal', region: 'Africa' },
  { code: 'ABJ', name: 'Félix-Houphouët-Boigny International Airport', city: 'Abidjan', state: '', country: 'Côte d\'Ivoire', region: 'Africa' },
  { code: 'COO', name: 'Cadjehoun Airport', city: 'Cotonou', state: '', country: 'Benin', region: 'Africa' },
  // East & Southern Africa
  { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', state: '', country: 'Kenya', region: 'Africa' },
  { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', state: '', country: 'South Africa', region: 'Africa' },
  { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', state: '', country: 'South Africa', region: 'Africa' },
  { code: 'ADD', name: 'Addis Ababa Bole International Airport', city: 'Addis Ababa', state: '', country: 'Ethiopia', region: 'Africa' },
  { code: 'DAR', name: 'Julius Nyerere International Airport', city: 'Dar es Salaam', state: '', country: 'Tanzania', region: 'Africa' },
  { code: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', state: '', country: 'Morocco', region: 'Africa' },
  // Middle East
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', state: '', country: 'United Arab Emirates', region: 'Middle East' },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', state: '', country: 'United Arab Emirates', region: 'Middle East' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', state: '', country: 'Qatar', region: 'Middle East' },
  { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', state: '', country: 'Saudi Arabia', region: 'Middle East' },
  { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', state: '', country: 'Saudi Arabia', region: 'Middle East' },
  // Europe
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', state: '', country: 'United Kingdom', region: 'Europe' },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', state: '', country: 'United Kingdom', region: 'Europe' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', state: '', country: 'France', region: 'Europe' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', state: '', country: 'Netherlands', region: 'Europe' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', state: '', country: 'Germany', region: 'Europe' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', state: '', country: 'Turkey', region: 'Europe' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', state: '', country: 'Spain', region: 'Europe' },
  { code: 'FCO', name: 'Leonardo da Vinci International Airport', city: 'Rome', state: '', country: 'Italy', region: 'Europe' },
  // North America
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', state: '', country: 'United States', region: 'Americas' },
  { code: 'IAD', name: 'Dulles International Airport', city: 'Washington D.C.', state: '', country: 'United States', region: 'Americas' },
  { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', state: '', country: 'United States', region: 'Americas' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', state: '', country: 'United States', region: 'Americas' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', state: '', country: 'Canada', region: 'Americas' },
  // Asia
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', state: '', country: 'India', region: 'Asia' },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', state: '', country: 'India', region: 'Asia' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', state: '', country: 'Singapore', region: 'Asia' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', state: '', country: 'Malaysia', region: 'Asia' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', state: '', country: 'Hong Kong', region: 'Asia' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', state: '', country: 'Japan', region: 'Asia' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', state: '', country: 'Thailand', region: 'Asia' },
]

export const airports: Airport[] = [...nigerianAirports, ...internationalAirports]

export function searchAirports(query: string): Airport[] {
  if (!query.trim()) return []
  const q = query.toLowerCase().trim()
  const scored = airports.map(a => {
    const fields = [
      a.city.toLowerCase(),
      a.name.toLowerCase(),
      a.code.toLowerCase(),
      a.state.toLowerCase(),
      a.country.toLowerCase(),
      ...(a.aliases ?? []),
    ]
    let score = 0
    if (a.code.toLowerCase() === q) score = 100
    else if (a.city.toLowerCase() === q) score = 90
    else if (a.state.toLowerCase() === q) score = 85
    else if (fields.some(f => f.startsWith(q))) score = 70
    else if (fields.some(f => f.includes(q))) score = 50
    return { a, score }
  })
  return scored
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.a)
    .slice(0, 8)
}
