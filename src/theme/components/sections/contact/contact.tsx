import type { ReactNode } from 'react'
import { Container } from '../../elements/container'
import { Heading } from '../../elements/heading'
import { Text } from '../../elements/text'

export interface ContactProps {
  title?: string
  address?: ReactNode
  phone?: string
  email?: string
  reservationsUrl?: string
  hours?: readonly { days: string; hours: string }[]
}

export function Contact({
  title = 'Contact',
  address,
  phone,
  email,
  reservationsUrl,
  hours,
}: ContactProps) {
  return (
    <section
      className="py-[var(--template-spacing-3xl)]"
      style={{ backgroundColor: 'var(--template-color-background)' }}
      id="contact"
    >
      <Container size="md">
        <Heading level={2} className="mb-8 text-center">
          {title}
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            {address && <Text variant="body">{address}</Text>}
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                style={{ color: 'var(--template-color-foreground)' }}
              >
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                style={{ color: 'var(--template-color-foreground)' }}
              >
                {email}
              </a>
            )}
            {reservationsUrl && (
              <a
                href={reservationsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center self-start mt-2 px-5 py-2.5 text-sm font-medium"
                style={{
                  backgroundColor: 'var(--template-color-primary)',
                  color: 'var(--template-color-primary-foreground)',
                  borderRadius: 'var(--template-radius)',
                }}
              >
                Book a meeting
              </a>
            )}
          </div>

          {hours && hours.length > 0 && (
            <ul className="flex flex-col">
              {hours.map((entry) => (
                <li
                  key={entry.days}
                  className="flex justify-between py-2"
                  style={{ borderBottom: '1px dashed var(--template-color-border)' }}
                >
                  <span>{entry.days}</span>
                  <span style={{ color: 'var(--template-color-muted-foreground)' }}>
                    {entry.hours}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  )
}
