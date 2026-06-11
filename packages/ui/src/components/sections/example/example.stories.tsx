import type { Meta, StoryObj } from '@storybook/react-vite'
import { Example, Button } from '@repo/ui'

const meta = {
  title: 'Sections/Example',
  component: Example,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    title: 'A titled card section',
    description: 'An optional description that explains what this section is about.',
    action: <Button variant="primary">Call to action</Button>,
  },
} satisfies Meta<typeof Example>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TitleOnly: Story = {
  args: { description: undefined, action: undefined },
}
