import { useEffect, useRef, useState } from 'react'

interface PageHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
  image: string
  centered?: boolean
  children?: React.ReactNode
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  image,
  centered = false,
  children,
}: PageHeaderProps) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <div className="relative bg-[#0D1640] pb-14 sm:pb-20 overflow-hidden">

      {/* Background photo — clearly visible, slow zoom on load */}
      <img
        ref={imgRef}
        src={image}
        alt=""
        aria-hidden="true"
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[3000ms] ease-out"
        style={{
          opacity: loaded ? 0.45 : 0,
          transform: loaded ? 'scale(1)' : 'scale(1.06)',
          transition: 'opacity 1s ease, transform 3s ease',
        }}
      />

      {/* Clean dark overlay — no blobs, no patterns */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D1640]/95 via-[#0D1640]/80 to-[#0D1640]/60" />

      {/* Single left-side accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#08A9E0] via-[#0798C8] to-transparent ${centered ? 'hidden' : 'block'}`} />

      {/* Bottom border line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#08A9E0]/50 via-[#0798C8]/40 to-transparent" />

      {/* Content */}
      <div className={`site-gutter relative z-10 w-full ${centered ? 'text-center' : ''}`}>
        <div className={centered ? 'max-w-3xl mx-auto' : 'max-w-2xl'}>

          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 accent-text text-xs font-bold tracking-[0.18em] uppercase mb-4 animate-fade-in">
            <span className="w-5 h-px accent-gradient inline-block" />
            {eyebrow}
          </span>

          <h1
            className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 animate-fade-up leading-tight"
            style={{ animationDelay: '0.1s' }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="text-blue-200/80 text-base sm:text-lg leading-relaxed animate-fade-up"
              style={{ animationDelay: '0.22s' }}
            >
              {subtitle}
            </p>
          )}

          {children && (
            <div className="mt-6 animate-fade-up" style={{ animationDelay: '0.32s' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
