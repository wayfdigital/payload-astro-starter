import { useState } from 'react'
import { Badge } from '../../elements/badge'
import { Button } from '../../elements/button'
import { Card } from '../../elements/card'
import { Container } from '../../elements/container'
import { Heading } from '../../elements/heading'
import { Switch } from '../../elements/switch'
import { Text } from '../../elements/text'

export interface PricingAddOn {
  name: string
  price: string
  description: string
}

export interface PricingPlan {
  id?: string
  name: string
  /** Price per month when billed monthly. */
  priceMonthly: number
  /** Monthly-equivalent price when billed yearly. */
  priceYearly: number
  seats?: string
  description?: string
  /** Rendered as the first list row with a distinct "inherits" icon, e.g. "Everything in Starter". */
  inheritsFrom?: string
  features: string[]
  ctaLabel: string
  highlighted?: boolean
  addOn?: PricingAddOn
}

export interface PricingProps {
  title?: string
  subtitle?: string
  plans: PricingPlan[]
  currency?: string
  /** Shown next to the billing toggle, e.g. "SAVE 41%". */
  yearlyDiscountLabel?: string
  defaultBilling?: 'monthly' | 'yearly'
}

export function Pricing({
  title,
  subtitle,
  plans,
  currency = '$',
  yearlyDiscountLabel,
  defaultBilling = 'yearly',
}: PricingProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>(defaultBilling)
  // ponytail: add-on toggles are visual state only, no running total — add price
  // aggregation once a real checkout flow needs it.
  const [addOns, setAddOns] = useState<Record<string, boolean>>({})

  return (
    <section className="relative overflow-hidden py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'var(--gradient-subtle)', opacity: 0.5 }}
      />
      <Container size="md" className="relative">
        {title && (
          <Heading level={2} className="mb-4 text-center">
            {title}
          </Heading>
        )}
        {subtitle && (
          <Text variant="lead" className="mx-auto mb-8 max-w-2xl text-center">
            {subtitle}
          </Text>
        )}

        <div className="mb-10 flex items-center justify-center gap-3">
          <Text
            variant="small"
            style={{ color: billing === 'monthly' ? 'var(--foreground)' : 'var(--muted-foreground)' }}
            className="font-medium"
          >
            Monthly
          </Text>
          <Switch
            checked={billing === 'yearly'}
            onChange={(checked) => setBilling(checked ? 'yearly' : 'monthly')}
            label="Toggle yearly billing"
          />
          <Text
            variant="small"
            style={{ color: billing === 'yearly' ? 'var(--foreground)' : 'var(--muted-foreground)' }}
            className="font-medium"
          >
            Yearly
          </Text>
          {yearlyDiscountLabel && billing === 'yearly' && (
            <Badge variant="success">{yearlyDiscountLabel}</Badge>
          )}
        </div>

        <div className="grid items-start gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const price = billing === 'yearly' ? plan.priceYearly : plan.priceMonthly
            const yearlySavings = (plan.priceMonthly - plan.priceYearly) * 12
            const addOnOn = plan.addOn ? Boolean(addOns[plan.id ?? plan.name]) : false

            return (
              <div key={plan.id ?? plan.name} className="group relative">
                {plan.highlighted && (
                  <div
                    className="pointer-events-none absolute -inset-3 -z-10 rounded-[var(--radius-xl)] blur-2xl opacity-40 transition-opacity duration-300 group-hover:opacity-70"
                    style={{ backgroundImage: 'var(--gradient-hero)' }}
                    aria-hidden
                  />
                )}
                <Card
                  variant={plan.highlighted ? 'elevated' : 'default'}
                  className={[
                    'h-full overflow-hidden transition-transform duration-300 ease-out',
                    'group-hover:-translate-y-1.5',
                    plan.highlighted ? 'md:-my-4' : '',
                  ].join(' ')}
                  style={{
                    padding: 0,
                    boxShadow: plan.highlighted ? 'var(--shadow-glow)' : undefined,
                  }}
                >
                  {plan.highlighted && (
                    <div
                      className="py-2 text-center text-xs font-semibold uppercase tracking-wide"
                      style={{ backgroundImage: 'var(--gradient-hero)', color: 'var(--primary-foreground)' }}
                    >
                      Most popular
                    </div>
                  )}

                  <div
                    className="flex h-full flex-col gap-6"
                    style={{ padding: 'var(--spacing-lg)', paddingTop: plan.highlighted ? 'var(--spacing-xl)' : 'var(--spacing-lg)' }}
                  >
                    <div>
                      <Heading level={3}>{plan.name}</Heading>
                      {plan.seats && (
                        <Text variant="muted" className="mt-1">
                          {plan.seats}
                        </Text>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                          {currency}
                          {price}
                        </span>
                        {billing === 'yearly' && yearlySavings > 0 && (
                          <Badge variant="success">
                            SAVE {currency}
                            {yearlySavings}
                          </Badge>
                        )}
                      </div>
                      <Text variant="muted" className="mt-1">
                        /month{billing === 'yearly' ? ', billed yearly' : ''}
                      </Text>
                    </div>

                    {plan.description && <Text variant="muted">{plan.description}</Text>}

                    <Button
                      variant={plan.highlighted ? 'primary' : 'outline'}
                      className="w-full transition-shadow duration-300 group-hover:shadow-[var(--shadow-md)]"
                    >
                      {plan.ctaLabel}
                    </Button>

                    <ul className="flex flex-col gap-3">
                      {plan.inheritsFrom && (
                        <li className="flex items-start gap-2">
                          <span
                            aria-hidden
                            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-sm"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            ↳
                          </span>
                          <Text variant="small" className="font-medium">
                            {plan.inheritsFrom}
                          </Text>
                        </li>
                      )}
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span
                            aria-hidden
                            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-xs"
                            style={{ backgroundColor: 'var(--success-subtle)', color: 'var(--success-foreground)' }}
                          >
                            ✓
                          </span>
                          <Text variant="small">{feature}</Text>
                        </li>
                      ))}
                    </ul>

                    {plan.addOn && (
                      <div
                        className="mt-auto flex flex-col gap-2 rounded-[var(--radius)] border transition-colors duration-300"
                        style={{
                          padding: 'var(--spacing-md)',
                          backgroundColor: addOnOn ? 'var(--accent)' : 'var(--muted)',
                          borderColor: addOnOn ? 'var(--primary)' : 'var(--border)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <Text variant="small" className="font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                            Add-on
                          </Text>
                          <Switch
                            checked={addOnOn}
                            onChange={(checked) =>
                              setAddOns((prev) => ({ ...prev, [plan.id ?? plan.name]: checked }))
                            }
                            label={`Toggle ${plan.addOn.name} add-on`}
                          />
                        </div>
                        <div className="flex items-baseline justify-between gap-2">
                          <Text variant="small" className="font-semibold">
                            {plan.addOn.name}
                          </Text>
                          <Text variant="small" className="font-semibold">
                            {plan.addOn.price}
                          </Text>
                        </div>
                        <Text variant="muted">{plan.addOn.description}</Text>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
