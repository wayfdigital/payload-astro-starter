import type { Payload } from 'payload'

/**
 * Seeds the default `example` email template + sensible Email Settings so the
 * pipeline works out of the box.
 *
 * Idempotent and non-destructive: keyed off whether the `example` template
 * already exists. On a fresh DB it writes the Email Settings defaults and the
 * bilingual example template; on every subsequent boot it does nothing, so an
 * admin's edits to either are never clobbered.
 */
export async function seedEmail(payload: Payload) {
  const existing = await payload.find({
    collection: 'email-templates',
    where: { key: { equals: 'example' } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs.length > 0) {
    console.log('[SEED] Example email template already exists, skipping...')
    return
  }

  // Fresh DB: sensible sender identity so Mailpit shows a real From line.
  await payload.updateGlobal({
    slug: 'email-settings',
    overrideAccess: true,
    data: {
      siteName: 'Example',
      fromName: 'Example',
      fromAddress: 'noreply@example.com',
      supportEmail: 'support@example.com',
    },
  })

  // English copy first…
  const created = await payload.create({
    collection: 'email-templates',
    locale: 'en',
    overrideAccess: true,
    data: {
      key: 'example',
      name: 'Example email',
      subject: 'Hello from {siteName}',
      previewText: 'A quick example email',
      heading: 'Hi {recipientName} 👋',
      body: 'This is an example transactional email sent from {siteName}.\n\n{message}\n\nIf you have any questions, reach us at {supportEmail}.',
      buttonText: 'Visit site',
      buttonUrl: '{actionUrl}',
    },
  })

  // …then Polish copy on the same doc (button URL is non-localized).
  await payload.update({
    collection: 'email-templates',
    id: created.id,
    locale: 'pl',
    overrideAccess: true,
    data: {
      subject: 'Wiadomość od {siteName}',
      previewText: 'Przykładowy e-mail',
      heading: 'Cześć {recipientName} 👋',
      body: 'To jest przykładowy e-mail transakcyjny wysłany z {siteName}.\n\n{message}\n\nW razie pytań napisz do nas: {supportEmail}.',
      buttonText: 'Odwiedź stronę',
    },
  })

  console.log('[SEED] Created example email template + settings defaults.')
}
