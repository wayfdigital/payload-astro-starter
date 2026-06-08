import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
}

const variantCSS: Record<NonNullable<CardProps['variant']>, CSSProperties> = {
  default: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow)',
    padding: 'var(--spacing-lg)',
  },
  outlined: {
    background: 'transparent',
    border: '2px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
  },
  elevated: {
    background: 'var(--card)',
    border: '1px solid var(--primary)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: 'var(--spacing-lg)',
  },
}

export function Card({
  variant = 'default',
  className = '',
  style,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={['transition-all duration-200', className].join(' ')}
      style={{ ...variantCSS[variant], ...style }}
      {...props}
    >
      {children}
    </div>
  )
}
