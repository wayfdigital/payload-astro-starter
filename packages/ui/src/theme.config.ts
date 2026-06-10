export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  version: string;
  cssImport: string;
  dataAttribute: string;
}

export const defaultTheme: ThemeConfig = {
  name: 'ui',
  displayName: 'wayf UI',
  description: 'Default design system theme for wayf projects.',
  version: '0.0.1',
  cssImport: '@repo/ui/styles/theme.css',
  dataAttribute: 'ui',
};

/** @deprecated Use defaultTheme */
export const uiTemplateConfig = defaultTheme;
