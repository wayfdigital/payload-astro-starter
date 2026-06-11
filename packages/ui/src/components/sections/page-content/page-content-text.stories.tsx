import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageContentText, Button } from '@repo/ui'

const meta = {
  title: 'Sections/PageContent/Text',
  component: PageContentText,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    title: 'About us',
    subtitle: 'A lead paragraph that introduces the section and sets the tone.',
    content: 'Body copy goes here. It can run for a few sentences to describe the topic in detail.',
    action: <Button variant="primary">Read more</Button>,
  },
} satisfies Meta<typeof PageContentText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
