import { SectionHeader } from '../ui/index'
import { Star } from 'lucide-react'
import { useRevealChildren } from '../../hooks/useInView'

const testimonials = [
  {
    id: 1,
    name: 'A. Okafor',
    role: 'Business Traveller',
    initials: 'AO',
    rating: 5,
    text: 'Etak handled my Dubai trip from start to finish — visa, flights, and hotel. Everything was well-organised and I had no stress on travel day.',
  },
  {
    id: 2,
    name: 'F. Adeyemi',
    role: 'Leisure Traveller',
    initials: 'FA',
    rating: 5,
    text: 'I was travelling to Istanbul for the first time and had no idea where to start. The team at Etak walked me through everything and the trip was wonderful.',
  },
  {
    id: 3,
    name: 'C. Nwosu',
    role: 'Corporate Client',
    initials: 'CN',
    rating: 5,
    text: 'We use Etak for all our company travel arrangements. They are reliable, responsive, and always find good options for our team.',
  },
]

const accentColors = ['#08A9E0', '#087EAF', '#0798C8']

export default function Testimonials() {
  const gridRef = useRevealChildren<HTMLDivElement>()

  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC]">
      <div className="site-gutter w-full">

        <SectionHeader
          eyebrow="Client Feedback"
          title="What Our Clients Say"
          subtitle="Real experiences from travellers who have trusted Etak with their journeys."
          centered
        />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`reveal-flip stagger-${i + 1} relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col`}
            >
              {/* Decorative oversized quote mark */}
              <span className="quote-mark text-8xl -top-3 right-4 select-none" aria-hidden="true">&rdquo;</span>

              {/* Coloured top border */}
              <div
                className="h-0.5 w-10 rounded-full mb-5"
                style={{ backgroundColor: accentColors[i] }}
              />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="relative text-[#172033] text-sm leading-relaxed mb-6 flex-1">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: accentColors[i] }}
                >
                  {t.initials}
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
