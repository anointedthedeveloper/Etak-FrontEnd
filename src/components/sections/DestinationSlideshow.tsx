import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react'
import { destinations } from '../../data/destinations'

const SLIDE_IDS = ['dubai', 'istanbul', 'london', 'paris', 'new-york', 'nairobi']
const slides = SLIDE_IDS
  .map(id => destinations.find(d => d.id === id))
  .filter((d): d is (typeof destinations)[number] => !!d)

const AUTOPLAY_MS = 5500

export default function DestinationSlideshow() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(0)

  const go = useCallback((i: number) => setIndex(((i % slides.length) + slides.length) % slides.length), [])
  const next = useCallback(() => go(index + 1), [index, go])
  const prev = useCallback(() => go(index - 1), [index, go])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => setIndex(i => (i + 1) % slides.length), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused])

  const active = slides[index]

  return (
    <section
      className="relative h-[440px] sm:h-[500px] lg:h-[580px] xl:h-[640px] overflow-hidden bg-[#0D1640] group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; setPaused(true) }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (dx > 50) prev()
        else if (dx < -50) next()
        setPaused(false)
      }}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Popular destinations"
    >
      {/* Slides */}
      {slides.map((d, i) => (
        <div
          key={d.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          aria-hidden={i !== index}
        >
          <img
            src={d.image}
            alt={d.name}
            className={`absolute inset-0 w-full h-full object-cover transition-transform ease-out ${i === index ? 'scale-110 duration-[6500ms]' : 'scale-100 duration-0'}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1640]/95 via-[#0D1640]/45 to-[#0D1640]/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1640]/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
        <div className="site-gutter w-full pb-10 sm:pb-14">
          <span className="inline-flex items-center gap-2 text-[#08A9E0] text-xs font-bold tracking-[0.18em] uppercase mb-3 animate-fade-in">
            <span className="w-5 h-px bg-[#08A9E0]" /> Popular Escapes
          </span>
          <div key={active.id} className="animate-fade-up max-w-xl pointer-events-auto">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {active.name}
              <span className="text-sm sm:text-base font-normal text-blue-200/70 flex items-center gap-1">
                <MapPin size={13} />{active.country}
              </span>
            </h2>
            <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed mb-5 max-w-md">{active.tagline}</p>
            <Link to={`/destinations#${active.id}`}>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-bold transition-all shadow-lg shadow-[#08A9E0]/25 hover:shadow-xl hover:-translate-y-0.5">
                Explore {active.name} <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows — desktop */}
      <button
        onClick={prev}
        aria-label="Previous destination"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Next destination"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute top-5 right-4 sm:right-8 z-20 flex items-center gap-1.5">
        {slides.map((d, i) => (
          <button
            key={d.id}
            onClick={() => go(i)}
            aria-label={`Go to ${d.name}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === index ? 'w-7 bg-[#08A9E0]' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </section>
  )
}
