'use client'

import { useDocumentInfo, useFormModified, useTranslation } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'

/**
 * Sidebar note for draft-enabled collections (mounted by `previewPlugin`).
 *
 * Payload's own status pill says *what* the version is ("Draft", "Changed").
 * This says *where it is visible*, which is the thing a non-technical editor is
 * actually asking when they wonder whether a change "went anywhere".
 *
 * Deliberately deploy-agnostic wording ("not on your live site"), so it stays true
 * once the site leaves localhost.
 */

type State = 'unsaved' | 'draft' | 'changed' | 'published'

const COPY: Record<'en' | 'pl', Record<State, string>> = {
  en: {
    unsaved: 'Unsaved changes — nothing is stored yet. Press “Save draft”.',
    draft: 'Draft — visible only in Preview. Not on your live site yet.',
    changed:
      'Draft changes pending — your live site still shows the last published version.',
    published: 'Published — this is exactly what visitors see on your website.',
  },
  pl: {
    unsaved: 'Niezapisane zmiany — nic nie zostało jeszcze zapisane. Kliknij „Zapisz szkic”.',
    draft: 'Szkic — widoczny tylko w Podglądzie. Jeszcze nie na Twojej stronie.',
    changed:
      'Zmiany czekają w szkicu — na Twojej stronie wciąż jest ostatnia opublikowana wersja.',
    published: 'Opublikowane — dokładnie to widzą odwiedzający Twoją stronę.',
  },
}

export const PreviewStatusNote: UIFieldClientComponent = () => {
  const { hasPublishedDoc, unpublishedVersionCount, isInitializing } = useDocumentInfo()
  const modified = useFormModified()
  // `useTranslation().i18n.language` is the *admin UI* language. (`useLocale()` would
  // give the content locale — a different thing.)
  const { i18n } = useTranslation()

  if (isInitializing) return null

  // Mirrors Payload's own Status element so this sentence can never contradict the
  // pill sitting right above it.
  let state: State
  if (modified) state = 'unsaved'
  else if (unpublishedVersionCount > 0 && hasPublishedDoc) state = 'changed'
  else if (!hasPublishedDoc) state = 'draft'
  else state = 'published'

  const tone =
    state === 'published' ? 'var(--theme-success-500)' : 'var(--theme-warning-500)'

  return (
    <p
      style={{
        borderLeft: `3px solid ${tone}`,
        paddingLeft: '0.6rem',
        margin: '0.5rem 0 1rem',
        fontSize: '0.8rem',
        lineHeight: 1.45,
        color: 'var(--theme-elevation-700)',
      }}
    >
      {COPY[i18n.language === 'pl' ? 'pl' : 'en'][state]}
    </p>
  )
}
