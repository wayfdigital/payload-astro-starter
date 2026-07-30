import type { CSSProperties, ReactNode } from 'react'
import { Container } from '../../elements/container'
import { Heading } from '../../elements/heading'
import { Lightfall } from '../../elements/lightfall'
import { Text } from '../../elements/text'

export interface HeroProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  alignment?: 'left' | 'center'
  variant?: 'default' | 'gradient' | 'lightfall'
}

// `gradient` and `lightfall` both sit on dark, `--primary`-family art, so they
// share the on-primary text treatment.
const isDarkVariant = (variant: HeroProps['variant']) =>
  variant === 'gradient' || variant === 'lightfall'

export function Hero({
  title,
  subtitle,
  actions,
  alignment = 'center',
  variant = 'default',
}: HeroProps) {
  const alignClass = alignment === 'center' ? 'text-center items-center' : 'text-left items-start'
  const dark = isDarkVariant(variant)

  const sectionStyle: CSSProperties =
    variant === 'gradient'
      ? { backgroundImage: 'var(--gradient-hero)' }
      : variant === 'lightfall'
        ? { backgroundColor: 'var(--lightfall-background)' }
        : { backgroundColor: 'var(--background)' }

  // The lightfall canvas needs room to read as a scene rather than a strip, so
  // that variant alone grows to 90vh and centers its content vertically.
  const sectionSizeClass =
    variant === 'lightfall' ? 'min-h-[90vh] flex items-center py-16' : 'py-20'

  return (
    <section
      className={`relative overflow-hidden ${sectionSizeClass}`}
      style={sectionStyle}
    >
      {variant === 'gradient' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,255,255,0.15), transparent)' }}
        />
      )}
      {variant === 'lightfall' && (
        // No `pointer-events-none` here — the canvas tracks the cursor for its
        // hover-glow effect; the text/actions below still sit on top in DOM order.
        <div className="absolute inset-0">
          <Lightfall />
        </div>
      )}
      <Container size="md">
        <div className={`relative flex flex-col gap-6 ${alignClass}`}>
          <Heading
            level={1}
            className={dark ? 'tracking-tight' : ''}
            style={dark ? { color: 'var(--primary-foreground)', letterSpacing: '-0.03em' } : undefined}
          >
            {title}
          </Heading>
          {subtitle && (
            <Text
              variant="lead"
              className="max-w-2xl"
              // The gradient/lightfall art sits on `--primary`-family colors in both
              // themes, so the on-primary token is the right pair; opacity handles
              // the de-emphasis without needing a second token.
              style={dark ? { color: 'var(--primary-foreground)', opacity: 0.85 } : undefined}
            >
              {subtitle}
            </Text>
          )}
          {actions && (
            <div
              className="flex flex-wrap gap-3 pt-2"
              // `primary`/`outline` buttons read `--primary` for their fill or
              // border+text; on dark hero art that's the same purple family as
              // the background, so it washes out. Rebind it locally to the
              // high-contrast `--hero-cta-*` pair instead of touching Button globally.
              style={
                dark
                  ? ({
                      '--primary': 'var(--hero-cta-bg)',
                      '--primary-foreground': 'var(--hero-cta-foreground)',
                    } as CSSProperties)
                  : undefined
              }
            >
              {actions}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
