import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

/**
 * Floating WhatsApp bubble + scroll-to-top button for the public site.
 * Mounted once in the public Layout so it persists across page navigation.
 */
export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#087EAF] border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-[#08A9E0]/40 ${
          showTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <ArrowUp size={17} />
      </button>

      <a
        href="https://wa.me/2348032062242"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Etak Travels on WhatsApp"
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366]/50 animate-[pulse-ring_2.6s_ease-out_infinite]" />
        <FaWhatsapp size={24} className="relative" />
        <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#101B46] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 hidden sm:block">
          Chat with us
        </span>
      </a>
    </div>
  )
}
