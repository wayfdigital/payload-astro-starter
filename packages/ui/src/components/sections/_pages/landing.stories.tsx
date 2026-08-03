import type { Meta, StoryObj } from '@storybook/react-vite'
import { Hero, Pricing, Button } from '@repo/ui'

// Static props only — this file must never import @repo/payload-types.
const meta = {
  title: 'Pages/Landing',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Landing: Story = {
  render: () => (
    <>
      <Hero
        title="Build your website without code"
        subtitle="Describe what you want and watch it come together."
        alignment="center"
        variant="gradient"
        actions={
          <>
            <Button variant="primary">Get started</Button>
            <Button variant="outline">Learn more</Button>
          </>
        }
      />
      <Pricing
        title="Simple, transparent pricing"
        subtitle="Pick the plan that fits your team. Switch or cancel anytime."
        yearlyDiscountLabel="SAVE 41%"
        defaultBilling="yearly"
        plans={[
          {
            name: 'Starter',
            priceMonthly: 20,
            priceYearly: 12,
            seats: 'for 1 user',
            description: 'For small sites getting off the ground.',
            features: ['1 website', 'Up to 5 pages', 'Community support'],
            ctaLabel: 'Get started',
          },
          {
            name: 'Pro',
            priceMonthly: 49,
            priceYearly: 29,
            seats: 'up to 3 users',
            description: 'For growing teams that need more room.',
            inheritsFrom: 'Everything in Starter',
            features: ['Unlimited pages', 'Priority support', 'Custom domains'],
            ctaLabel: 'Get started',
            highlighted: true,
          },
          {
            name: 'Enterprise',
            priceMonthly: 149,
            priceYearly: 89,
            seats: 'unlimited users',
            description: 'For organizations with advanced needs.',
            inheritsFrom: 'Everything in Pro',
            features: ['Dedicated support', 'SSO & audit logs'],
            ctaLabel: 'Contact us',
          },
        ]}
      />
    </>
  ),
}
