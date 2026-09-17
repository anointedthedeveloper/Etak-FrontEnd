import { type ButtonHTMLAttributes, type ReactNode, useRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className = '',
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current
    if (btn && !disabled && !loading) {
      const circle = document.createElement('span')
      const diameter = Math.max(btn.clientWidth, btn.clientHeight)
      const rect = btn.getBoundingClientRect()
      circle.style.cssText = `
        position: absolute;
        width: ${diameter}px;
        height: ${diameter}px;
        left: ${e.clientX - rect.left - diameter / 2}px;
        top: ${e.clientY - rect.top - diameter / 2}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 500ms ease-out forwards;
        pointer-events: none;
      `
      btn.appendChild(circle)
      setTimeout(() => circle.remove(), 550)
    }
    onClick?.(e)
  }

  const base =
    'relative overflow-hidden inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:brightness-95'

  const variants = {
    primary:   'bg-[#08A9E0] hover:bg-[#0798C8] text-white focus:ring-[#08A9E0]',
    secondary: 'bg-[#45419A] hover:bg-[#3a3788] text-white focus:ring-[#45419A]',
    outline:   'border-2 border-[#08A9E0] text-[#08A9E0] hover:bg-[#EAF8FD] focus:ring-[#08A9E0]',
    ghost:     'text-[#172033] hover:bg-gray-100 focus:ring-gray-300',
    white:     'bg-white text-[#101B46] hover:bg-gray-100 focus:ring-white',
  }

  // All sizes share the same height via py, text is consistent
  const sizes = {
    sm: 'h-9  px-4 text-sm',
    md: 'h-11 px-6 text-sm',
    lg: 'h-12 px-7 text-base',
  }

  return (
    <button
      ref={btnRef}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
