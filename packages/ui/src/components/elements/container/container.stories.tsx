import type { Meta, StoryObj } from '@storybook/react-vite'
import { Container, type ContainerProps } from '@repo/ui'

const sizes: NonNullable<ContainerProps['size']>[] = ['sm', 'md', 'lg', 'full']

const meta = {
  title: 'Elements/Container',
  component: Container,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    size: 'lg',
    children: (
      <div
        className="py-8 text-center"
        style={{ background: 'var(--muted)', borderRadius: 'var(--radius)' }}
      >
        Container content
      </div>
    ),
  },
  argTypes: {
    size: { control: 'select', options: sizes },
    as: { control: 'select', options: ['div', 'section', 'article', 'main'] },
  },
  render: (args) => <Container {...args} />,
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 py-6">
      {sizes.map((size) => (
        <Container key={size} size={size}>
          <div
            className="py-6 text-center"
            style={{ background: 'var(--muted)', borderRadius: 'var(--radius)' }}
          >
            {size}
          </div>
        </Container>
      ))}
    </div>
  ),
}
