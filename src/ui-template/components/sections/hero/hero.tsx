import type { CSSProperties, ReactNode } from 'react'
import { Container } from '../../elements/container'
import { Heading } from '../../elements/heading'
import { Text } from '../../elements/text'

export interface HeroProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  alignment?: 'left' | 'center'
  variant?: 'default' | 'gradient'
}

export function Hero({
  title,
  subtitle,
  actions,
  alignment = 'center',
  variant = 'default',
}: HeroProps) {
  const alignClass = alignment === 'center' ? 'text-center items-center' : 'text-left items-start'

  const sectionStyle: CSSProperties =
    variant === 'gradient'
      ? { backgroundImage: 'var(--template-gradient-hero)' }
      : { backgroundColor: 'var(--template-color-background)' }

  return (
    <section
      className="relative overflow-hidden py-20"
      style={sectionStyle}
    >
      {variant === 'gradient' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,255,255,0.15), transparent)' }}
        />
      )}
      <Container size="md">
        <div className={`relative flex flex-col gap-6 ${alignClass}`}>
          <Heading
            level={1}
            className={variant === 'gradient' ? 'tracking-tight' : ''}
            style={variant === 'gradient' ? { color: '#ffffff', letterSpacing: '-0.03em' } : undefined}
          >
            {title}
          </Heading>
          {subtitle && (
            <Text
              variant="lead"
              className="max-w-2xl"
              style={variant === 'gradient' ? { color: 'rgba(255,255,255,0.85)' } : undefined}
            >
              {subtitle}
            </Text>
          )}
          {actions && (
            <div className="flex flex-wrap gap-3 pt-2">
              {actions}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
