import type { ReactNode } from 'react'
import '@/ui-template/styles/theme.css'

export interface ThemeProviderProps {
  children: ReactNode
  className?: string
}

export function ThemeProvider({ children, className = '' }: ThemeProviderProps) {
  return <div data-theme="ui-template" className={className}>{children}</div>
}
