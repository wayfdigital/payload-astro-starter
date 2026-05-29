export interface ThemeConfig {
  name: string
  displayName: string
  description: string
  version: string
  cssImport: string
  dataAttribute: string
}

export const uiTemplateConfig: ThemeConfig = {
  name: 'ui-template',
  displayName: 'Template Theme',
  description: 'A minimal, well-structured base theme for Zavcode — use as a starting point for new themes.',
  version: '0.0.1',
  cssImport: '@/ui-template/styles/theme.css',
  dataAttribute: 'ui-template',
}
