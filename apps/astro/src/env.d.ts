/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PAYLOAD_API_URL: string
  readonly PAYLOAD_API_SECRET?: string
  readonly PREVIEW_SECRET?: string
  readonly ASTRO_PUBLIC_ADMIN_ORIGIN?: string
  /** reCAPTCHA v3 site key (public). Same value as Payload's NEXT_PUBLIC_RECAPTCHA_SITE_KEY. */
  readonly RECAPTCHA_SITE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace App {
  interface Locals {
    /** True when the current request is an authenticated preview (draft) render. */
    preview?: boolean
  }
}
