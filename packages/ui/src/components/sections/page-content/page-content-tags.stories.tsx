import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageContentTags } from '@repo/ui'

const meta = {
  title: 'Sections/PageContent/Tags',
  component: PageContentTags,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    title: 'Technologies',
    subtitle: 'The stack this starter is built on.',
    tags: [
      { id: '1', label: 'Astro' },
      { id: '2', label: 'Payload CMS' },
      { id: '3', label: 'React' },
      { id: '4', label: 'Tailwind CSS' },
      { id: '5', label: 'TypeScript' },
    ],
  },
} satisfies Meta<typeof PageContentTags>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
