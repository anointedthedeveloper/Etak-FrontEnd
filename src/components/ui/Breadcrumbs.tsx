import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface Crumb {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: Crumb[]
  light?: boolean
}

/** Shared breadcrumb trail — used on editorial page headers (e.g. ServiceDetail). */
export default function Breadcrumbs({ items, light = false }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs ${light ? 'text-white/40' : 'text-text-muted'}`}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={11} className="shrink-0" />}
            {item.to && !isLast ? (
              <Link to={item.to} className={light ? 'hover:text-white/70 transition-colors' : 'hover:text-[#08A9E0] transition-colors'}>
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? (light ? 'text-white/70' : 'text-text-secondary font-medium') : ''} aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
