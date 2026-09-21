import Hero from '../components/hero/Hero'
import ServicesShowcase from '../components/sections/ServicesShowcase'
import FeaturedDestinations from '../components/sections/FeaturedDestinations'
import WhyChooseEtak from '../components/sections/WhyChooseEtak'
import TravelProcess from '../components/sections/TravelProcess'
import FeaturedPackages from '../components/sections/FeaturedPackages'
import Testimonials from '../components/sections/Testimonials'
import FinalCTA from '../components/sections/FinalCTA'

export default function Home() {
  return (
    <>
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
