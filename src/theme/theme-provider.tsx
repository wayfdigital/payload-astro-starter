import type { ReactNode } from 'react'
import './styles/theme.css'

export interface ThemeProviderProps {
  children: ReactNode
  className?: string
}

export function ThemeProvider({ children, className = '' }: Readonly<ThemeProviderProps>) {
  return <div data-theme="ui" className={className}>{children}</div>
}
