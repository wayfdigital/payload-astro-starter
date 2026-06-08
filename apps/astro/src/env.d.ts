/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PAYLOAD_API_URL: string
  readonly PAYLOAD_API_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
