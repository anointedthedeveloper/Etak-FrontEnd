import { CheckCircle2, Users, Globe, Clock, HeartHandshake, TrendingDown } from 'lucide-react'
import { SectionHeader } from '../ui/index'

const values = [
  { icon: CheckCircle2,   title: 'Professional Coordination', desc: 'Every arrangement handled with attention to detail, from first inquiry to your return.' },
  { icon: Users,          title: 'Personalised Service',      desc: 'We tailor our support to your specific travel needs and requirements.' },
  { icon: Globe,          title: 'Local & International',     desc: 'Travelling within Africa or worldwide — we have the knowledge to support you.' },
  { icon: Clock,          title: 'Before, During & After',    desc: "Our support doesn't end at ticket issuance. We're available throughout your trip." },
  { icon: HeartHandshake, title: 'Client Relationships',      desc: 'We build long-term relationships, not just one-time transactions.' },
  { icon: TrendingDown,   title: 'Cost-Conscious Planning',   desc: 'Best value for your budget without compromising on quality or comfort.' },
]

export default function WhyChooseEtak() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <SectionHeader
          eyebrow="Why Etak"
          title="A Travel Partner You Can Rely On"
          subtitle="CAC Registered (RC 898792) · IATA Affiliated · Based in Abuja, Nigeria"
          centered
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-[#EAF8FD] flex items-center justify-center shrink-0">
                <Icon size={17} className="text-[#08A9E0]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#101B46] text-sm mb-1">{title}</h4>
                <p className="text-[#667085] text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
