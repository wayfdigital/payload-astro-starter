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

function PayloadMark() {
  return (
    <svg viewBox="0 0 42 48" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2.872 10.296a.57.57 0 0 1 .572 0l19.752 11.398c.217.126.343.355.343.595v6.146c0 .263-.286.435-.515.297L6.603 19.257a.285.285 0 0 0-.423.252v12.61c0 .206.114.389.286.492l14.144 8.16h.011a.57.57 0 0 0 .572 0l10.997-6.352a.687.687 0 0 1 .687 0l5.31 3.067c.229.138.229.458 0 .595l-17.04 9.842a.57.57 0 0 1-.572 0L.286 36.205A.572.572 0 0 1 0 35.713V12.287c0-.206.115-.388.286-.491l2.586-1.5ZM20.577.077a.57.57 0 0 1 .572 0l20.29 11.707.011.012a.572.572 0 0 1 .286.491v19.5c0 .263-.286.435-.515.298l-5.264-3.032a.687.687 0 0 1-.344-.596V15.79a.572.572 0 0 0-.285-.492L21.184 7.138a.57.57 0 0 0-.573 0l-4.806 2.77a.687.687 0 0 1-.687 0L9.854 6.863c-.228-.137-.228-.457 0-.595L20.577.077Z"
      />
    </svg>
  );
}

function AstroMark() {
  return (
    <svg viewBox="0 10 24 31" aria-hidden="true">
      <path
        fill="currentColor"
        d="M.02 30.31s4.02-1.95 8.05-1.95l3.04-9.4c.11-.45.44-.76.82-.76.37 0 .7.31.82.76l3.04 9.4c4.77 0 8.05 1.95 8.05 1.95L17 11.71c-.2-.56-.53-.91-.98-.91H7.83c-.44 0-.76.35-.97.9L.02 30.31Z"
      />
      <path
        fill="var(--primary)"
        d="M7.77 36.35C6.4 35.11 6 32.51 6.57 30.62c.99 1.2 2.35 1.57 3.75 1.78 2.18.33 4.31.2 6.33-.78.23-.12.44-.27.7-.42.18.55.23 1.1.17 1.67a4.56 4.56 0 0 1-1.94 3.23c-.43.32-.9.61-1.34.91-1.38.94-1.76 2.03-1.24 3.62l.05.17a3.63 3.63 0 0 1-1.6-1.38 3.87 3.87 0 0 1-.63-2.1c0-.37 0-.74-.05-1.1-.13-.9-.55-1.3-1.33-1.32a1.56 1.56 0 0 0-1.63 1.26c0 .06-.03.12-.05.2Z"
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

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.16 1.18a10.96 10.96 0 0 1 5.75 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.71 5.38-5.28 5.67.42.36.78 1.06.78 2.14v3.18c0 .31.21.68.79.56A11.5 11.5 0 0 0 12 .7Z"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.194a.75.75 0 0 1-1.088.79L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.328.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.565.41l-3.097.45 2.241 2.184a.75.75 0 0 1 .216.664l-.529 3.085 2.77-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.529-3.085a.75.75 0 0 1 .216-.664l2.241-2.184-3.097-.45a.75.75 0 0 1-.565-.41L8 2.695Z"
      />
    </svg>
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
          <nav className="starter-v2__nav-links" aria-label="Primary">
            <a
              className="starter-v2__repo-button"
              href="https://github.com/wayfdigital/payload-astro-starter"
            >
              <GitHubMark />
              <span>GitHub</span>
            </a>
            <a
              className="starter-v2__repo-button starter-v2__repo-button--star"
              href="https://github.com/wayfdigital/payload-astro-starter/stargazers"
              aria-label="Star payload-astro-starter on GitHub"
            >
              <StarIcon />
              <span>Star</span>
              <span className="starter-v2__star-count">3</span>
            </a>
          </nav>
        </header>

        <section className="starter-v2__hero" aria-labelledby="starter-title">
          <div className="starter-v2__intro">
            <div className="starter-v2__eyebrow-row">
              <span className="starter-v2__platform-marks" aria-hidden="true">
                <PayloadMark />
                <span>+</span>
                <AstroMark />
              </span>
              <p className="starter-v2__eyebrow">Payload CMS + Astro starter</p>
            </div>
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

          <aside className="starter-v2__setup" aria-label="Setup command">
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
