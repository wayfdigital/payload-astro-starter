import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text, type TextProps } from '@repo/ui'

const variants: NonNullable<TextProps['variant']>[] = ['body', 'lead', 'small', 'muted']

const meta = {
  title: 'Elements/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    variant: 'body',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
  argTypes: {
    variant: { control: 'select', options: variants },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-3">
      {variants.map((variant) => (
        <Text key={variant} variant={variant}>
          <strong>{variant}:</strong> The quick brown fox jumps over the lazy dog.
        </Text>
      ))}
    </div>
  ),
}
