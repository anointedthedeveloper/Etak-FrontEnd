import { MessageSquare, FileText, CheckCircle, Send } from 'lucide-react'
import { SectionHeader } from '../ui/index'

const steps = [
  { icon: MessageSquare, step: '01', title: 'Tell Us About Your Trip', desc: 'Share your travel plans, destination, dates, and any specific requirements through our inquiry form or by contacting us directly.' },
  { icon: FileText, step: '02', title: 'Receive a Tailored Plan', desc: 'Our team reviews your request and prepares a personalised travel plan or quotation based on your needs and budget.' },
  { icon: CheckCircle, step: '03', title: 'Confirm Your Arrangements', desc: 'Review the proposed plan, ask questions, and confirm your travel arrangements when you\'re satisfied.' },
  { icon: Send, step: '04', title: 'Travel with Confidence', desc: 'Receive your travel documents, tickets, and any pre-travel briefing. We remain available throughout your journey.' },
]

export default function TravelProcess() {
  return (
    <section className="py-20 bg-[#101B46]">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <SectionHeader
          eyebrow="How It Works"
          title="Your Journey, Step by Step"
          subtitle="A simple, transparent process from your first inquiry to your travel documents."
          centered
          light
        />

        {/* Desktop horizontal timeline */}
        <div className="hidden md:grid grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#08A9E0]/20 via-[#08A9E0] to-[#08A9E0]/20" />

          {steps.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center relative">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-5 relative z-10 backdrop-blur-sm">
                <Icon size={28} className="text-[#08A9E0]" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#08A9E0] text-white text-xs font-bold flex items-center justify-center">
                  {step.replace('0', '')}
                </span>
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
              <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden flex flex-col gap-0">
          {steps.map(({ icon: Icon, step, title, desc }, i) => (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-[#08A9E0]" />
                </div>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-white/10 my-2" />}
              </div>
              <div className="pb-8">
                <span className="text-[#08A9E0] text-xs font-bold tracking-widest">STEP {step}</span>
                <h3 className="font-display font-bold text-white text-lg mt-1 mb-2">{title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
