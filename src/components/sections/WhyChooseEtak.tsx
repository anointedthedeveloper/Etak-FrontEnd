import { CheckCircle2, Users, Globe, Clock, HeartHandshake, TrendingDown } from 'lucide-react'
import { SectionHeader } from '../ui/index'

const values = [
  { icon: CheckCircle2,  title: 'Professional Coordination', desc: 'Every travel arrangement is handled with attention to detail, from the first inquiry to your return.' },
  { icon: Users,         title: 'Personalised Service',      desc: 'We take time to understand your travel needs and tailor our support to your specific requirements.' },
  { icon: Globe,         title: 'Local & International Reach', desc: "Whether you're travelling within Africa or across the world, we have the knowledge to support your journey." },
  { icon: Clock,         title: 'Before, During & After',    desc: "Our support doesn't end at ticket issuance. We're available throughout your travel experience." },
  { icon: HeartHandshake,title: 'Customer Relationships',    desc: 'We build long-term relationships with our clients, not just one-time transactions.' },
  { icon: TrendingDown,  title: 'Cost-Conscious Planning',   desc: 'We help you get the best value for your travel budget without compromising on quality or comfort.' },
]

export default function WhyChooseEtak() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — values */}
          <div>
            <SectionHeader
              eyebrow="Why Etak"
              title="A Travel Partner You Can Rely On"
              subtitle="We combine professional travel management with genuine care for every client's journey."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EAF8FD] flex items-center justify-center shrink-0">
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

          {/* Right — image */}
          <div className="relative mt-6 lg:mt-0">
            <div className="rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop"
                alt="Travel planning"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating card — repositioned so it never escapes on small screens */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-auto sm:-bottom-6 sm:left-auto sm:-left-6 sm:right-auto sm:max-w-xs bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-[#101B46] flex items-center justify-center shrink-0">
                  <Globe size={16} className="text-[#08A9E0]" />
                </div>
                <div>
                  <div className="font-bold text-[#101B46] text-sm">CAC Registered</div>
                  <div className="text-[#667085] text-xs">RC 898792</div>
                </div>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed">
                Etak Travels & Tours Expert Limited is a registered Nigerian travel management company based in Abuja, FCT.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
