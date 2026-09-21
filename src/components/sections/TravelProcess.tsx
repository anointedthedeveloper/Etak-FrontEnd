import { MessageSquare, FileText, CheckCircle, Send } from 'lucide-react'
import { SectionHeader } from '../ui/index'
import { useInView, useRevealChildren } from '../../hooks/useInView'

const steps = [
  { icon: MessageSquare, step: '01', title: 'Tell Us About Your Trip',   desc: 'Share your travel plans, destination, dates, and any specific requirements through our inquiry form or by contacting us directly.' },
  { icon: FileText,      step: '02', title: 'Receive a Tailored Plan',   desc: 'Our team reviews your request and prepares a personalised travel plan or quotation based on your needs and budget.' },
  { icon: CheckCircle,   step: '03', title: 'Confirm Your Arrangements', desc: "Review the proposed plan, ask questions, and confirm your travel arrangements when you're satisfied." },
  { icon: Send,          step: '04', title: 'Travel with Confidence',    desc: 'Receive your travel documents, tickets, and any pre-travel briefing. We remain available throughout your journey.' },
]

export default function TravelProcess() {
  const { ref: lineRef, inView: lineVisible } = useInView<HTMLDivElement>({ threshold: 0.4 })
  const stepsRef = useRevealChildren<HTMLDivElement>()

  return (
    <section className="py-16 sm:py-24 bg-[#101B46]">
      <div className="site-gutter w-full">

        <SectionHeader
          eyebrow="How It Works"
          title="Your Journey, Step by Step"
          subtitle="A simple, transparent process from your first inquiry to your travel documents."
          centered
          light
        />

        {/* Desktop: horizontal numbered steps with a connecting line */}
        <div className="hidden md:block">
          {/* Connector track */}
          <div ref={lineRef} className="relative h-px bg-white/10 mx-[12.5%] mb-0 -mb-px">
            <div
              className="absolute inset-y-0 left-0 bg-[#08A9E0]/60 transition-all duration-1000 ease-out"
              style={{ width: lineVisible ? '100%' : '0%' }}
            />
          </div>

          <div ref={stepsRef} className="grid grid-cols-4 gap-6 pt-0">
            {steps.map(({ icon: Icon, step, title, desc }, i) => (
              <div key={step} className={`reveal stagger-${i + 1} flex flex-col items-center text-center pt-8`}>
                {/* Number dot sits on the line */}
                <div className="relative w-16 h-16 rounded-full bg-white/8 border border-white/15 flex items-center justify-center mb-5 -mt-8">
                  <Icon size={24} className="text-[#08A9E0]" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#08A9E0] text-white text-[10px] font-bold flex items-center justify-center">
                    {parseInt(step)}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-base mb-2 leading-snug">{title}</h3>
                <p className="text-blue-200/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical numbered list */}
        <div className="md:hidden flex flex-col">
          {steps.map(({ icon: Icon, step, title, desc }, i) => (
            <div key={step} className="flex gap-5">
              {/* Left column: number + vertical rule */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-11 h-11 rounded-full bg-white/8 border border-white/15 flex items-center justify-center">
                  <Icon size={18} className="text-[#08A9E0]" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-white/10 my-2" />
                )}
              </div>
              {/* Content */}
              <div className="pb-8 pt-1.5">
                <span className="text-[#08A9E0] text-[10px] font-bold tracking-widest uppercase">Step {step}</span>
                <h3 className="font-display font-bold text-white text-lg mt-1 mb-1.5">{title}</h3>
                <p className="text-blue-200/70 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
