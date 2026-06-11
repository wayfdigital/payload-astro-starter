import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import {
  colorTokens,
  gradientTokens,
  fontTokens,
  spacingTokens,
  radiusTokens,
  shadowTokens,
  type TokenEntry,
} from './tokens'

/**
 * A reference for the design tokens defined in src/styles/theme.css. Every swatch
 * reads its value live from the CSS variable (via var(--…)), so this page always
 * reflects whatever the active theme currently defines.
 */

const labelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  color: 'var(--muted-foreground)',
}

function Section({ title, children }: Readonly<{ title: string; children: ReactNode }>) {
  return (
    <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          fontWeight: 600,
          marginBottom: 'var(--spacing-md)',
          color: 'var(--foreground)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function Swatches({ tokens, kind }: Readonly<{ tokens: TokenEntry[]; kind: 'color' | 'gradient' }>) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
      {tokens.map((t) => (
        <div key={t.cssVar} style={{ width: 140 }}>
          <div
            style={{
              height: 64,
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              ...(kind === 'gradient'
                ? { backgroundImage: `var(${t.cssVar})` }
                : { backgroundColor: `var(${t.cssVar})` }),
            }}
          />
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--foreground)' }}>{t.name}</div>
            <code style={labelStyle}>{t.cssVar}</code>
          </div>
        </div>
      ))}
    </div>
  )
}

const meta: Meta = {
  title: 'Foundations/Design Tokens',
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj

export const Colors: Story = {
  render: () => (
    <div style={{ padding: 'var(--spacing-2xl)' }}>
      <Swatches tokens={colorTokens} kind="color" />
    </div>
  ),
}

export const Gradients: Story = {
  render: () => (
    <div style={{ padding: 'var(--spacing-2xl)' }}>
      <Swatches tokens={gradientTokens} kind="gradient" />
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <div style={{ padding: 'var(--spacing-2xl)' }}>
      <Section title="Font families">
        {fontTokens.map((t) => (
          <div key={t.cssVar} style={{ marginBottom: 'var(--spacing-md)' }}>
            <code style={labelStyle}>{t.cssVar}</code>
            <p style={{ fontFamily: `var(${t.cssVar})`, fontSize: '1.5rem', color: 'var(--foreground)' }}>
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        ))}
      </Section>
      <Section title="Weights">
        {[
          { label: 'normal', weight: 'var(--font-weight-normal)' },
          { label: 'medium', weight: 'var(--font-weight-medium)' },
          { label: 'semibold', weight: 'var(--font-weight-semibold)' },
          { label: 'bold', weight: 'var(--font-weight-bold)' },
        ].map((w) => (
          <p
            key={w.label}
            style={{ fontWeight: w.weight as CSSProperties['fontWeight'], fontSize: '1.125rem', color: 'var(--foreground)' }}
          >
            {w.label} — The quick brown fox
          </p>
        ))}
      </Section>
    </div>
  ),
}

export const Spacing: Story = {
  render: () => (
    <div style={{ padding: 'var(--spacing-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      {spacingTokens.map((t) => (
        <div key={t.cssVar} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <code style={{ ...labelStyle, width: 110 }}>{t.name}</code>
          <div style={{ width: `var(${t.cssVar})`, height: 16, backgroundColor: 'var(--primary)', borderRadius: 4 }} />
        </div>
      ))}
    </div>
  ),
}

export const Radii: Story = {
  render: () => (
    <div style={{ padding: 'var(--spacing-2xl)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-lg)' }}>
      {radiusTokens.map((t) => (
        <div key={t.cssVar} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 96,
              height: 96,
              backgroundColor: 'var(--accent)',
              border: '1px solid var(--primary)',
              borderRadius: `var(${t.cssVar})`,
            }}
          />
          <code style={{ ...labelStyle, display: 'block', marginTop: 6 }}>{t.name}</code>
        </div>
      ))}
    </div>
  ),
}

export const Shadows: Story = {
  render: () => (
    <div style={{ padding: 'var(--spacing-2xl)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2xl)' }}>
      {shadowTokens.map((t) => (
        <div key={t.cssVar} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 120,
              height: 96,
              backgroundColor: 'var(--card)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: `var(${t.cssVar})`,
            }}
          />
          <code style={{ ...labelStyle, display: 'block', marginTop: 12 }}>{t.name}</code>
        </div>
      ))}
    </div>
  ),
}
