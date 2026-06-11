import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, type CardProps, Heading, Text } from '@repo/ui'

const variants: NonNullable<CardProps['variant']>[] = ['default', 'outlined', 'elevated']

const meta = {
  title: 'Elements/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    children: (
      <>
        <Heading level={3} className="mb-2">
          Card title
        </Heading>
        <Text variant="muted">A short description that lives inside the card body.</Text>
      </>
    ),
  },
  argTypes: {
    variant: { control: 'select', options: variants },
  },
  render: (args) => <Card {...args} style={{ width: 320 }} />,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {variants.map((variant) => (
        <Card key={variant} variant={variant} style={{ width: 240 }}>
          <Heading level={4} className="mb-2">
            {variant}
          </Heading>
          <Text variant="muted">Variant: {variant}</Text>
        </Card>
      ))}
    </div>
  ),
}
