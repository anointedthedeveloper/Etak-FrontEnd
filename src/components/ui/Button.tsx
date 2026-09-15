import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer'

  const variants = {
    primary: 'bg-[#08A9E0] hover:bg-[#0798C8] text-white focus:ring-[#08A9E0] active:scale-[0.98]',
    secondary: 'bg-[#45419A] hover:bg-[#3a3788] text-white focus:ring-[#45419A] active:scale-[0.98]',
    outline: 'border-2 border-[#08A9E0] text-[#08A9E0] hover:bg-[#08A9E0] hover:text-white focus:ring-[#08A9E0] active:scale-[0.98]',
    ghost: 'text-[#172033] hover:bg-gray-100 focus:ring-gray-300',
    white: 'bg-white text-[#101B46] hover:bg-[#EAF8FD] focus:ring-white active:scale-[0.98]',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
