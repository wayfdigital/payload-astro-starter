import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  children: ReactNode
}

const variantCSS: Record<NonNullable<BadgeProps['variant']>, CSSProperties> = {
  default: {
    background: 'var(--accent)',
    color: 'var(--accent-foreground)',
  },
  success: {
    background: '#dcfce7',
    color: '#15803d',
  },
  warning: {
    background: '#fef3c7',
    color: '#b45309',
  },
  destructive: {
    background: '#fee2e2',
    color: '#b91c1c',
  },
}

export function Badge({
  variant = 'default',
  className = '',
  style,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={['inline-flex items-center text-xs font-medium', className].join(' ')}
      style={{
        padding: '0.125rem 0.625rem',
        borderRadius: 'var(--radius-full, 9999px)',
        ...variantCSS[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
