import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageContent } from '@repo/ui'

const meta = {
  title: 'Sections/PageContent/Wrapper',
  component: PageContent,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    size: 'md',
    children: (
      <>
        <h2>Rich-text wrapper</h2>
        <p>
          PageContent wraps arbitrary rich-text / prose children in a width-constrained,
          prose-styled container. Drop headings, paragraphs, and lists inside.
        </p>
        <ul>
          <li>Constrained reading width</li>
          <li>Inherits theme foreground color</li>
        </ul>
      </>
    ),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof PageContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
