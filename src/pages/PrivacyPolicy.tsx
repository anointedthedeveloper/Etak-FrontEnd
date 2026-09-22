import { Link } from 'react-router-dom'
import {
  ShieldCheck, ClipboardList, Settings2, Share2, Lock,
  Cookie, UserCheck, ExternalLink, Bell, Phone, Mail, ArrowRight,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../components/ui/SEO'

const sections = [
  {
    id: 'collection',
    icon: ClipboardList,
    title: 'Information We Collect',
    body: [
      'When you submit an inquiry, create an account, or contact us, we may collect information such as your name, email address, phone number, travel dates, destination preferences and any service requirements you share with us.',
      'We also automatically collect limited technical information — such as browser type and general usage patterns — to help us keep the website secure and working correctly.',
    ],
  },
  {
    id: 'usage',
    icon: Settings2,
    title: 'How We Use Your Information',
    body: [
      'We use personal data only to respond to travel requests, manage customer communications, process bookings, and provide the services you ask us to support.',
      'We may also use your contact details to send booking confirmations, follow up on an open inquiry, or — where you have opted in — share relevant travel offers and updates.',
    ],
  },
  {
    id: 'sharing',
    icon: Share2,
    title: 'How We Share Information',
    body: [
      'We do not sell personal information to third parties. Information may be shared only with trusted internal teams or with service providers — airlines, hotels, tour operators, insurers, visa processors — strictly required to deliver a requested travel service or respond to an inquiry.',
      'We may also disclose information where required by law, regulation, or a valid legal process.',
    ],
  },
  {
    id: 'security',
    icon: Lock,
    title: 'Data Security',
    body: [
      'We keep reasonable technical and organisational safeguards in place to protect personal data from unauthorised access, misuse, alteration or disclosure.',
      'While no online system is completely risk-free, access to client information is restricted to team members who need it to carry out your request.',
    ],
  },
  {
    id: 'cookies',
    icon: Cookie,
    title: 'Cookies & Website Data',
    body: [
      'Our website may use cookies and similar technologies to remember your preferences, understand how visitors use the site, and improve performance over time.',
      'You can control or disable cookies through your browser settings; some parts of the website may not function as intended if cookies are turned off.',
    ],
  },
  {
    id: 'rights',
    icon: UserCheck,
    title: 'Your Rights & Choices',
    body: [
      'You may contact us at any time to ask for a copy of the personal information we hold about you, to request corrections, or to ask that we delete information that is no longer needed to provide our services.',
      'You may also opt out of promotional communications at any time by contacting our team directly.',
    ],
  },
  {
    id: 'third-party',
    icon: ExternalLink,
    title: 'Third-Party Links',
    body: [
      'Our website may contain links to third-party sites, such as airline, hotel or payment partners. We are not responsible for the privacy practices or content of those external sites, and we encourage you to review their own policies.',
    ],
  },
  {
    id: 'changes',
    icon: Bell,
    title: 'Changes to This Policy',
    body: [
      'We may update this privacy policy from time to time to reflect changes in our practices or for legal and regulatory reasons. Material changes will be reflected by an updated revision date at the top of this page.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="How Etak Travels & Tours Expert Limited collects, uses and protects personal information shared through our website and travel services."
        url="/privacy"
      />

      {/* Header */}
      <div className="relative bg-[#0D1640] py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.08] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#08A9E0]/40 to-transparent" />
        <div className="absolute -top-24 left-[-4rem] w-80 h-80 rounded-full bg-[#08A9E0]/10 blur-3xl pointer-events-none" />
        <div className="site-gutter relative z-10 w-full text-center">
          <div className="w-14 h-14 rounded-panel bg-[#08A9E0]/15 border border-[#08A9E0]/25 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={24} className="text-[#08A9E0]" />
          </div>
          <span className="inline-flex items-center gap-2 accent-text text-xs font-bold tracking-[0.18em] uppercase mb-3">
            <span className="w-5 h-px accent-gradient inline-block" /> Legal
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-blue-200/80 text-base max-w-xl mx-auto leading-relaxed">
            Your information is treated with care. Here's how we collect, use and protect it across our website and services.
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
                <h3 className="font-display font-bold text-base mb-1.5">Questions about your data?</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-4">
                  Reach out any time to review, update or remove your information.
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
                  <p className="text-sm text-[#374151]">Also see our <Link to="/terms" className="text-[#08A9E0] font-semibold hover:underline">Terms of Service</Link></p>
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
