import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
}

const variantCSS: Record<NonNullable<CardProps['variant']>, CSSProperties> = {
  default: {
    background: 'var(--template-color-surface)',
    border: '1px solid var(--template-color-border)',
    borderRadius: 'var(--template-radius-lg)',
    boxShadow: 'var(--template-shadow)',
    padding: 'var(--template-spacing-lg)',
  },
  outlined: {
    background: 'transparent',
    border: '2px solid var(--template-color-border)',
    borderRadius: 'var(--template-radius-lg)',
    padding: 'var(--template-spacing-lg)',
  },
  elevated: {
    background: 'var(--template-color-surface)',
    border: '1px solid var(--template-color-primary)',
    borderRadius: 'var(--template-radius-lg)',
    boxShadow: 'var(--template-shadow-lg)',
    padding: 'var(--template-spacing-lg)',
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
