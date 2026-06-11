import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '../src/theme-provider'
// Both stylesheets are required: globals.css pulls in Tailwind v4 + the :root HSL
// fallbacks, theme.css defines the [data-theme="ui"] design tokens the components read.
import '../src/styles/globals.css'
import '../src/styles/theme.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
  // Every story renders inside <div data-theme="ui"> so the CSS variables resolve.
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default preview
