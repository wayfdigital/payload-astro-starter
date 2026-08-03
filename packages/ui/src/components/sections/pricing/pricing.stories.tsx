import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pricing } from '@repo/ui'

const meta = {
  title: 'Sections/Pricing',
  component: Pricing,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    title: 'Simple, transparent pricing',
    subtitle: 'Pick the plan that fits your team. Switch or cancel anytime.',
    yearlyDiscountLabel: 'SAVE 41%',
    defaultBilling: 'yearly',
    plans: [
      {
        name: 'Starter',
        priceMonthly: 20,
        priceYearly: 12,
        seats: 'for 1 user',
        description: 'To start creating content',
        features: ['No watermark', 'Up to 5 pages', 'Community support'],
        ctaLabel: 'Start now',
        addOn: {
          name: 'Priority reviews',
          price: '+$12/month',
          description: 'Get feedback on new pages within one business day.',
        },
      },
      {
        name: 'Pro',
        priceMonthly: 49,
        priceYearly: 29,
        seats: 'up to 3 users',
        description: 'To make pro-level pages with AI',
        inheritsFrom: 'Everything in Starter',
        features: ['Unlimited pages', 'Priority support', 'Custom domains'],
        ctaLabel: 'Start now',
        highlighted: true,
        addOn: {
          name: 'Priority reviews',
          price: '+$12/month',
          description: 'Get feedback on new pages within one business day.',
        },
      },
      {
        name: 'Business',
        priceMonthly: 89,
        priceYearly: 53,
        seats: 'unlimited users',
        description: 'To scale your web presence',
        inheritsFrom: 'Everything in Pro',
        features: ['Dedicated support', 'SSO & audit logs'],
        ctaLabel: 'Start now',
        addOn: {
          name: 'Priority reviews',
          price: '+$12/month',
          description: 'Get feedback on new pages within one business day.',
        },
      },
    ],
  },
} satisfies Meta<typeof Pricing>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MonthlyBilling: Story = {
  args: { defaultBilling: 'monthly' },
}

export const NoAddOns: Story = {
  args: {
    plans: [
      {
        name: 'Starter',
        priceMonthly: 20,
        priceYearly: 12,
        features: ['1 website', 'Up to 5 pages', 'Community support'],
        ctaLabel: 'Get started',
      },
      {
        name: 'Pro',
        priceMonthly: 49,
        priceYearly: 29,
        features: ['5 websites', 'Unlimited pages', 'Priority support'],
        ctaLabel: 'Get started',
        highlighted: true,
      },
    ],
  },
}
