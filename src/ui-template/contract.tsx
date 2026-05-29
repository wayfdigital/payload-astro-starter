// Contract import: the starter's own internal OnePage contract.
// Type-only — erased at emit.
import type {
  AbstractContactProps,
  AbstractHeroProps,
  AbstractPageContentProps,
  OnePageComponents,
} from '@/contract'

import { uiTemplateConfig } from './theme.config'
import { Header } from './components/layout/header'
import { Footer } from './components/layout/footer'
import { Hero as NativeHero } from './components/sections/hero/hero'
import { PageContent as NativePageContent } from './components/sections/page-content/page-content'
import { Contact as NativeContact } from './components/sections/contact/contact'

export function Hero(props: AbstractHeroProps) {
  return (
    <NativeHero
      title={props.title}
      subtitle={props.subtitle}
      alignment={props.alignment}
      variant={props.variant}
      actions={props.actions}
    />
  )
}

export function PageContent(props: AbstractPageContentProps) {
  return <NativePageContent size={props.size}>{props.children}</NativePageContent>
}

export function Contact(props: AbstractContactProps) {
  return (
    <NativeContact
      title={props.title}
      address={props.address}
      phone={props.phone}
      email={props.email}
      reservationsUrl={props.reservationsUrl}
      hours={props.hours}
    />
  )
}

export const themeConfig = uiTemplateConfig

// Compile-time contract check — fails the build if a named export is missing
// or has the wrong shape for `OnePageComponents`. No runtime effect.
const _contract = { Hero, PageContent, Contact, Header, Footer, themeConfig } satisfies OnePageComponents
void _contract
