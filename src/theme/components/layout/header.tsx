import type { ReactNode } from 'react'
import { Container } from '../elements/container'

export interface HeaderProps {
  logo?: ReactNode
  navigation?: ReactNode
  actions?: ReactNode
}

export function Header({ logo, navigation, actions }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--template-color-surface) 95%, transparent)',
        borderBottom: '1px solid var(--template-color-border)',
        boxShadow: 'var(--template-shadow-sm)',
        height: 'var(--template-header-height)',
      }}
    >
      <Container>
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-6">
            {logo && (
              <div
                className="flex items-center gap-2 text-lg font-bold"
                style={{ color: 'var(--template-color-primary)' }}
              >
                {logo}
              </div>
            )}
            {navigation && (
              <nav className="hidden md:flex items-center gap-1">
                {navigation}
              </nav>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </Container>
    </header>
  )
}
