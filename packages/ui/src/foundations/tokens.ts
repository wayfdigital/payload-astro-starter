/**
 * Single source of truth for the Foundations showcase. Each entry points at a CSS
 * custom property defined in src/styles/theme.css (scoped to [data-theme="ui"]).
 * To extend the showcase: add the variable to theme.css, then add a row here.
 * Nothing else needs to change — Foundations.stories.tsx renders straight from these.
 */

export interface TokenEntry {
  /** Human label shown next to the swatch. */
  name: string
  /** CSS custom property name, including the leading `--`. */
  cssVar: string
}

export const colorTokens: TokenEntry[] = [
  { name: 'primary', cssVar: '--primary' },
  { name: 'primary-hover', cssVar: '--primary-hover' },
  { name: 'primary-foreground', cssVar: '--primary-foreground' },
  { name: 'secondary', cssVar: '--secondary' },
  { name: 'secondary-hover', cssVar: '--secondary-hover' },
  { name: 'secondary-foreground', cssVar: '--secondary-foreground' },
  { name: 'background', cssVar: '--background' },
  { name: 'card', cssVar: '--card' },
  { name: 'foreground', cssVar: '--foreground' },
  { name: 'muted', cssVar: '--muted' },
  { name: 'muted-foreground', cssVar: '--muted-foreground' },
  { name: 'border', cssVar: '--border' },
  { name: 'accent', cssVar: '--accent' },
  { name: 'accent-foreground', cssVar: '--accent-foreground' },
  { name: 'destructive', cssVar: '--destructive' },
  { name: 'success', cssVar: '--success' },
  { name: 'warning', cssVar: '--warning' },
  // Status tints — the low-emphasis pairs behind <Badge>. Each solid color above
  // needs both halves here to be usable as a pill.
  { name: 'success-subtle', cssVar: '--success-subtle' },
  { name: 'success-foreground', cssVar: '--success-foreground' },
  { name: 'warning-subtle', cssVar: '--warning-subtle' },
  { name: 'warning-foreground', cssVar: '--warning-foreground' },
  { name: 'destructive-subtle', cssVar: '--destructive-subtle' },
  { name: 'destructive-subtle-foreground', cssVar: '--destructive-subtle-foreground' },
]

export const gradientTokens: TokenEntry[] = [
  { name: 'gradient-hero', cssVar: '--gradient-hero' },
  { name: 'gradient-surface', cssVar: '--gradient-surface' },
  { name: 'gradient-subtle', cssVar: '--gradient-subtle' },
]

export const fontTokens: TokenEntry[] = [
  { name: 'font-sans', cssVar: '--font-sans' },
  { name: 'font-heading', cssVar: '--font-heading' },
  { name: 'font-mono', cssVar: '--font-mono' },
]

export const spacingTokens: TokenEntry[] = [
  { name: 'spacing-xs', cssVar: '--spacing-xs' },
  { name: 'spacing-sm', cssVar: '--spacing-sm' },
  { name: 'spacing-md', cssVar: '--spacing-md' },
  { name: 'spacing-lg', cssVar: '--spacing-lg' },
  { name: 'spacing-xl', cssVar: '--spacing-xl' },
  { name: 'spacing-2xl', cssVar: '--spacing-2xl' },
  { name: 'spacing-3xl', cssVar: '--spacing-3xl' },
]

export const radiusTokens: TokenEntry[] = [
  { name: 'radius-sm', cssVar: '--radius-sm' },
  { name: 'radius', cssVar: '--radius' },
  { name: 'radius-lg', cssVar: '--radius-lg' },
  { name: 'radius-xl', cssVar: '--radius-xl' },
  { name: 'radius-full', cssVar: '--radius-full' },
]

export const shadowTokens: TokenEntry[] = [
  { name: 'shadow-sm', cssVar: '--shadow-sm' },
  { name: 'shadow', cssVar: '--shadow' },
  { name: 'shadow-md', cssVar: '--shadow-md' },
  { name: 'shadow-lg', cssVar: '--shadow-lg' },
  { name: 'shadow-glow', cssVar: '--shadow-glow' },
]
