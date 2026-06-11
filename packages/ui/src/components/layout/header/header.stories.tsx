import type { Meta, StoryObj } from '@storybook/react-vite'
import { Header, Button } from '@repo/ui'

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    logo: 'Acme',
    navigation: (
      <>
        <a href="#" className="px-3 py-2 text-sm font-medium">
          Home
        </a>
        <a href="#" className="px-3 py-2 text-sm font-medium">
          Features
        </a>
        <a href="#" className="px-3 py-2 text-sm font-medium">
          Pricing
        </a>
      </>
    ),
    actions: (
      <Button size="sm" variant="primary">
        Sign up
      </Button>
    ),
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LogoOnly: Story = {
  args: { navigation: undefined, actions: undefined },
}
