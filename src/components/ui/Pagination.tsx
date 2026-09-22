import { ChevronDown } from 'lucide-react'

interface LoadMoreProps {
  shown: number
  total: number
  onLoadMore: () => void
  step?: number
  itemLabel?: string
}

/** Shared "load more" control for client-side-paginated lists/tables. */
export function LoadMore({ shown, total, onLoadMore, itemLabel = 'items' }: LoadMoreProps) {
  if (shown >= total) return null
  return (
    <div className="flex flex-col items-center gap-2 py-5 border-t border-line">
      <p className="text-xs text-text-muted">
        Showing {shown} of {total} {itemLabel}
      </p>
      <button
        onClick={onLoadMore}
        className="flex items-center gap-1.5 px-4 py-2 rounded-control border border-line text-sm font-medium text-text-secondary hover:border-[#08A9E0]/40 hover:text-[#08A9E0] hover:bg-[#EAF8FD] transition-colors"
      >
        Load more <ChevronDown size={14} />
      </button>
    </div>
  )
}
