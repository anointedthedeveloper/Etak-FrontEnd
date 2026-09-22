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
  const [slide, setSlide] = useState({ current: 0, previous: 0, activeLayer: 0 })

  useEffect(() => {
    images.forEach(({ src }) => {
      const image = new Image()
      image.src = src
    })
  }, [images])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setSlide(({ current, activeLayer }) => ({
        previous: current,
        current: (current + 1) % images.length,
        activeLayer: activeLayer === 0 ? 1 : 0,
      }))
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {[0, 1].map(layer => {
        const isActive = layer === slide.activeLayer
        const imageIndex = isActive ? slide.current : slide.previous
        const image = images[imageIndex]

        if (!image) return null

        return (
          <img
            key={layer}
            src={image.src}
            alt={image.alt}
            className={`absolute inset-0 w-full h-full object-cover will-change-[opacity] ${isActive ? 'opacity-100' : 'opacity-0'} ${kenBurns ? 'scale-110' : ''}`}
            style={{
              transition: 'opacity 1800ms cubic-bezier(0.45, 0, 0.15, 1)',
            }}
          />
        )
      })}
    </div>
  )
}
