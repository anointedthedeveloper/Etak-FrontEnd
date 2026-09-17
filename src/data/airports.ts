export interface Airport {
  code: string
  name: string
  city: string
  country: string
  region: string
}

export const airports: Airport[] = [
  // Nigeria
  { code: 'ABV', name: 'Nnamdi Azikiwe International Airport', city: 'Abuja', country: 'Nigeria', region: 'Africa' },
  { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria', region: 'Africa' },
  { code: 'KAN', name: 'Mallam Aminu Kano International Airport', city: 'Kano', country: 'Nigeria', region: 'Africa' },
  { code: 'PHC', name: 'Port Harcourt International Airport', city: 'Port Harcourt', country: 'Nigeria', region: 'Africa' },
  { code: 'ENU', name: 'Akanu Ibiam International Airport', city: 'Enugu', country: 'Nigeria', region: 'Africa' },
  { code: 'ILR', name: 'Ilorin International Airport', city: 'Ilorin', country: 'Nigeria', region: 'Africa' },
  { code: 'CBQ', name: 'Margaret Ekpo International Airport', city: 'Calabar', country: 'Nigeria', region: 'Africa' },
  { code: 'BNI', name: 'Benin Airport', city: 'Benin City', country: 'Nigeria', region: 'Africa' },
  { code: 'SKO', name: 'Sadiq Abubakar III International Airport', city: 'Sokoto', country: 'Nigeria', region: 'Africa' },
  { code: 'MIU', name: 'Maiduguri International Airport', city: 'Maiduguri', country: 'Nigeria', region: 'Africa' },
  { code: 'QOW', name: 'Sam Mbakwe International Cargo Airport', city: 'Owerri', country: 'Nigeria', region: 'Africa' },
  { code: 'AKR', name: 'Akure Airport', city: 'Akure', country: 'Nigeria', region: 'Africa' },
  { code: 'ABB', name: 'Asaba International Airport', city: 'Asaba', country: 'Nigeria', region: 'Africa' },
  { code: 'YOL', name: 'Yola Airport', city: 'Yola', country: 'Nigeria', region: 'Africa' },
  { code: 'JOS', name: 'Yakubu Gowon Airport', city: 'Jos', country: 'Nigeria', region: 'Africa' },
  { code: 'KAD', name: 'Kaduna Airport', city: 'Kaduna', country: 'Nigeria', region: 'Africa' },
  { code: 'MXJ', name: 'Minna Airport', city: 'Minna', country: 'Nigeria', region: 'Africa' },
  { code: 'BCU', name: 'Bauchi Airport', city: 'Bauchi', country: 'Nigeria', region: 'Africa' },
  { code: 'GMO', name: 'Gombe Lawanti International Airport', city: 'Gombe', country: 'Nigeria', region: 'Africa' },
  { code: 'IBA', name: 'Ibadan Airport', city: 'Ibadan', country: 'Nigeria', region: 'Africa' },
  // Nigerian cities without scheduled airports (shown as nearest airport)
  { code: 'ABV', name: 'Nearest: Abuja (ABV)', city: 'Ondo State', country: 'Nigeria', region: 'Africa' },
  { code: 'ABV', name: 'Nearest: Abuja (ABV)', city: 'Ebonyi', country: 'Nigeria', region: 'Africa' },
  { code: 'ABV', name: 'Nearest: Abuja (ABV)', city: 'Nasarawa', country: 'Nigeria', region: 'Africa' },
  { code: 'ABV', name: 'Nearest: Abuja (ABV)', city: 'Kogi', country: 'Nigeria', region: 'Africa' },
  { code: 'ABV', name: 'Nearest: Abuja (ABV)', city: 'Lokoja', country: 'Nigeria', region: 'Africa' },
  { code: 'ENU', name: 'Nearest: Enugu (ENU)', city: 'Abakaliki', country: 'Nigeria', region: 'Africa' },
  { code: 'ENU', name: 'Nearest: Enugu (ENU)', city: 'Ebonyi State', country: 'Nigeria', region: 'Africa' },
  { code: 'BNI', name: 'Nearest: Benin City (BNI)', city: 'Abeokuta', country: 'Nigeria', region: 'Africa' },
  { code: 'BNI', name: 'Nearest: Benin City (BNI)', city: 'Warri', country: 'Nigeria', region: 'Africa' },
  { code: 'BNI', name: 'Nearest: Benin City (BNI)', city: 'Sapele', country: 'Nigeria', region: 'Africa' },
  { code: 'PHC', name: 'Nearest: Port Harcourt (PHC)', city: 'Uyo', country: 'Nigeria', region: 'Africa' },
  { code: 'PHC', name: 'Nearest: Port Harcourt (PHC)', city: 'Aba', country: 'Nigeria', region: 'Africa' },
  { code: 'LOS', name: 'Nearest: Lagos (LOS)', city: 'Ogun State', country: 'Nigeria', region: 'Africa' },
  { code: 'LOS', name: 'Nearest: Lagos (LOS)', city: 'Osun State', country: 'Nigeria', region: 'Africa' },
  { code: 'LOS', name: 'Nearest: Lagos (LOS)', city: 'Oyo State', country: 'Nigeria', region: 'Africa' },
  { code: 'LOS', name: 'Nearest: Lagos (LOS)', city: 'Ekiti State', country: 'Nigeria', region: 'Africa' },
  { code: 'LOS', name: 'Nearest: Lagos (LOS)', city: 'Ondo', country: 'Nigeria', region: 'Africa' },
  { code: 'LOS', name: 'Nearest: Lagos (LOS)', city: 'Akure', country: 'Nigeria', region: 'Africa' },
  { code: 'KAN', name: 'Nearest: Kano (KAN)', city: 'Zaria', country: 'Nigeria', region: 'Africa' },
  { code: 'KAN', name: 'Nearest: Kano (KAN)', city: 'Dutse', country: 'Nigeria', region: 'Africa' },
  { code: 'SKO', name: 'Nearest: Sokoto (SKO)', city: 'Gusau', country: 'Nigeria', region: 'Africa' },
  { code: 'SKO', name: 'Nearest: Sokoto (SKO)', city: 'Birnin Kebbi', country: 'Nigeria', region: 'Africa' },
  // West Africa
  { code: 'ACC', name: 'Kotoka International Airport', city: 'Accra', country: 'Ghana', region: 'Africa' },
  { code: 'DKR', name: 'Blaise Diagne International Airport', city: 'Dakar', country: 'Senegal', region: 'Africa' },
  { code: 'ABJ', name: 'Félix-Houphouët-Boigny International Airport', city: 'Abidjan', country: 'Côte d\'Ivoire', region: 'Africa' },
  { code: 'COO', name: 'Cadjehoun Airport', city: 'Cotonou', country: 'Benin', region: 'Africa' },
  // East & Southern Africa
  { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya', region: 'Africa' },
  { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', region: 'Africa' },
  { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa', region: 'Africa' },
  { code: 'ADD', name: 'Addis Ababa Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia', region: 'Africa' },
  { code: 'DAR', name: 'Julius Nyerere International Airport', city: 'Dar es Salaam', country: 'Tanzania', region: 'Africa' },
  { code: 'EBB', name: 'Entebbe International Airport', city: 'Entebbe', country: 'Uganda', region: 'Africa' },
  // Middle East
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East' },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', region: 'Middle East' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', region: 'Middle East' },
  { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', region: 'Middle East' },
  { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia', region: 'Middle East' },
  { code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait', region: 'Middle East' },
  { code: 'BAH', name: 'Bahrain International Airport', city: 'Manama', country: 'Bahrain', region: 'Middle East' },
  // Europe
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', region: 'Europe' },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom', region: 'Europe' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', region: 'Europe' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', region: 'Europe' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', region: 'Europe' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', region: 'Europe' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain', region: 'Europe' },
  { code: 'FCO', name: 'Leonardo da Vinci International Airport', city: 'Rome', country: 'Italy', region: 'Europe' },
  { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', region: 'Europe' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', region: 'Europe' },
  { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', region: 'Europe' },
  // North America
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', region: 'Americas' },
  { code: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark', country: 'United States', region: 'Americas' },
  { code: 'IAD', name: 'Dulles International Airport', city: 'Washington D.C.', country: 'United States', region: 'Americas' },
  { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'United States', region: 'Americas' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', region: 'Americas' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', region: 'Americas' },
  // Asia
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', region: 'Asia' },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India', region: 'Asia' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', region: 'Asia' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', region: 'Asia' },
  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', region: 'Asia' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', region: 'Asia' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', region: 'Asia' },
]

export function searchAirports(query: string): Airport[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return airports
    .filter(a =>
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
    )
    .slice(0, 6)
}
