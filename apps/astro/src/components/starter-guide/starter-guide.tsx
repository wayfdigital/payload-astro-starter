/* ---------------------------------------------------------------------------
 * DELETE THIS WHOLE FILE WHEN THE REAL SITE STARTS.
 *
 * It is the placeholder landing page — a guide to the starter itself, shown only
 * while no page is marked as the home page in the admin panel. It is not part of
 * anyone's website.
 *
 * To remove it, in full, takes two steps:
 *   1. rm -rf apps/astro/src/components/starter-guide
 *   2. in apps/astro/src/pages/index.astro, delete the StarterGuide import and
 *      swap the fallback branch for whatever the site should show instead.
 *
 * Nothing else in the repo imports it. That is why every bit of its markup and
 * copy lives in this one file rather than in @repo/ui, where the rest of the
 * section components belong — deleting scaffolding should not mean hunting
 * through the design system for the pieces.
 *
 * Kept out of here on purpose: the `flickerGrid` hero variant and the
 * `FlickeringGrid` element in @repo/ui are reusable background art, and the
 * floating WAYF badge in src/layouts/Layout.astro is site-wide branding. Those
 * are separate decisions from this page.
 * ------------------------------------------------------------------------- */

import { Container, Heading, Hero, Text } from '@repo/ui'
import WayfBadge from '../elements/wayf-badge'

const STEPS = [
  {
    title: 'Describe an outcome',
    description: 'Plain language. "A pricing section", "make the hero say this", "here is my Figma".',
  },
  {
    title: 'Approve the design',
    description: 'A new section is built in Storybook first. Nothing reaches the database without your yes.',
  },
  {
    title: 'It gets wired up',
    description: 'Block, editable fields, renderer, types and a database migration — in one pass.',
  },
]

const SKILLS = [
  { name: 'vibe-coding', description: 'The front door. Turns what you asked for into a spec and picks the rest.' },
  { name: 'setup', description: 'First run on a new machine: secrets, Docker, migrations, the first admin.' },
  { name: 'design-mode', description: 'Designs a new section in Storybook and holds the approval gate.' },
  { name: 'debug-mode', description: 'Something broken? Reproduces it against real logs instead of guessing.' },
  { name: 'security-audit', description: 'Seven areas against the OWASP Top 10 before you launch.' },
  // Sixth tile fills the 3-column row and says the list is a sample, not the set.
  { name: '+ 10 more', description: 'Migrations, SEO, data fetching, design system, CMS migration. You never invoke one — the agent picks.' },
]

const STACK = [
  'Astro 6.4',
  'Payload CMS 3.81',
  'TypeScript 5.9',
  'PostgreSQL 17',
  'Tailwind CSS 4.1',
  'Storybook 9',
  'Turborepo',
  'Docker Compose',
  'Mailpit',
]

// Everything below the fold sits on the dark hero art, so the on-primary token is
// the base and opacity does the hierarchy — mixed with transparent for hairlines.
const onDark = 'var(--primary-foreground)'
const hairline = `color-mix(in srgb, ${onDark} 14%, transparent)`

const groupLabel = 'mb-4 uppercase tracking-[0.18em]'
const groupLabelStyle = { color: onDark, opacity: 0.5 }

export interface StarterGuideProps {
  /** Pages that exist in the CMS but are not the home page — navigation while you build. */
  pages?: readonly { slug?: string | null }[]
}

export function StarterGuide({ pages = [] }: StarterGuideProps) {
  const cmsPages = pages.filter((page) => Boolean(page.slug))

  return (
    <>
      <Hero
        variant="flickerGrid"
        alignment="center"
        eyebrow="Payload CMS + Astro starter"
        title="Describe what you want. Your agent builds it."
        subtitle="You describe outcomes in plain language; the agent turns them into real CMS blocks, components and database migrations — following a pipeline that will not let it skip the parts that keep your content safe."
        actions={<WayfBadge />}
      >
        <div
          className="mt-10 flex w-full flex-col gap-10 pt-10"
          style={{ borderTop: `1px solid ${hairline}` }}
        >
          <section
            className="flex flex-col gap-3 rounded-lg p-5 text-left sm:flex-row sm:items-center sm:gap-5"
            style={{
              border: `1px solid ${hairline}`,
              backgroundColor: `color-mix(in srgb, ${onDark} 4%, transparent)`,
            }}
          >
            <span className="font-mono text-sm font-medium" style={{ color: 'var(--flicker-color)' }}>
              /setup
            </span>
            <Text variant="small" style={{ color: onDark, opacity: 0.7 }}>
              Start here: run <span className="font-mono">/setup</span> in your AI assistant — or just say
              “set it up”. It handles the secrets, database, admin account and dev servers, then asks what
              you want to build first. After that you are only describing outcomes.
            </Text>
          </section>

          <section>
            <Heading level={6} className={groupLabel} style={groupLabelStyle}>
              How you work with this
            </Heading>
            <ol className="grid gap-6 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex flex-col gap-1.5">
                  <span className="font-mono text-xs font-medium" style={{ color: 'var(--flicker-color)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Heading level={5} style={{ color: onDark }}>
                    {step.title}
                  </Heading>
                  <Text variant="small" style={{ color: onDark, opacity: 0.7 }}>
                    {step.description}
                  </Text>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <Heading level={6} className={groupLabel} style={groupLabelStyle}>
              Skills worth knowing about
            </Heading>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SKILLS.map((skill) => (
                <li
                  key={skill.name}
                  className="rounded-lg p-4"
                  style={{
                    border: `1px solid ${hairline}`,
                    // Barely-there lift off the grid, so the cards read as a group
                    // without punching a solid block through the animation.
                    backgroundColor: `color-mix(in srgb, ${onDark} 4%, transparent)`,
                  }}
                >
                  <span className="font-mono text-sm font-medium" style={{ color: 'var(--flicker-color)' }}>
                    {skill.name}
                  </span>
                  <Text variant="small" className="mt-1" style={{ color: onDark, opacity: 0.7 }}>
                    {skill.description}
                  </Text>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <Heading level={6} className={groupLabel} style={groupLabelStyle}>
              Built on
            </Heading>
            <ul className="flex flex-wrap gap-2">
              {STACK.map((item) => (
                <li
                  key={item}
                  className="rounded-full px-3 py-1 text-xs"
                  style={{ border: `1px solid ${hairline}`, color: onDark, opacity: 0.75 }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Hero>

      {cmsPages.length > 0 && (
        <section className="py-16">
          <Container size="md">
            <Heading level={2} className="mb-4">
              Your pages
            </Heading>
            <Text variant="lead" className="mb-8 max-w-3xl">
              Pages that already exist in the CMS. Mark one as the home page and it replaces this guide.
            </Text>
            <ul className="flex flex-wrap gap-3">
              {cmsPages.map((page) => (
                <li key={page.slug}>
                  <a
                    href={`/${page.slug}`}
                    className="inline-block rounded-lg border px-4 py-2 font-mono text-sm"
                    style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}
                  >
                    /{page.slug}
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  )
}

export default StarterGuide
