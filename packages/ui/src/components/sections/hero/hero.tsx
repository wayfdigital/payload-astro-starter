import type { CSSProperties, ReactNode } from 'react'
import { Container } from '../../elements/container'
import { FlickeringGrid } from '../../elements/flickering-grid'
import { Heading } from '../../elements/heading'
import { Lightfall } from '../../elements/lightfall'
import { Text } from '../../elements/text'

export interface HeroProps {
  title: string
  subtitle?: string
  /** Small label above the title — a kicker, not a heading. */
  eyebrow?: string
  actions?: ReactNode
  /** Extra content rendered below the actions, inside the hero's container. */
  children?: ReactNode
  alignment?: 'left' | 'center'
  variant?: 'default' | 'gradient' | 'lightfall' | 'flickerGrid'
}

// `gradient`, `lightfall` and `flickerGrid` all sit on dark art, so they share
// the on-primary text treatment.
const isDarkVariant = (variant: HeroProps['variant']) =>
  variant === 'gradient' || variant === 'lightfall' || variant === 'flickerGrid'

export function Hero({
  title,
  subtitle,
  eyebrow,
  actions,
  children,
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
        : variant === 'flickerGrid'
          ? { backgroundColor: 'var(--flicker-background)' }
          : { backgroundColor: 'var(--background)' }

  // The full-canvas variants need room to read as a scene rather than a strip, so
  // they center their content vertically and claim the viewport. The flicker grid
  // takes the whole of it — at 90vh a sliver of the next section shows under the
  // art on tall screens, which reads as a mistake rather than a hint to scroll.
  const sectionSizeClass =
    variant === 'flickerGrid'
      ? 'min-h-screen flex items-center py-16'
      : variant === 'lightfall'
        ? 'min-h-[90vh] flex items-center py-16'
        : 'py-20'

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
      {variant === 'flickerGrid' && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            <FlickeringGrid squareSize={4} gridGap={6} flickerChance={0.12} maxOpacity={0.22} />
          </div>
          {/* Vignette: the grid is uniform edge to edge, so without this the copy
              competes with squares directly behind it. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, var(--flicker-background) 15%, transparent 75%)',
            }}
          />
        </>
      )}
      <Container size="md">
        <div className={`relative flex flex-col gap-6 ${alignClass}`}>
          {eyebrow && (
            <Text
              variant="small"
              className="font-medium uppercase tracking-[0.2em]"
              // On the flicker grid the brand magenta is the accent that ties the
              // kicker to the art behind it; the purple variants have no such
              // accent, so they lean on the on-primary pair instead.
              style={
                variant === 'flickerGrid'
                  ? { color: 'var(--flicker-color)' }
                  : dark
                    ? { color: 'var(--primary-foreground)', opacity: 0.7 }
                    : { color: 'var(--primary)' }
              }
            >
              {eyebrow}
            </Text>
          )}
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
          {children && <div className="w-full text-left">{children}</div>}
        </div>
      </Container>
    </section>
  )
}
