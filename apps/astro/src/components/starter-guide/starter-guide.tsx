/* ---------------------------------------------------------------------------
 * DELETE THIS WHOLE DIRECTORY WHEN THE REAL SITE STARTS.
 *
 * This is the static landing page for the starter itself. It stays local to
 * Astro so removing the scaffolding never means untangling the shared UI kit.
 * ------------------------------------------------------------------------- */

import "./starter-guide.css";

const STEPS = [
  {
    number: "01",
    title: "Describe it",
    description:
      "Ask for an outcome in plain language. The agent finds the right part of the system.",
  },
  {
    number: "02",
    title: "Review it",
    description:
      "New sections stop at a visual preview. Content and schema wait for your approval.",
  },
  {
    number: "03",
    title: "Ship it",
    description:
      "Components, fields, types and migrations land together, with the checks already attached.",
  },
];

const SYSTEM = [
  "Payload CMS",
  "Astro",
  "TypeScript",
  "PostgreSQL",
  "Cloudflare",
];

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
        <header className="starter-v2__nav starter-v2__glass">
          <a
            className="starter-v2__wordmark"
            href="/"
            aria-label="Payload and Astro starter home"
          >
            Payload + Astro
          </a>
          <span className="starter-v2__version">Starter / v2</span>
          <nav className="starter-v2__nav-links" aria-label="Primary">
            <a href="https://github.com/wayfdigital/payload-astro-starter">
              GitHub ↗
            </a>
            <a href="https://wayf.ai">WAYF ↗</a>
          </nav>
        </header>

        <section className="starter-v2__hero" aria-labelledby="starter-title">
          <div className="starter-v2__intro">
            <p className="starter-v2__eyebrow">Payload CMS + Astro starter</p>
            <h1 id="starter-title">
              Describe the site. The system handles the rest.
            </h1>
            <p className="starter-v2__lede">
              A production-ready starting point for building Payload websites
              with an AI agent. The work stays inside one guarded workflow, from
              the first component to the final migration.
            </p>
            <div className="starter-v2__actions">
              <a
                className="starter-v2__action starter-v2__action--primary"
                href="https://github.com/wayfdigital/payload-astro-starter"
              >
                View repository ↗
              </a>
              <a
                className="starter-v2__action starter-v2__action--quiet"
                href="https://wayf.ai/contact"
              >
                Talk to WAYF ↗
              </a>
            </div>
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
              Run it in your AI assistant, or just say “set it up”. It connects
              the database, admin, preview and development servers before asking
              what you want to build.
            </p>
          </aside>
        </section>

        <section
          className="starter-v2__workflow"
          id="workflow"
          aria-labelledby="workflow-title"
        >
          <div className="starter-v2__section-head">
            <h2 id="workflow-title">One guarded workflow</h2>
            <p>
              You describe outcomes. The system keeps the implementation
              complete.
            </p>
          </div>
          <ol>
            {STEPS.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="starter-v2__system" aria-labelledby="system-title">
          <div className="starter-v2__section-head">
            <h2 id="system-title">The useful parts are already connected</h2>
            <p>
              Reusable blocks, localization, SEO, live preview, safe migrations
              and deployment are part of the starter, rather than a checklist
              for later.
            </p>
          </div>
          <ul aria-label="Technology stack">
            {SYSTEM.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {cmsPages.length > 0 && (
          <section className="starter-v2__pages" aria-labelledby="pages-title">
            <div className="starter-v2__section-head">
              <h2 id="pages-title">Pages already in the CMS</h2>
              <p>
                Mark one as the home page and this guide steps out of the way.
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
          <a href="https://wayf.ai/contact">Build with us ↗</a>
        </footer>
      </div>
    </main>
  );
}

export default StarterGuide;
