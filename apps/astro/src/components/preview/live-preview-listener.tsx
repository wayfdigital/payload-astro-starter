import { useEffect } from 'react'
import { ready } from '@payloadcms/live-preview'

interface Props {
  /** Origin of the Payload admin that hosts the live-preview iframe. */
  adminOrigin: string
}

/**
 * Astro renders pages on the server, so we cannot merge Payload's live form data
 * into a client component tree. Payload emits a `payload-document-event` message
 * whenever a save/draft/autosave completes on the server — our cue to re-fetch via a
 * full reload (the persisted draft is now fresh; no debounce/race).
 *
 * It also keeps in-iframe navigation in preview: clicked same-origin links inherit the
 * current `?preview=1&secret=…` query (done client-side so the server never rewrites the
 * HTML body — which would leak the secret into asset URLs). Mounted only on preview
 * responses (see Layout.astro); drives the admin **Live Preview** iframe.
 */
export default function LivePreviewListener({ adminOrigin }: Props) {
  useEffect(() => {
    // Restore the scroll position saved just before the previous preview reload.
    const SCROLL_KEY = 'payload-preview-scroll'
    const savedScroll = sessionStorage.getItem(SCROLL_KEY)
    if (savedScroll) {
      window.scrollTo(0, Number.parseInt(savedScroll, 10) || 0)
      sessionStorage.removeItem(SCROLL_KEY)
    }

    // Tell the admin window we're listening so it starts sending events.
    ready({ serverURL: adminOrigin })

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== adminOrigin) return
      const data = event.data as { type?: string } | null
      // Fired after a save/draft/autosave is persisted — the SSR re-fetch is now fresh.
      if (data?.type !== 'payload-document-event') return

      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
      window.location.reload()
    }

    // Carry preview params onto plain left-click navigations to same-origin links.
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }
      const anchor = (event.target as Element | null)?.closest?.('a')
      const href = anchor?.getAttribute('href')
      if (!anchor || href == null) return
      const targetAttr = anchor.getAttribute('target')
      if ((targetAttr && targetAttr !== '_self') || anchor.hasAttribute('download')) return

      const params = new URLSearchParams(window.location.search)
      const secret = params.get('secret')
      if (params.get('preview') !== '1' || !secret) return

      let dest: URL
      try {
        dest = new URL(href, window.location.href)
      } catch {
        return
      }
      if (dest.origin !== window.location.origin) return
      if (dest.searchParams.get('preview') === '1') return

      dest.searchParams.set('preview', '1')
      dest.searchParams.set('secret', secret)
      event.preventDefault()
      window.location.assign(dest.pathname + dest.search + dest.hash)
    }

    window.addEventListener('message', onMessage)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('message', onMessage)
      document.removeEventListener('click', onClick)
    }
  }, [adminOrigin])

  return null
}
