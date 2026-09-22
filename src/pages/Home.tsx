import Hero from '../components/hero/Hero'
import ServicesShowcase from '../components/sections/ServicesShowcase'
import FeaturedDestinations from '../components/sections/FeaturedDestinations'
import WhyChooseEtak from '../components/sections/WhyChooseEtak'
import TravelProcess from '../components/sections/TravelProcess'
import FeaturedPackages from '../components/sections/FeaturedPackages'
import Testimonials from '../components/sections/Testimonials'
import FinalCTA from '../components/sections/FinalCTA'
import SEO from '../components/ui/SEO'

export default function Home() {
  return (
    <>
      <SEO
        title="Etak Travels & Tours Expert Limited | Travel Management in Abuja"
        description="Etak Travels & Tours Expert Limited — Abuja's trusted travel management company. Flight booking, hotel reservations, tour packages, visa assistance, and corporate travel. CAC registered RC 898792, IATA affiliated."
        keywords="Etak Travels Abuja, travel agency Nigeria, flight booking Abuja, hotel reservations Nigeria, tour packages Nigeria, visa assistance Abuja, corporate travel Nigeria"
        url="/"
        image="/brand/og-image.jpg"
        images={[
          { url: '/brand/og-image.jpg', alt: 'Etak Travels & Tours Expert Limited — Travel Agency Abuja Nigeria' },
          { url: '/brand/logo.png', alt: 'Etak Travels Logo' },
          { url: '/images/tours/dubai.jpg', alt: 'Dubai — Featured Destination — Etak Travels' },
          { url: '/images/tours/london.jpg', alt: 'London — Featured Destination — Etak Travels' },
          { url: '/images/tours/istanbul.jpg', alt: 'Istanbul — Featured Destination — Etak Travels' },
          { url: '/images/services/flight.jpg', alt: 'Flight Booking Service — Etak Travels Nigeria' },
          { url: '/images/services/hotel.jpg', alt: 'Hotel Reservations Service — Etak Travels Nigeria' },
        ]}
      />
      <Hero />
      <ServicesShowcase />
      <FeaturedDestinations />
      <WhyChooseEtak />
      <TravelProcess />
      <FeaturedPackages />
      <Testimonials />
      <FinalCTA />
    </>
  )
}
