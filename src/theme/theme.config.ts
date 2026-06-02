export interface ThemeConfig {
  name: string
  displayName: string
  description: string
  version: string
  cssImport: string
  dataAttribute: string
}

export const uiTemplateConfig: ThemeConfig = {
  name: 'ui',
  displayName: 'Template Theme',
  description: 'A minimal, well-structured base theme for Zavcode — use as a starting point for new themes.',
  version: '0.0.1',
  cssImport: '@/theme/styles/theme.css',
  dataAttribute: 'ui',
}
