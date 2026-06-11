import type { Meta, StoryObj } from '@storybook/react-vite'
import { Footer } from '@repo/ui'

const meta = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    copyright: `© ${'2024'} Acme, Inc. All rights reserved.`,
  },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithContent: Story = {
  args: {
    children: (
      <nav className="flex flex-wrap gap-6 text-sm">
        <a href="#">About</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
      </nav>
    ),
  },
}
