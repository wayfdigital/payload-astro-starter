export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  version: string;
  cssImport: string;
  dataAttribute: string;
}

export const defaultTheme: ThemeConfig = {
  name: "ui",
  displayName: "WAYF UI",
  description: "WAYF editorial system with a restrained dark mode.",
  version: "0.1.0",
  cssImport: "@repo/ui/styles/theme.css",
  dataAttribute: "ui",
};

/** @deprecated Use defaultTheme */
export const uiTemplateConfig = defaultTheme;
