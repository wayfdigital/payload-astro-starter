import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '@repo/ui'

function SwitchDemo() {
  const [checked, setChecked] = useState(false)
  return <Switch checked={checked} onChange={setChecked} label="Toggle" />
}

const meta = {
  title: 'Elements/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { checked: false, onChange: () => {} },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => <SwitchDemo />,
}
