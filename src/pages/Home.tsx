import Hero from '../components/hero/Hero'
import ServicesShowcase from '../components/sections/ServicesShowcase'
import FeaturedDestinations from '../components/sections/FeaturedDestinations'
import WhyChooseEtak from '../components/sections/WhyChooseEtak'
import FeaturedPackages from '../components/sections/FeaturedPackages'
import FinalCTA from '../components/sections/FinalCTA'

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesShowcase />
      <FeaturedDestinations />
      <WhyChooseEtak />
      <FeaturedPackages />
      <FinalCTA />
    </>
  )
}
