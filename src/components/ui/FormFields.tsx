import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

interface SelectProps {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  placeholder?: string
  name?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

const inputBase = 'w-full px-4 py-3 rounded-control border bg-white text-[#172033] placeholder-[#667085] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#08A9E0] focus:border-transparent text-sm'
const inputNormal = 'border-gray-200 hover:border-gray-300'
const inputError = 'border-red-400 focus:ring-red-400'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#172033]">{label}{props.required && <span className="text-red-500 ml-1">*</span>}</label>}
      <input ref={ref} className={`${inputBase} ${error ? inputError : inputNormal} ${className}`} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#667085]">{hint}</p>}
    </div>
  )
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#172033]">{label}{props.required && <span className="text-red-500 ml-1">*</span>}</label>}
      <textarea ref={ref} className={`${inputBase} ${error ? inputError : inputNormal} resize-none ${className}`} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#667085]">{hint}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'

export function Select({ label, error, hint, options, value, onChange, placeholder, name, required, disabled, className = '' }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#172033]">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${inputBase} ${error ? inputError : inputNormal} ${className} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667085' d='M6 8L1 3h10z'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_1rem_center]`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#667085]">{hint}</p>}
    </div>
  )
}
