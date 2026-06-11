import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageContentCards } from '@repo/ui'

const meta = {
  title: 'Sections/PageContent/Cards',
  component: PageContentCards,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    title: 'What we offer',
    subtitle: 'A short intro for the grid of cards below.',
    items: [
      { id: '1', title: 'Fast', content: 'Ship sections in minutes, not days.', linkText: 'Details', linkHref: '#' },
      { id: '2', title: 'Flexible', content: 'Every block maps to a reusable UI component.', linkText: 'Details', linkHref: '#' },
      { id: '3', title: 'Themed', content: 'One token set drives the whole site.', linkText: 'Details', linkHref: '#' },
    ],
  },
} satisfies Meta<typeof PageContentCards>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
