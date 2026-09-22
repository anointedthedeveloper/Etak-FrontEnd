import { type ReactNode } from 'react'

interface ImageSlotProps {
  src?: string
  alt: string
  className?: string
  label?: string
}

export function ImageSlot({ src, alt, className = '', label }: ImageSlotProps) {
  if (src) {
    return <img src={src} alt={alt} className={className} loading="lazy" />
  }
  return (
    <div className={`bg-gradient-to-br from-[#EAF8FD] to-[#e8e6f8] flex flex-col items-center justify-center gap-2 ${className}`}>
      <svg className="w-10 h-10 text-[#08A9E0] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {label && <span className="text-xs text-[#667085] font-medium text-center px-4">{label}</span>}
    </div>
  )
}

interface BadgeProps {
  children: ReactNode
  variant?: 'blue' | 'purple' | 'green' | 'orange' | 'gray'
}

export function Badge({ children, variant = 'blue' }: BadgeProps) {
  const variants = {
    blue: 'bg-[#EAF8FD] text-[#08A9E0]',
    purple: 'bg-[#EAF8FD] text-[#087EAF]',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    gray: 'bg-gray-100 text-[#667085]',
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    new: { label: 'New', variant: 'orange' },
    in_progress: { label: 'In Progress', variant: 'blue' },
    responded: { label: 'Responded', variant: 'green' },
    resolved: { label: 'Resolved', variant: 'green' },
    draft: { label: 'Draft', variant: 'gray' },
    submitted: { label: 'Submitted', variant: 'blue' },
    under_review: { label: 'Under Review', variant: 'orange' },
    confirmed: { label: 'Confirmed', variant: 'green' },
    completed: { label: 'Completed', variant: 'purple' },
    cancelled: { label: 'Cancelled', variant: 'gray' },
  }
  const config = map[status] ?? { label: status, variant: 'gray' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
}

export function SectionHeader({ eyebrow, title, subtitle, centered = false, light = false }: SectionHeaderProps) {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-8 sm:mb-12`}>
      {eyebrow && (
        <span className="inline-block text-[#08A9E0] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">{eyebrow}</span>
      )}
      <h2 className={`font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight ${light ? 'text-white' : 'text-[#101B46]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''} ${light ? 'text-blue-100' : 'text-[#667085]'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
