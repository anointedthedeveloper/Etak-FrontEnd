import { SectionHeader } from '../ui/index'
import { MessageSquare } from 'lucide-react'

// Placeholder — replace with real testimonials when provided by the company
const sampleTestimonials = [
  {
    id: 1,
    name: 'A. Okafor',
    role: 'Business Traveller',
    text: 'Etak handled my Dubai trip from start to finish — visa, flights, and hotel. Everything was well-organised and I had no stress on travel day.',
    placeholder: true,
  },
  {
    id: 2,
    name: 'F. Adeyemi',
    role: 'Leisure Traveller',
    text: 'I was travelling to Istanbul for the first time and had no idea where to start. The team at Etak walked me through everything and the trip was wonderful.',
    placeholder: true,
  },
  {
    id: 3,
    name: 'C. Nwosu',
    role: 'Corporate Client',
    text: 'We use Etak for all our company travel arrangements. They are reliable, responsive, and always find good options for our team.',
    placeholder: true,
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Client Feedback"
          title="What Our Clients Say"
          subtitle="Real experiences from travellers who have trusted Etak with their journeys."
          centered
        />

        <div className="bg-[#EAF8FD] border border-[#08A9E0]/20 rounded-xl p-4 mb-8 text-center">
          <p className="text-sm text-[#667085]">
            <span className="font-medium text-[#08A9E0]">Note:</span> The testimonials below are sample content. They will be replaced with verified client feedback when provided by Etak Travels & Tours Expert Limited.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleTestimonials.map(t => (
            <div key={t.id} className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
              <MessageSquare size={24} className="text-[#08A9E0] mb-4" />
              <p className="text-[#172033] text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#08A9E0] to-[#45419A] flex items-center justify-center text-white text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-[#101B46] text-sm">{t.name}</div>
                  <div className="text-[#667085] text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
