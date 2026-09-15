import { Link } from 'react-router-dom'
import { CheckCircle2, Target, Eye, Heart } from 'lucide-react'
import { ImageSlot, SectionHeader } from '../components/ui/index'
import { Button } from '../components/ui/Button'

const values = [
  { icon: CheckCircle2, title: 'Integrity', desc: 'We operate with honesty and transparency in every client interaction and business arrangement.' },
  { icon: Target, title: 'Quality Service', desc: 'We are committed to delivering a high standard of travel management in everything we do.' },
  { icon: CheckCircle2, title: 'Efficiency', desc: 'We work to make travel arrangements as smooth and timely as possible for every client.' },
  { icon: Heart, title: 'Innovation', desc: 'We continuously look for better ways to serve our clients and improve the travel experience.' },
]

export default function About() {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#101B46] to-[#45419A] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[#08A9E0] text-sm font-semibold tracking-widest uppercase mb-3">About Us</span>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Etak Travels & Tours Expert Limited
              </h1>
              <p className="text-blue-200 text-lg leading-relaxed">
                A professional travel management company based in Abuja, Nigeria — providing reliable travel solutions for business, education, leisure, and international travel.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video border border-white/10 bg-white/5">
              <ImageSlot
                src="/logo.png"
                alt="Etak Travels brand mark"
                className="w-full h-full object-contain p-4"
                label="Brand artwork"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company intro */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
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
                  <div className="w-10 h-10 rounded-xl bg-[#45419A] flex items-center justify-center">
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
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Company Information" title="Verified Company Details" centered />
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#F8FAFC] rounded-2xl border border-gray-100 overflow-hidden">
              {[
                { label: 'Company Name', value: 'Etak Travels & Tours Expert Limited' },
                { label: 'CAC Registration', value: 'RC 898792' },
                { label: 'Business Type', value: 'Travel Management Company' },
                { label: 'Location', value: 'Abuja, FCT, Nigeria' },
                { label: 'Office Address', value: 'Block C2, 2014, ACCI Ultra Modern Shopping Centre, Along Umaru Musa Yar\'Adua (Airport Road), Piwoyi, Abuja, FCT, Nigeria' },
                { label: 'Email', value: 'etaktravels15@gmail.com' },
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

      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Membership & Credentials" title="Accreditations and certification slots" centered />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              'IATA Membership',
              'NANTA Membership',
              'Industry Certifications',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF8FD] text-[#08A9E0]">
                  <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3l7 4v5c0 4.418-3.134 8.5-7 9-3.866-.5-7-4.582-7-9V7l7-4z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-[#101B46]">{item}</h3>
                <p className="mt-3 text-sm text-[#667085]">Verification slot reserved for official credentials once approved by the company.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#101B46]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to Travel with Etak?</h2>
          <p className="text-blue-200 mb-8">Get in touch with our team and let us help you plan your next journey.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact"><Button size="lg" variant="primary">Contact Us</Button></Link>
            <Link to="/services"><Button size="lg" variant="white">Our Services</Button></Link>
          </div>
        </div>
      </section>
    </>
  )
}
