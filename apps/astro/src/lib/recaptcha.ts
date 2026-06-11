/**
 * Minimal reCAPTCHA v3 client helper for the FormBlock island.
 *
 * v3 is invisible: there's no checkbox. On submit we call `executeRecaptcha` to
 * mint a short-lived token, then send it to Payload, which verifies it (and its
 * score) server-side in `apps/payload/src/schemas/forms/recaptcha.ts`.
 *
 * The site key is public by design and passed in from the island's props.
 */

interface GrecaptchaV3 {
  ready: (cb: () => void) => void
  execute: (siteKey: string, opts: { action: string }) => Promise<string>
}

declare global {
  interface Window {
    grecaptcha?: GrecaptchaV3
  }
}

const SCRIPT_ID = 'recaptcha-v3'

/** Injects the reCAPTCHA v3 script once and resolves when `grecaptcha` is ready. */
const loadRecaptcha = (siteKey: string): Promise<GrecaptchaV3> =>
  new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => resolve(window.grecaptcha as GrecaptchaV3))
      return
    }

    const existing = document.getElementById(SCRIPT_ID)
    const onReady = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => resolve(window.grecaptcha as GrecaptchaV3))
      } else {
        reject(new Error('reCAPTCHA failed to initialise'))
      }
    }

    if (existing) {
      existing.addEventListener('load', onReady, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    script.async = true
    script.defer = true
    script.addEventListener('load', onReady, { once: true })
    script.addEventListener('error', () => reject(new Error('reCAPTCHA failed to load')), {
      once: true,
    })
    document.head.appendChild(script)
  })

/** Loads reCAPTCHA v3 (if needed) and returns a fresh token for the given action. */
export const executeRecaptcha = async (siteKey: string, action = 'submit'): Promise<string> => {
  const grecaptcha = await loadRecaptcha(siteKey)
  return grecaptcha.execute(siteKey, { action })
}
