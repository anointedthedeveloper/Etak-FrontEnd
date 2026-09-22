import { useEffect, useState } from 'react'

export interface SlideImage {
  src: string
  alt: string
}

interface Props {
  images: SlideImage[]
  interval?: number
  kenBurns?: boolean
  className?: string
}

/**
 * Ambient, autoplaying crossfade background — no controls, no captions.
 * Meant to sit behind real content (a hero, an auth panel) via absolute
 * positioning from the parent; this component only fills its container.
 */
export default function ImageSlideshow({ images, interval = 6000, kenBurns = true, className = '' }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => setIndex(i => (i + 1) % images.length), interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {images.map((img, i) => {
        const isActive = i === index
        return (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${kenBurns ? (isActive ? 'scale-110' : 'scale-100') : ''}`}
            style={{
              transition: `opacity 1400ms ease-in-out${kenBurns ? `, transform ${interval + 1500}ms ease-out` : ''}`,
            }}
          />
        )
      })}
    </div>
  )
}
