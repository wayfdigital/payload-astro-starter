import type {
  Access,
  CollectionConfig,
  GlobalConfig,
  Plugin,
} from 'payload'

/**
 * Reusable "preview" plugin.
 *
 * For each opted-in collection/global it:
 *  1. Enables draft versions with autosave (so the SSR frontend can re-fetch the
 *     in-flight draft on every change — see apps/astro live-preview listener).
 *  2. Wires `admin.preview` (open-in-new-tab) and `admin.livePreview` (iframe) to
 *     the Astro frontend, threading a shared secret + locale through the URL.
 *  3. Tightens `read` access: admins (incl. API-key requests) see everything;
 *     everyone else sees only `_status: published`. This is the security gate that
 *     keeps drafts private even when `?draft=true` is requested.
 *
 * The Astro side reads drafts with an Admins API key, which satisfies the
 * `req.user?.collection === 'admins'` check below.
 */

interface PreviewGlobalOption {
  slug: string
  /** Frontend path of a page where this global is visible (e.g. `/` for a footer). */
  previewPath?: string
}

export interface PreviewPluginOptions {
  /** Collection slugs that get drafts + preview. */
  collections?: string[]
  /** Globals that get drafts + preview. */
  globals?: PreviewGlobalOption[]
  /** Frontend (Astro) origin, e.g. `http://localhost:3000`. */
  frontendUrl: string
  /** Shared secret that gates the preview link (must match the frontend's PREVIEW_SECRET). */
  previewSecret: string
  /** Whether drafts autosave. Default true. When false, only manual "Save draft" persists. */
  autosave?: boolean
  /** Autosave interval (ms) when `autosave` is enabled. Default 800. */
  autosaveInterval?: number
  /** Build the frontend path for a collection doc. Default `/${doc.slug}`. */
  resolvePath?: (doc: Record<string, unknown>) => string
}

/** `${frontendUrl}${path}?preview=1&secret=…&locale=…` — used directly as the iframe `src`. */
const buildLivePreviewUrl = (
  frontendUrl: string,
  path: string,
  secret: string,
  localeCode?: string,
): string => {
  const url = new URL(path || '/', frontendUrl)
  url.searchParams.set('preview', '1')
  url.searchParams.set('secret', secret)
  if (localeCode) url.searchParams.set('locale', localeCode)
  return url.toString()
}

/** `${frontendUrl}/preview?secret=…&path=…&locale=…` — the new-tab entry that sets a cookie. */
const buildPreviewEntryUrl = (
  frontendUrl: string,
  path: string,
  secret: string,
  localeCode?: string,
): string => {
  const url = new URL('/preview', frontendUrl)
  url.searchParams.set('secret', secret)
  url.searchParams.set('path', path || '/')
  if (localeCode) url.searchParams.set('locale', localeCode)
  return url.toString()
}

/**
 * Wraps an existing `read` access function so that:
 *  - admins (incl. API-key requests) get full access (drafts included),
 *  - everyone else is constrained to published documents.
 */
const wrapRead =
  (orig?: Access): Access =>
  async (args) => {
    if (args.req.user?.collection === 'admins') return true

    const base = typeof orig === 'function' ? await orig(args) : (orig ?? true)
    if (base === false) return false

    const publishedOnly = { _status: { equals: 'published' } }
    if (base === true) return publishedOnly
    // `base` is a Where query — AND it with the published-only constraint.
    return { and: [base, publishedOnly] }
  }

const draftsConfig = (
  existing: CollectionConfig['versions'] | GlobalConfig['versions'],
  autosave: boolean,
  autosaveInterval: number,
) => {
  const existingObj = typeof existing === 'object' ? existing : {}
  const existingDrafts =
    typeof existingObj.drafts === 'object' ? existingObj.drafts : {}
  return {
    ...existingObj,
    drafts: {
      ...(autosave ? { autosave: { interval: autosaveInterval } } : {}),
      ...existingDrafts,
    },
  }
}

export const previewPlugin =
  (opts: PreviewPluginOptions): Plugin =>
  (config) => {
    const {
      frontendUrl,
      previewSecret,
      autosave = true,
      autosaveInterval = 800,
      collections = [],
      globals = [],
    } = opts
    const resolvePath =
      opts.resolvePath ?? ((doc) => `/${(doc.slug as string | undefined) ?? ''}`)

    const collectionSet = new Set(collections)
    const globalMap = new Map(globals.map((g) => [g.slug, g]))

    /**
     * Enables drafts + preview/live-preview + the published-only read gate on a
     * collection or global. `pathOf` maps a doc to its frontend path (globals use a
     * fixed path since they have no slug).
     */
    const applyPreview = <T extends CollectionConfig | GlobalConfig>(
      entity: T,
      pathOf: (doc: Record<string, unknown>) => string,
    ): T =>
      ({
        ...entity,
        versions: draftsConfig(entity.versions, autosave, autosaveInterval),
        admin: {
          ...entity.admin,
          livePreview: {
            url: ({ data, locale }) =>
              buildLivePreviewUrl(frontendUrl, pathOf(data), previewSecret, locale?.code),
            ...entity.admin?.livePreview,
          },
          preview:
            entity.admin?.preview ??
            ((doc, { locale }) =>
              buildPreviewEntryUrl(frontendUrl, pathOf(doc), previewSecret, locale)),
        },
        access: {
          ...entity.access,
          read: wrapRead(entity.access?.read),
        },
      }) as T

    return {
      ...config,
      collections: (config.collections ?? []).map((collection) =>
        collectionSet.has(collection.slug)
          ? applyPreview(collection, resolvePath)
          : collection,
      ),
      globals: (config.globals ?? []).map((global) => {
        const gOpt = globalMap.get(global.slug)
        if (!gOpt) return global
        const path = gOpt.previewPath ?? '/'
        return applyPreview(global, () => path)
      }),
    }
  }
