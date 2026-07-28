import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-accent-fg)] border border-transparent hover:bg-[var(--color-accent-hover)] hover:scale-[1.02] active:scale-100',
  secondary:
    'bg-[var(--color-surface-muted)] text-[var(--color-primary)] border border-[var(--color-primary)]/40 hover:border-[var(--color-primary)] hover:bg-[var(--color-border)]',
  ghost:
    'bg-transparent text-[var(--color-fg)] border border-transparent hover:bg-[var(--color-surface-muted)]',
}

const Button = ({
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--color-focus) disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
