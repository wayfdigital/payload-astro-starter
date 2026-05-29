import type { ComponentType, ReactNode } from 'react'
import type { ThemeConfig } from '@/ui-template/theme.config'
import type { HeaderProps, FooterProps } from '@/ui-template/components/layout'

/**
 * OnePage theme contract — the stable, theme-agnostic shape that any theme
 * (e.g. `@/ui-template`) must implement. Themes provide concrete components
 * built against these abstract prop shapes so they remain swappable.
 */

export interface AbstractHeroProps {
  title: string
  subtitle?: string
  alignment?: 'left' | 'center'
  variant?: 'default' | 'gradient'
  actions?: ReactNode
}

export interface AbstractPageContentProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export interface AbstractContactProps {
  title?: string
  address?: ReactNode
  phone?: string
  email?: string
  reservationsUrl?: string
  hours?: ReadonlyArray<{ days: string; hours: string }>
}

export interface OnePageComponents {
  Hero: ComponentType<AbstractHeroProps>
  PageContent: ComponentType<AbstractPageContentProps>
  Contact: ComponentType<AbstractContactProps>
  Header: ComponentType<HeaderProps>
  Footer: ComponentType<FooterProps>
  themeConfig: ThemeConfig
}
