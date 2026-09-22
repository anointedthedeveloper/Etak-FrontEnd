import { type ReactNode } from 'react'
import { AlertTriangle, type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  compact?: boolean
}

/** Shared empty-state pattern: icon in a soft box + message + optional CTA. */
export function EmptyState({ icon: Icon, title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'py-10 px-4' : 'py-16 px-6'}`}>
      <div className="w-14 h-14 rounded-card bg-surface-muted border border-line flex items-center justify-center mb-4">
        <Icon size={24} className="text-gray-300" />
      </div>
      <p className="font-semibold text-text-primary mb-1">{title}</p>
      {description && <p className="text-sm text-text-muted mb-5 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}

interface LoadingStateProps {
  label?: string
  compact?: boolean
}

/** Shared loading spinner used in place of ad-hoc spinner markup. */
export function LoadingState({ label, compact = false }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${compact ? 'py-10' : 'py-16'}`}>
      <div className="h-7 w-7 rounded-full border-4 border-gray-100 border-t-[#08A9E0] animate-spin" />
      {label && <p className="text-xs text-text-muted">{label}</p>}
    </div>
  )
}

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

/** Shared inline error fallback for a failed Supabase call. */
export function ErrorState({ message = 'Something went wrong loading this data.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-card border border-red-200 bg-red-50">
      <AlertTriangle size={16} className="text-red-500 shrink-0" />
      <p className="text-sm text-red-700 flex-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-xs font-semibold text-red-700 hover:underline shrink-0">
          Retry
        </button>
      )}
    </div>
  )
}
