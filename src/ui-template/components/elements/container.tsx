import type { HTMLAttributes, ReactNode } from 'react'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'main'
  size?: 'sm' | 'md' | 'lg' | 'full'
  children: ReactNode
}

const sizeStyles: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-[var(--template-max-width)]',
  full: 'max-w-full',
}

export function Container({
  as: Tag = 'div',
  size = 'lg',
  className = '',
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={[
        'mx-auto w-full px-[var(--template-spacing-md)]',
        sizeStyles[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Tag>
  )
}
