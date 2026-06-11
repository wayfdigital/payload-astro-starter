import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, type ButtonVariant, type ButtonSize } from '@repo/ui'

const variants: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'destructive']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

const meta = {
  title: 'Elements/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          Size {size}
        </Button>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
