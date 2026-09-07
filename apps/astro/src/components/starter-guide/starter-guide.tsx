/* ---------------------------------------------------------------------------
 * DELETE THIS WHOLE DIRECTORY WHEN THE REAL SITE STARTS.
 *
 * This is the static landing page for the starter itself. It stays local to
 * Astro so removing the scaffolding never means untangling the shared UI kit.
 * ------------------------------------------------------------------------- */

import "./starter-guide.css";

const STEPS = [
  {
    title: "Describe an outcome",
    description:
      'Plain language. "A pricing section", "make the hero say this", "here is my Figma".',
  },
  {
    title: "Approve the design",
    description:
      "A new section is built in Storybook first. Nothing reaches the database without your yes.",
  },
  {
    title: "It gets wired up",
    description:
      "Block, editable fields, renderer, types and a database migration — in one pass.",
  },
];

const SKILLS = [
  {
    name: "vibe-coding",
    description:
      "The front door. Turns what you asked for into a spec and picks the rest.",
  },
  {
    name: "setup",
    description:
      "First run on a new machine: secrets, Docker, migrations, the first admin.",
  },
  {
    name: "design-mode",
    description:
      "Designs a new section in Storybook and holds the approval gate.",
  },
  {
    name: "debug-mode",
    description:
      "Something broken? Reproduces it against real logs instead of guessing.",
  },
  {
    name: "security-audit",
    description: "Seven areas against the OWASP Top 10 before you launch.",
  },
  {
    name: "+ 10 more",
    description:
      "Migrations, SEO, data fetching, design system, CMS migration. You never invoke one — the agent picks.",
  },
];

const STACK = [
  "Astro 6.4",
  "Payload CMS 3.81",
  "TypeScript 5.9",
  "PostgreSQL 17",
  "Tailwind CSS 4.1",
  "Storybook 9",
  "Turborepo",
  "Docker Compose",
  "Mailpit",
];

function WayfMark() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M3.63672 29.0908H14.5459V21.8184H18.1816V40H0V36.3633H14.5459V32.7275H0V21.8184H3.63672V29.0908ZM40 25.4541H25.4541V29.0908H40V32.7275H25.4541V40H21.8184V21.8184H40V25.4541ZM3.63574 14.5459H7.27246V0H10.9092V14.5459H14.5459V0H18.1816V18.1816H0V0H3.63574V14.5459ZM40 18.1816H36.3633V10.9092H25.4541V18.1816H21.8184V0H40V18.1816ZM25.4541 7.27246H36.3633V3.63672H25.4541V7.27246Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PixelChevron() {
  return (
    <span className="starter-v2__chevron" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export interface StarterGuideProps {
  /** Pages that exist in the CMS but are not the home page. */
  pages?: readonly { slug?: string | null }[];
}

export function StarterGuide({ pages = [] }: StarterGuideProps) {
  const cmsPages = pages.filter((page) => Boolean(page.slug));

  return (
    <main className="starter-v2">
      <div className="starter-v2__glow" aria-hidden="true" />

      <div className="starter-v2__shell">
        <header className="starter-v2__nav">
          <div className="starter-v2__brand-group">
            <a
              className="starter-v2__mark"
              href="https://wayf.ai"
              aria-label="WAYF"
            >
              <WayfMark />
            </a>
            <a className="starter-v2__wordmark" href="/">
              Payload + Astro
            </a>
          </div>
          <span className="starter-v2__version">Starter / v2</span>
          <nav className="starter-v2__nav-links" aria-label="Primary">
            <a href="https://github.com/wayfdigital/payload-astro-starter">
              GitHub ↗
            </a>
          </nav>
        </header>

        <section className="starter-v2__hero" aria-labelledby="starter-title">
          <div className="starter-v2__intro">
            <p className="starter-v2__eyebrow">Payload CMS + Astro starter</p>
            <h1 id="starter-title">
              Describe what you want. Your agent builds it.
            </h1>
            <p className="starter-v2__lede">
              You describe outcomes in plain language; the agent turns them into
              real CMS blocks, components and database migrations — following a
              pipeline that will not let it skip the parts that keep your
              content safe.
            </p>
            <a
              className="starter-v2__action starter-v2__action--primary"
              href="https://github.com/wayfdigital/payload-astro-starter"
            >
              <span>View the GitHub repository</span>
              <PixelChevron />
            </a>
          </div>

          <aside
            className="starter-v2__setup starter-v2__glass"
            aria-label="Setup command"
          >
            <div className="starter-v2__setup-head">
              <span>Start here</span>
              <span>01 / 01</span>
            </div>
            <code>/setup</code>
            <p>
              Start here: run <code>/setup</code> in your AI assistant — or just
              say “set it up”. It handles the secrets, database, admin account
              and dev servers, then asks what you want to build first. After
              that you are only describing outcomes.
            </p>
          </aside>
        </section>

        <section
          className="starter-v2__workflow"
          aria-labelledby="workflow-title"
        >
          <div className="starter-v2__section-head">
            <p className="starter-v2__section-index">01 / Workflow</p>
            <h2 id="workflow-title">How you work with this</h2>
          </div>
          <ol>
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="starter-v2__skills" aria-labelledby="skills-title">
          <div className="starter-v2__section-head">
            <p className="starter-v2__section-index">02 / Inside the starter</p>
            <h2 id="skills-title">Skills worth knowing about</h2>
          </div>
          <ul>
            {SKILLS.map((skill, index) => (
              <li key={skill.name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <code>{skill.name}</code>
                <p>{skill.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="starter-v2__stack" aria-labelledby="stack-title">
          <div className="starter-v2__section-head">
            <p className="starter-v2__section-index">03 / Stack</p>
            <h2 id="stack-title">Built on</h2>
          </div>
          <ul aria-label="Technology stack">
            {STACK.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="starter-v2__cta" aria-labelledby="cta-title">
          <div>
            <h2 id="cta-title">Looking to build on Payload?</h2>
            <p>
              Work with WAYF to turn the starter into a production-ready
              website.
            </p>
          </div>
          <a
            className="starter-v2__action starter-v2__action--primary"
            href="https://wayf.ai/contact"
          >
            <span>Contact us</span>
            <PixelChevron />
          </a>
        </section>

        {cmsPages.length > 0 && (
          <section className="starter-v2__pages" aria-labelledby="pages-title">
            <div className="starter-v2__section-head">
              <h2 id="pages-title">Your pages</h2>
              <p>
                Pages that already exist in the CMS. Mark one as the home page
                and it replaces this guide.
              </p>
            </div>
            <ul>
              {cmsPages.map((page) => (
                <li key={page.slug}>
                  <a href={`/${page.slug}`}>/{page.slug} ↗</a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="starter-v2__footer">
          <span>Open-source starter by WAYF.</span>
          <a href="https://wayf.ai">wayf.ai ↗</a>
        </footer>
      </div>
    </main>
  );
}

export default StarterGuide;
