// Theme config
export { uiTemplateConfig, type ThemeConfig } from './theme.config'

// Elements
export {
  Badge,
  type BadgeProps,
  Button,
  type ButtonProps,
  Card,
  type CardProps,
  Container,
  type ContainerProps,
  Heading,
  type HeadingProps,
  Text,
  type TextProps,
} from './components/elements'

// Layout (satisfies AbstractHeaderProps / AbstractFooterProps directly)
export { Header, type HeaderProps, Footer, type FooterProps } from './components/layout'

// Native section components (raw theme-specific prop shape)
export {
  Hero as NativeHero,
  type HeroProps,
  PageContent as NativePageContent,
  type PageContentProps,
  Contact as NativeContact,
  type ContactProps,
} from './components/sections'

// OnePage contract exports: Hero, PageContent, Contact (abstract-shape wrappers) + themeConfig
export { Hero, PageContent, Contact, themeConfig } from './contract'
