import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading, type HeadingProps } from '@repo/ui'

const levels: NonNullable<HeadingProps['level']>[] = [1, 2, 3, 4, 5, 6]

const meta = {
  title: 'Elements/Heading',
  component: Heading,
  tags: ['autodocs'],
  args: { level: 2, children: 'The quick brown fox' },
  argTypes: {
    level: { control: 'select', options: levels },
  },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {levels.map((level) => (
        <Heading key={level} level={level}>
          Heading level {level}
        </Heading>
      ))}
    </div>
  ),
}
