export interface HotelDestination {
  city: string
  country: string
  region: string
  popular?: boolean
}

export const hotelDestinations: HotelDestination[] = [
  // Nigeria
  { city: 'Abuja', country: 'Nigeria', region: 'Africa', popular: true },
  { city: 'Lagos', country: 'Nigeria', region: 'Africa', popular: true },
  { city: 'Kano', country: 'Nigeria', region: 'Africa' },
  { city: 'Port Harcourt', country: 'Nigeria', region: 'Africa' },
  { city: 'Enugu', country: 'Nigeria', region: 'Africa' },
  { city: 'Ibadan', country: 'Nigeria', region: 'Africa' },
  { city: 'Calabar', country: 'Nigeria', region: 'Africa' },
  { city: 'Benin City', country: 'Nigeria', region: 'Africa' },
  { city: 'Owerri', country: 'Nigeria', region: 'Africa' },
  { city: 'Akure', country: 'Nigeria', region: 'Africa' },
  { city: 'Ondo', country: 'Nigeria', region: 'Africa' },
  { city: 'Abeokuta', country: 'Nigeria', region: 'Africa' },
  { city: 'Uyo', country: 'Nigeria', region: 'Africa' },
  { city: 'Aba', country: 'Nigeria', region: 'Africa' },
  { city: 'Warri', country: 'Nigeria', region: 'Africa' },
  { city: 'Asaba', country: 'Nigeria', region: 'Africa' },
  { city: 'Jos', country: 'Nigeria', region: 'Africa' },
  { city: 'Kaduna', country: 'Nigeria', region: 'Africa' },
  { city: 'Zaria', country: 'Nigeria', region: 'Africa' },
  { city: 'Minna', country: 'Nigeria', region: 'Africa' },
  { city: 'Lokoja', country: 'Nigeria', region: 'Africa' },
  { city: 'Abakaliki', country: 'Nigeria', region: 'Africa' },
  { city: 'Ebonyi', country: 'Nigeria', region: 'Africa' },
  { city: 'Yola', country: 'Nigeria', region: 'Africa' },
  { city: 'Bauchi', country: 'Nigeria', region: 'Africa' },
  { city: 'Gombe', country: 'Nigeria', region: 'Africa' },
  { city: 'Gusau', country: 'Nigeria', region: 'Africa' },
  { city: 'Birnin Kebbi', country: 'Nigeria', region: 'Africa' },
  { city: 'Lafia', country: 'Nigeria', region: 'Africa' },
  { city: 'Makurdi', country: 'Nigeria', region: 'Africa' },
  { city: 'Dutse', country: 'Nigeria', region: 'Africa' },
  { city: 'Damaturu', country: 'Nigeria', region: 'Africa' },
  { city: 'Jalingo', country: 'Nigeria', region: 'Africa' },
  { city: 'Umuahia', country: 'Nigeria', region: 'Africa' },
  { city: 'Awka', country: 'Nigeria', region: 'Africa' },
  { city: 'Onitsha', country: 'Nigeria', region: 'Africa' },
  { city: 'Sapele', country: 'Nigeria', region: 'Africa' },
  { city: 'Ado-Ekiti', country: 'Nigeria', region: 'Africa' },
  { city: 'Osogbo', country: 'Nigeria', region: 'Africa' },
  { city: 'Ilorin', country: 'Nigeria', region: 'Africa' },
  // West Africa
  { city: 'Accra', country: 'Ghana', region: 'Africa', popular: true },
  { city: 'Kumasi', country: 'Ghana', region: 'Africa' },
  { city: 'Dakar', country: 'Senegal', region: 'Africa' },
  { city: 'Abidjan', country: 'Côte d\'Ivoire', region: 'Africa' },
  { city: 'Lomé', country: 'Togo', region: 'Africa' },
  { city: 'Cotonou', country: 'Benin', region: 'Africa' },
  // East Africa
  { city: 'Nairobi', country: 'Kenya', region: 'Africa', popular: true },
  { city: 'Mombasa', country: 'Kenya', region: 'Africa' },
  { city: 'Dar es Salaam', country: 'Tanzania', region: 'Africa' },
  { city: 'Zanzibar', country: 'Tanzania', region: 'Africa' },
  { city: 'Kampala', country: 'Uganda', region: 'Africa' },
  { city: 'Addis Ababa', country: 'Ethiopia', region: 'Africa' },
  // Southern Africa
  { city: 'Johannesburg', country: 'South Africa', region: 'Africa', popular: true },
  { city: 'Cape Town', country: 'South Africa', region: 'Africa', popular: true },
  { city: 'Durban', country: 'South Africa', region: 'Africa' },
  { city: 'Gaborone', country: 'Botswana', region: 'Africa' },
  // Middle East
  { city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', popular: true },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', region: 'Middle East', popular: true },
  { city: 'Doha', country: 'Qatar', region: 'Middle East' },
  { city: 'Riyadh', country: 'Saudi Arabia', region: 'Middle East' },
  { city: 'Jeddah', country: 'Saudi Arabia', region: 'Middle East' },
  { city: 'Mecca', country: 'Saudi Arabia', region: 'Middle East' },
  { city: 'Medina', country: 'Saudi Arabia', region: 'Middle East' },
  { city: 'Kuwait City', country: 'Kuwait', region: 'Middle East' },
  { city: 'Manama', country: 'Bahrain', region: 'Middle East' },
  { city: 'Muscat', country: 'Oman', region: 'Middle East' },
  { city: 'Beirut', country: 'Lebanon', region: 'Middle East' },
  // Europe
  { city: 'London', country: 'United Kingdom', region: 'Europe', popular: true },
  { city: 'Manchester', country: 'United Kingdom', region: 'Europe' },
  { city: 'Edinburgh', country: 'United Kingdom', region: 'Europe' },
  { city: 'Paris', country: 'France', region: 'Europe', popular: true },
  { city: 'Nice', country: 'France', region: 'Europe' },
  { city: 'Amsterdam', country: 'Netherlands', region: 'Europe' },
  { city: 'Frankfurt', country: 'Germany', region: 'Europe' },
  { city: 'Berlin', country: 'Germany', region: 'Europe' },
  { city: 'Munich', country: 'Germany', region: 'Europe' },
  { city: 'Istanbul', country: 'Turkey', region: 'Europe', popular: true },
  { city: 'Ankara', country: 'Turkey', region: 'Europe' },
  { city: 'Madrid', country: 'Spain', region: 'Europe' },
  { city: 'Barcelona', country: 'Spain', region: 'Europe' },
  { city: 'Rome', country: 'Italy', region: 'Europe' },
  { city: 'Milan', country: 'Italy', region: 'Europe' },
  { city: 'Venice', country: 'Italy', region: 'Europe' },
  { city: 'Zurich', country: 'Switzerland', region: 'Europe' },
  { city: 'Geneva', country: 'Switzerland', region: 'Europe' },
  { city: 'Brussels', country: 'Belgium', region: 'Europe' },
  { city: 'Vienna', country: 'Austria', region: 'Europe' },
  { city: 'Prague', country: 'Czech Republic', region: 'Europe' },
  { city: 'Budapest', country: 'Hungary', region: 'Europe' },
  { city: 'Athens', country: 'Greece', region: 'Europe' },
  { city: 'Lisbon', country: 'Portugal', region: 'Europe' },
  { city: 'Stockholm', country: 'Sweden', region: 'Europe' },
  // Americas
  { city: 'New York', country: 'United States', region: 'Americas', popular: true },
  { city: 'Los Angeles', country: 'United States', region: 'Americas' },
  { city: 'Chicago', country: 'United States', region: 'Americas' },
  { city: 'Washington D.C.', country: 'United States', region: 'Americas' },
  { city: 'Houston', country: 'United States', region: 'Americas' },
  { city: 'Miami', country: 'United States', region: 'Americas' },
  { city: 'Toronto', country: 'Canada', region: 'Americas' },
  { city: 'Vancouver', country: 'Canada', region: 'Americas' },
  { city: 'São Paulo', country: 'Brazil', region: 'Americas' },
  // Asia
  { city: 'Dubai', country: 'United Arab Emirates', region: 'Asia' },
  { city: 'Mumbai', country: 'India', region: 'Asia' },
  { city: 'New Delhi', country: 'India', region: 'Asia' },
  { city: 'Singapore', country: 'Singapore', region: 'Asia', popular: true },
  { city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia' },
  { city: 'Bangkok', country: 'Thailand', region: 'Asia', popular: true },
  { city: 'Phuket', country: 'Thailand', region: 'Asia' },
  { city: 'Bali', country: 'Indonesia', region: 'Asia' },
  { city: 'Jakarta', country: 'Indonesia', region: 'Asia' },
  { city: 'Hong Kong', country: 'Hong Kong', region: 'Asia' },
  { city: 'Beijing', country: 'China', region: 'Asia' },
  { city: 'Shanghai', country: 'China', region: 'Asia' },
  { city: 'Tokyo', country: 'Japan', region: 'Asia' },
  { city: 'Osaka', country: 'Japan', region: 'Asia' },
  { city: 'Seoul', country: 'South Korea', region: 'Asia' },
]

export function searchHotelDestinations(query: string): HotelDestination[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return hotelDestinations
    .filter(d =>
      d.city.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q)
    )
    .slice(0, 8)
}

export function getPopularDestinations(): HotelDestination[] {
  return hotelDestinations.filter(d => d.popular).slice(0, 6)
}
