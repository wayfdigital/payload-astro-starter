import type { Meta, StoryObj } from '@storybook/react-vite'
import { CmsLink, CMS_LINK_VARIANTS } from '@repo/ui'

// Spread: `argTypes.options` and `.map()` want a mutable array, the const is readonly.
const variants = [...CMS_LINK_VARIANTS]

const meta = {
  title: 'Elements/CmsLink',
  component: CmsLink,
  tags: ['autodocs'],
  args: {
    link: { href: '#', label: 'Learn more', variant: 'primary' },
    size: 'md',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof CmsLink>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map((variant) => (
        <CmsLink key={variant} {...args} link={{ href: '#', label: variant, variant }} />
      ))}
    </div>
  ),
}
