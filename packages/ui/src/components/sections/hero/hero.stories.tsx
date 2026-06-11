import type { Meta, StoryObj } from '@storybook/react-vite'
import { Hero, Button } from '@repo/ui'

const meta = {
  title: 'Sections/Hero',
  component: Hero,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    title: 'Build your website without code',
    subtitle: 'Describe what you want and watch it come together — sections, content, and styling.',
    alignment: 'center',
    variant: 'default',
    actions: (
      <>
        <Button variant="primary">Get started</Button>
        <Button variant="outline">Learn more</Button>
      </>
    ),
  },
  argTypes: {
    alignment: { control: 'inline-radio', options: ['left', 'center'] },
    variant: { control: 'inline-radio', options: ['default', 'gradient'] },
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Gradient: Story = {
  args: { variant: 'gradient' },
}

export const LeftAligned: Story = {
  args: { alignment: 'left' },
}
