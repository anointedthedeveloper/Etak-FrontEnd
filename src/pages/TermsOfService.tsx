import { Link } from 'react-router-dom'
import {
  FileCheck, MessageSquare, UserCheck, CreditCard, RefreshCw,
  FileText, ShieldAlert, Bell, Phone, Mail, ArrowRight,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../components/ui/SEO'

const sections = [
  {
    id: 'agreement',
    icon: FileCheck,
    title: 'Agreement to Terms',
    body: [
      "By accessing or using the Etak Travels & Tours Expert Limited website and services, you agree to be bound by the terms below. These terms describe how our services are provided and outline the responsibilities of both the client and our travel team.",
      'If you do not agree with any part of these terms, please discontinue use of the website and contact us directly to discuss your travel requirements.',
    ],
  },
  {
    id: 'services',
    icon: MessageSquare,
    title: 'Nature of Our Services',
    body: [
      'The information shared on this website is for general guidance and inquiry purposes. It does not constitute a binding offer, a confirmed booking, or a final travel contract.',
      'Any service request submitted through this website — flight booking, hotel reservation, tour package, visa assistance, or otherwise — is treated as an inquiry for planning and support. Final arrangements, costs, and travel documents are confirmed only after direct communication with our team and written confirmation from Etak.',
    ],
  },
  {
    id: 'responsibilities',
    icon: UserCheck,
    title: 'Client Responsibilities',
    body: [
      'You agree to provide accurate, complete and up-to-date information when submitting an inquiry, including passenger names as they appear on travel documents, contact details and travel preferences.',
      'You are responsible for reviewing all booking confirmations, itineraries, and travel documents we send you, and for notifying us promptly of any errors or discrepancies before travel.',
    ],
  },
  {
    id: 'pricing',
    icon: CreditCard,
    title: 'Pricing, Payments & Currency',
    body: [
      'Quoted fares, rates and package prices are subject to availability and can change without notice until full payment is received and a booking is confirmed in writing.',
      'Prices may be quoted in Naira or a foreign currency depending on the service and supplier; where applicable, the prevailing exchange rate at the time of payment applies. Payment terms, methods and deadlines will be communicated to you directly by our team.',
    ],
  },
  {
    id: 'cancellations',
    icon: RefreshCw,
    title: 'Cancellations, Changes & Refunds',
    body: [
      'Cancellations, date changes and refunds are governed by the fare rules and policies of the airline, hotel, tour operator or other third-party supplier involved in your booking — these vary widely and are shared with you at the time of booking.',
      'Where a refund is due, it will be processed once the corresponding refund is received from the relevant supplier, less any applicable service or administrative fees.',
    ],
  },
  {
    id: 'documents',
    icon: FileText,
    title: 'Travel Documents & Visa Requirements',
    body: [
      'We make every effort to provide accurate and helpful guidance. However, travel requirements, visa rules, airline schedules, hotel availability and government policies may change without notice.',
      'You are responsible for ensuring your passport, visa and any other required travel documents are valid and meet the entry requirements of your destination. We strongly recommend confirming the latest requirements before finalising travel plans.',
    ],
  },
  {
    id: 'liability',
    icon: ShieldAlert,
    title: 'Limitation of Liability',
    body: [
      'Etak Travels & Tours Expert Limited acts as an intermediary between you and third-party travel suppliers — airlines, hotels, tour operators, embassies and insurers. We are not liable for the acts, errors, omissions, delays or cancellations of these third parties.',
      'To the fullest extent permitted by law, our liability for any claim arising from our services is limited to the value of the service fee paid directly to Etak for that booking.',
    ],
  },
  {
    id: 'changes',
    icon: Bell,
    title: 'Changes to These Terms',
    body: [
      'We reserve the right to update these terms at any time as our services evolve. Material changes will be reflected by an updated revision date at the top of this page.',
      'Continued use of the website or our services after an update indicates your acceptance of the revised terms.',
    ],
  },
]

export default function TermsOfService() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms of service for Etak Travels & Tours Expert Limited — how our travel booking, inquiry and advisory services are provided."
        url="/terms"
      />

      {/* Header */}
      <div className="relative bg-[#0D1640] py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.08] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#08A9E0]/40 to-transparent" />
        <div className="absolute -top-24 right-[-4rem] w-80 h-80 rounded-full bg-[#08A9E0]/10 blur-3xl pointer-events-none" />
        <div className="site-gutter relative z-10 w-full text-center">
          <div className="w-14 h-14 rounded-panel bg-[#08A9E0]/15 border border-[#08A9E0]/25 flex items-center justify-center mx-auto mb-5">
            <FileCheck size={24} className="text-[#08A9E0]" />
          </div>
          <span className="inline-flex items-center gap-2 accent-text text-xs font-bold tracking-[0.18em] uppercase mb-3">
            <span className="w-5 h-px accent-gradient inline-block" /> Legal
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-blue-200/80 text-base max-w-xl mx-auto leading-relaxed">
            The terms below explain how our travel booking, inquiry and advisory services work — please read them before using our website.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-xs text-blue-300/70 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
            Last updated: 1 January 2026
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-[#F8FAFC]">
        <div className="site-gutter w-full py-10 sm:py-14">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

            {/* ── Quick nav ── */}
            <div className="lg:order-2 flex flex-col gap-4">
              <div className="card-surface p-5 lg:sticky lg:top-24">
                <p className="text-xs font-bold text-[#101B46] uppercase tracking-wide mb-3">On This Page</p>
                <ul className="flex flex-col gap-1">
                  {sections.map(({ id, title, icon: Icon }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#667085] hover:text-[#08A9E0] hover:bg-[#EAF8FD] transition-colors"
                      >
                        <Icon size={14} className="text-[#08A9E0] shrink-0" />
                        {title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact card */}
              <div className="bg-gradient-to-br from-[#101B46] to-[#0D2260] rounded-panel p-6 text-white shadow-panel">
                <h3 className="font-display font-bold text-base mb-1.5">Questions about these terms?</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-4">
                  Our team is happy to walk you through anything before you book.
                </p>
                <div className="flex flex-col gap-2">
                  <a href="tel:+2348032062242" className="flex items-center gap-2.5 text-sm text-white/80 hover:text-white transition-colors">
                    <Phone size={14} className="text-[#08A9E0] shrink-0" /> +234 803 206 2242
                  </a>
                  <a href="mailto:etaktravels15@gmail.com" className="flex items-center gap-2.5 text-sm text-white/80 hover:text-white transition-colors">
                    <Mail size={14} className="text-[#08A9E0] shrink-0" /> etaktravels15@gmail.com
                  </a>
                </div>
                <Link to="/contact" className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-semibold transition-colors">
                  Contact Us <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* ── Sections ── */}
            <div className="lg:col-span-2 lg:order-1 flex flex-col gap-5">
              {sections.map(({ id, icon: Icon, title, body }, i) => (
                <div key={id} id={id} className="card-surface p-6 sm:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-1 h-5 rounded-full bg-[#08A9E0] shrink-0" />
                    <span className="text-[10px] font-bold text-[#08A9E0] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="font-display font-bold text-[#101B46] text-lg sm:text-xl flex items-center gap-2.5">
                      {title}
                    </h2>
                    <Icon size={16} className="text-[#08A9E0]/50 ml-auto shrink-0 hidden sm:block" />
                  </div>
                  <div className="flex flex-col gap-3">
                    {body.map((p, pi) => (
                      <p key={pi} className="text-[#667085] leading-relaxed text-sm sm:text-[15px]">{p}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Related */}
              <div className="card-surface p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF8FD] flex items-center justify-center shrink-0">
                    <FaWhatsapp size={16} className="text-[#08A9E0]" />
                  </div>
                  <p className="text-sm text-[#374151]">Also see our <Link to="/privacy" className="text-[#08A9E0] font-semibold hover:underline">Privacy Policy</Link></p>
                </div>
                <a
                  href="https://wa.me/2348032062242"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#08A9E0] hover:underline shrink-0"
                >
                  Chat with us <ArrowRight size={12} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
