import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Target, Eye, Heart, ChevronDown } from 'lucide-react'
import { SectionHeader } from '../components/ui/index'
import { Button } from '../components/ui/Button'
import SEO from '../components/ui/SEO'
import PageHeader from '../components/ui/PageHeader'

// Airline partner logos — stored locally in public/partners/
const AIRLINE_PARTNERS = [
  { name: 'Air France',          logo: '/partners/airfrance.svg' },
  { name: 'Qatar Airways',       logo: '/partners/qatar.svg' },
  { name: 'Lufthansa',           logo: '/partners/lufthansa.svg' },
  { name: 'Royal Air Maroc',     logo: '/partners/royalairmaroc.svg' },
  { name: 'Virgin Atlantic',     logo: '/partners/virgin.svg' },
  { name: 'Saudia',              logo: '/partners/saudia.svg' },
  { name: 'Air India',           logo: '/partners/airindia.svg' },
  { name: 'Emirates',            logo: '/partners/emirates.svg' },
  { name: 'South African Airways', logo: '/partners/saa.svg' },
  { name: 'Afriqiyah',           logo: '/partners/afriqiyah.svg' },
  { name: 'Arik Air',            logo: '/partners/arik.svg' },
  { name: 'Delta',               logo: '/partners/delta.svg' },
  { name: 'EgyptAir',            logo: '/partners/egyptair.svg' },
  { name: 'Ethiopian Airlines',  logo: '/partners/ethiopian.svg' },
  { name: 'Aero',                logo: null },
]

function PartnerLogo({ name, logo }: { name: string; logo: string | null }) {
  const [errored, setErrored] = useState(false)

  return (
    <div className="flex-shrink-0 flex items-center justify-center px-3 py-2 sm:px-6 sm:py-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 h-14 sm:h-20 min-w-[90px] sm:min-w-[140px]">
      {logo && !errored ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className="h-7 sm:h-10 w-auto max-w-[80px] sm:max-w-[120px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
          onError={() => setErrored(true)}
          loading="lazy"
        />
      ) : (
        <span className="text-xs sm:text-sm font-semibold text-[#667085] whitespace-nowrap">{name}</span>
      )}
    </div>
  )
}

const values = [
  { icon: CheckCircle2, title: 'Integrity', desc: 'We operate with honesty and transparency in every client interaction and business arrangement.' },
  { icon: Target, title: 'Quality Service', desc: 'We are committed to delivering a high standard of travel management in everything we do.' },
  { icon: CheckCircle2, title: 'Efficiency', desc: 'We work to make travel arrangements as smooth and timely as possible for every client.' },
  { icon: Heart, title: 'Innovation', desc: 'We continuously look for better ways to serve our clients and improve the travel experience.' },
]

