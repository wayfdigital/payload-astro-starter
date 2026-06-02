import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
}

const levelStyles: Record<NonNullable<HeadingProps['level']>, string> = {
  1: 'text-4xl font-bold tracking-tight',
  2: 'text-3xl font-semibold tracking-tight',
  3: 'text-2xl font-semibold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-medium',
  6: 'text-base font-medium',
}

export function Heading({
  level = 2,
  className = '',
  style,
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const
  return (
    <Tag
      className={[levelStyles[level], className].join(' ')}
      style={{ color: 'var(--template-color-foreground)', ...style } as CSSProperties}
      {...props}
    >
      {children}
    </Tag>
  )
}
