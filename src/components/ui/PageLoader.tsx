import { useEffect, useState } from 'react'
import { Plane } from 'lucide-react'

const MESSAGES = [
  'Packing your bags…',
  'Checking the best fares…',
  'Mapping your route…',
  'Almost ready for takeoff…',
]

export default function PageLoader() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setMsgIndex(i => (i + 1) % MESSAGES.length), 1400)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
      {/* Orbiting plane around the logo */}
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-dashed border-[#08A9E0]/30" />
        <img src="/brand/logo.png" alt="Etak Travels" className="h-12 w-12 object-contain animate-breathe" />
        <div
          className="absolute top-1/2 left-1/2 w-0 h-0 animate-orbit"
          style={{ ['--orbit-radius' as string]: '44px' }}
        >
          <Plane size={16} className="text-[#08A9E0] -translate-x-1/2 -translate-y-1/2 rotate-45" />
        </div>
      </div>

      <p key={msgIndex} className="text-[#101B46] text-sm font-semibold animate-fade-in">
        {MESSAGES[msgIndex]}
      </p>
      <p className="mt-1.5 text-[#667085] text-xs tracking-widest uppercase">Etak Travels</p>
    </div>
  )
}
