/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PAYLOAD_API_URL: string
  readonly PAYLOAD_API_SECRET?: string
  readonly PREVIEW_SECRET?: string
  readonly ASTRO_PUBLIC_ADMIN_ORIGIN?: string
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