export default function About() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Etak Travels & Tours Expert Limited — Abuja's trusted travel management company. CAC registered (RC 898792), IATA affiliated, serving individuals, families and corporates."
        keywords="about Etak Travels, Etak Limited history, Abuja travel company, CAC registered travel agency Nigeria, IATA member Nigeria"
        url="/about"
      />
      {/* Header */}
      <PageHeader
        eyebrow="About Us"
        title="Etak Travels & Tours Expert Limited"
        subtitle="A professional travel management company based in Abuja, Nigeria — providing reliable travel solutions for business, education, leisure, and international travel."
        image="/images/headers/about.jpg"
      />

      {/* Company intro */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="site-gutter w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <SectionHeader eyebrow="Who We Are" title="Your Reliable Travel Bridge to the World" />
              <div className="flex flex-col gap-4 text-[#667085] leading-relaxed">
                <p>
                  Etak Travels & Tours Expert Limited is an Abuja-based travel management company providing comprehensive travel solutions for individuals, families, businesses, and organisations across Nigeria and beyond.
                </p>
                <p>
                  We specialise in flight booking and ticketing, hotel reservations, tour packaging, visa assistance, travel consulting, and a range of support services designed to make every journey easier to arrange and more enjoyable to experience.
                </p>
                <p>
                  Whether you are travelling for business, attending a conference, pursuing education abroad, or planning a family holiday, our team is committed to providing professional, personalised travel management from your first inquiry to your safe return.
                </p>
                <p>
                  We are registered with the Corporate Affairs Commission of Nigeria (RC 898792) and operate from our office in Abuja, FCT.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Intro image */}
              <div className="relative rounded-2xl overflow-hidden h-56 sm:h-64 lg:h-52 xl:h-60 border border-gray-100 shadow-sm">
                <img
                  src="/images/sections/why-travel.jpg"
                  alt="Travel planning at Etak Travels"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101B46]/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-display font-bold text-lg leading-snug">Your journey starts with a single conversation.</p>
                  <p className="text-blue-200 text-xs mt-1">Based in Abuja · Serving Nigeria &amp; Beyond</p>
                </div>
              </div>

              {/* Mission */}
              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#101B46] flex items-center justify-center">
                    <Target size={18} className="text-[#08A9E0]" />
                  </div>
                  <h3 className="font-display font-bold text-[#101B46] text-xl">Our Mission</h3>
                </div>
                <p className="text-[#667085] text-sm leading-relaxed">
                  To provide reliable, professional, and customer-focused travel management services that make every journey — whether for business, education, or leisure — easier to plan and more rewarding to experience.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#087EAF] flex items-center justify-center">
                    <Eye size={18} className="text-white" />
                  </div>
                  <h3 className="font-display font-bold text-[#101B46] text-xl">Our Vision</h3>
                </div>
                <p className="text-[#667085] text-sm leading-relaxed">
                  To be the most trusted travel management company in Nigeria — known for our integrity, quality of service, and genuine commitment to the travel success of every client we serve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F8FAFC]">
        <div className="site-gutter w-full">
          <SectionHeader eyebrow="Core Values" title="What We Stand For" centered />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF8FD] flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-[#08A9E0]" />
                </div>
                <h3 className="font-display font-bold text-[#101B46] text-xl mb-2">{title}</h3>
                <p className="text-[#667085] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company credentials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="site-gutter w-full">
          <SectionHeader eyebrow="Company Information" title="Verified Company Details" centered />
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#F8FAFC] rounded-2xl border border-gray-100 overflow-hidden">
              {[
                { label: 'Company Name', value: 'Etak Travels & Tours Expert Limited' },
                { label: 'CAC Registration', value: 'RC 898792' },
                { label: 'Business Type', value: 'Travel Management Company' },
                { label: 'Location', value: 'Abuja, FCT, Nigeria' },
                { label: 'Office Address', value: 'Block C2, 2014, ACCI Ultra Modern Shopping Centre, Along Umaru Musa Yar\'Adua (Airport Road), Piwoyi, Abuja, FCT, Nigeria' },
                { label: 'Email', value: 'info@etaktravels.com' },
                { label: 'Phone', value: '+234 803 206 2242 / +234 817 358 8783' },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 px-6 py-4 border-b border-gray-100 last:border-0">
                  <span className="text-xs font-semibold text-[#667085] uppercase tracking-wide sm:w-40 shrink-0">{label}</span>
                  <span className="text-sm text-[#172033]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-[#F8FAFC]">
        <div className="site-gutter w-full">
          <SectionHeader eyebrow="Membership & Credentials" title="Our Accreditations" centered />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10">
            {[
              {
                img: '/credentials/CAC.png',
                name: 'CAC Registration',
                detail: 'RC 898792',
                desc: 'Registered with the Corporate Affairs Commission of Nigeria as a legitimate business entity.',
                extra: 'The Corporate Affairs Commission (CAC) is the government body responsible for the regulation and supervision of the formation, incorporation, registration, management and winding up of companies in Nigeria. Etak Travels & Tours Expert Limited is duly registered under RC 898792.',
              },
              {
                img: '/credentials/IATA.png',
                name: 'IATA Membership',
                detail: 'International Air Transport Association',
                desc: 'Affiliated with the global body governing airline ticketing and travel agency standards worldwide.',
                extra: 'The International Air Transport Association (IATA) is the trade association for the world\'s airlines, representing some 300 airlines. IATA accreditation is a mark of quality and professionalism recognised globally across the aviation and travel industry.',
              },
              {
                img: '/credentials/FIRS.png',
                name: 'FIRS Registration',
                detail: 'Federal Inland Revenue Service',
                desc: 'Registered with the Federal Inland Revenue Service in compliance with Nigerian tax regulations.',
                extra: 'The Federal Inland Revenue Service (FIRS) is the agency of the Nigerian federal government responsible for assessing, collecting and accounting for tax and other revenues. Etak Travels is fully registered and tax-compliant.',
              },
            ].map(({ img, name, detail, desc, extra }) => {
              const open = expanded === name
              return (
                <div
                  key={name}
                  className={`rounded-2xl border bg-white shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${open ? 'border-[#08A9E0] shadow-md' : 'border-gray-200 hover:border-[#08A9E0]/40 hover:shadow-md'}`}
                >
                  {/* Image — click to expand */}
                  <button
                    onClick={() => setExpanded(open ? null : name)}
                    className="w-full cursor-zoom-in focus:outline-none"
                    aria-label={`${open ? 'Collapse' : 'Expand'} ${name} image`}
                  >
                    <div className={`w-full flex items-center justify-center bg-white transition-all duration-300 overflow-hidden ${open ? 'p-8 sm:p-12' : 'p-8 h-52'}`}>
                      <img
                        src={img}
                        alt={name}
                        className={`object-contain transition-all duration-300 ${open ? 'w-full max-w-sm' : 'max-h-36 max-w-[200px]'}`}
                      />
                    </div>
                  </button>

                  {/* Text */}
                  <div className="px-8 pb-6 text-center flex flex-col gap-2 flex-1">
                    <h3 className="font-display text-2xl font-bold text-[#101B46]">{name}</h3>
                    <p className="text-sm font-semibold text-[#08A9E0] uppercase tracking-wide">{detail}</p>
                    <p className="text-base text-[#667085] leading-relaxed">{desc}</p>
                    {open && (
                      <p className="text-sm text-[#667085] leading-relaxed border-t border-gray-100 pt-4 mt-2">{extra}</p>
                    )}
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => setExpanded(open ? null : name)}
                    className="flex items-center justify-center gap-2 py-4 border-t border-gray-100 text-sm font-medium text-[#08A9E0] hover:bg-[#EAF8FD] transition-colors cursor-pointer"
                  >
                    {open ? 'Show less' : 'View certificate'}
                    <ChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="site-gutter w-full">
          <SectionHeader eyebrow="Our Partners" title="Trusted Airline Partners" centered />
          <div className="mt-8 relative">
            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-white to-transparent" />
            <div className="flex animate-scroll gap-4 sm:gap-10 items-center">
              {AIRLINE_PARTNERS.map((partner) => (
                <PartnerLogo key={partner.name} {...partner} />
              ))}
              {/* Duplicate for seamless loop */}
              {AIRLINE_PARTNERS.map((partner) => (
                <PartnerLogo key={`${partner.name}-dup`} {...partner} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-white border-t border-gray-100">
        <div className="site-gutter w-full">
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 p-8 sm:p-10 rounded-2xl border border-gray-200 bg-[#F8FAFC]">
            <div className="text-center lg:text-left">
              <div className="w-10 h-1 bg-[#08A9E0] rounded-full mb-4 mx-auto lg:mx-0" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101B46] mb-2">Ready to Travel with Etak?</h2>
              <p className="text-[#667085] text-sm sm:text-base max-w-md">Get in touch with our team and let us help you plan your next journey.</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-end shrink-0">
              <Link to="/contact"><Button size="lg" variant="primary">Contact Us</Button></Link>
              <Link to="/services"><Button size="lg" variant="outline">Our Services</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
