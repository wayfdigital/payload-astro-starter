import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, type BadgeProps } from '@repo/ui'

const variants: NonNullable<BadgeProps['variant']>[] = ['default', 'success', 'warning', 'destructive']

const meta = {
  title: 'Elements/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Badge', variant: 'default' },
  argTypes: {
    variant: { control: 'select', options: variants },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}
