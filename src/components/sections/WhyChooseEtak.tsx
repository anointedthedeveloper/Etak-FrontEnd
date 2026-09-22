import { CheckCircle2, Users, Globe, Clock, HeartHandshake, TrendingDown } from 'lucide-react'
import { SectionHeader } from '../ui/index'
import { useRevealChildren, useInView } from '../../hooks/useInView'
import { useCountUp } from '../../hooks/useCountUp'

const values = [
  { icon: CheckCircle2,   title: 'Professional Coordination', desc: 'Every arrangement handled with attention to detail, from first inquiry to your return.',      accent: '#08A9E0' },
  { icon: Users,          title: 'Personalised Service',      desc: 'We tailor our support to your specific travel needs and requirements.',                        accent: '#087EAF' },
  { icon: Globe,          title: 'Local & International',     desc: 'Travelling within Africa or worldwide — we have the knowledge to support you.',                 accent: '#08A9E0' },
  { icon: Clock,          title: 'Before, During & After',    desc: "Our support doesn't end at ticket issuance. We're available throughout your trip.",             accent: '#087EAF' },
  { icon: HeartHandshake, title: 'Client Relationships',      desc: 'We build long-term relationships, not just one-time transactions.',                            accent: '#08A9E0' },
  { icon: TrendingDown,   title: 'Cost-Conscious Planning',   desc: 'Best value for your budget without compromising on quality or comfort.',                       accent: '#087EAF' },
]

const stats = [
  { value: '500+', label: 'Clients Served' },
  { value: '50+',  label: 'Destinations' },
  { value: '16+',  label: 'Years Experience' },
  { value: '24/7', label: 'Support' },
]

function StatValue({ value, start }: { value: string; start: boolean }) {
  const match = value.match(/^(\d+)(.*)$/)
  const count = useCountUp(match ? parseInt(match[1], 10) : 0, start && !!match)
  if (!match) return <>{value}</>
  return <>{start ? count : 0}{match[2]}</>
}

export default function WhyChooseEtak() {
  const gridRef = useRevealChildren<HTMLDivElement>()
  const { ref: statsRef, inView: statsVisible } = useInView<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="site-gutter w-full">

        <SectionHeader
          eyebrow="Why Etak"
          title="A Travel Partner You Can Rely On"
          subtitle="CAC Registered (RC 898792) · IATA Affiliated · Based in Abuja, Nigeria"
          centered
        />

        {/* Value cards — clean white on light grey, no decorative noise */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-card overflow-hidden">
          {values.map(({ icon: Icon, title, desc, accent }, i) => (
            <div
              key={title}
              className={`reveal stagger-${i + 1} group flex gap-4 p-6 bg-white hover:bg-gray-50 transition-colors duration-200`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: `${accent}15` }}
              >
                <Icon size={18} style={{ color: accent }} />
              </div>
              <div>
                <h4 className="font-semibold text-[#101B46] text-sm mb-1">{title}</h4>
                <p className="text-[#667085] text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats strip — clean dark bar, no gradients inside each cell */}
        <div
          ref={statsRef}
          className={`mt-10 grid grid-cols-2 sm:grid-cols-4 rounded-card overflow-hidden border border-[#101B46] transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center py-8 px-4 bg-[#101B46] ${i < stats.length - 1 ? 'border-r border-white/10' : ''}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="font-display text-3xl sm:text-4xl font-bold text-white mb-1 tabular-nums">
                <StatValue value={value} start={statsVisible} />
              </span>
              <span className="text-[#08A9E0] text-xs font-medium tracking-wide uppercase">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
