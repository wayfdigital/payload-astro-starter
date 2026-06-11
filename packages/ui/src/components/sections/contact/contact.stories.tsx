import type { Meta, StoryObj } from '@storybook/react-vite'
import { Contact } from '@repo/ui'

const meta = {
  title: 'Sections/Contact',
  component: Contact,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    title: 'Contact',
    address: '123 Market Street, Kraków, Poland',
    phone: '+48 123 456 789',
    email: 'hello@example.com',
    reservationsUrl: 'https://example.com/book',
    hours: [
      { days: 'Mon–Fri', hours: '9:00 – 18:00' },
      { days: 'Saturday', hours: '10:00 – 14:00' },
      { days: 'Sunday', hours: 'Closed' },
    ],
  },
} satisfies Meta<typeof Contact>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Minimal: Story = {
  args: { reservationsUrl: undefined, hours: undefined },
}
