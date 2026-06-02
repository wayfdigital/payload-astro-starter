import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variantCSS: Record<NonNullable<ButtonProps['variant']>, CSSProperties> = {
  primary: {
    backgroundColor: 'var(--template-color-primary)',
    color: 'var(--template-color-primary-foreground)',
    boxShadow: 'var(--template-shadow-sm)',
  },
  secondary: {
    backgroundColor: 'var(--template-color-secondary)',
    color: 'var(--template-color-secondary-foreground)',
    boxShadow: 'var(--template-shadow-sm)',
  },
  outline: {
    border: '2px solid var(--template-color-primary)',
    backgroundColor: 'transparent',
    color: 'var(--template-color-primary)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--template-color-foreground)',
  },
  destructive: {
    backgroundColor: 'var(--template-color-destructive)',
    color: 'var(--template-color-destructive-foreground)',
    boxShadow: 'var(--template-shadow-sm)',
  },
}

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  style,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center font-medium',
        'rounded-lg',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:scale-[0.98]',
        'hover:opacity-90',
        sizeStyles[size],
        className,
      ].join(' ')}
      style={{
        ...variantCSS[variant],
        borderRadius: 'var(--template-radius)',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}
