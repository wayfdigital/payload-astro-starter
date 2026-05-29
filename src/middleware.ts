import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/navigation'

const intlMiddleware = createMiddleware(routing)

function parseOrigins(originsString?: string): string[] {
  if (!originsString) return []
  return originsString.split(',').map(o => o.trim())
}

function isOriginAllowed(hostname: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.some(origin => {
    try {
      const url = new URL(origin)
      return url.host === hostname
    } catch {
      return origin === hostname
    }
  })
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') ?? ''

  const response = NextResponse.next()
  response.headers.set(
    'X-Robots-Tag',
    'noindex, nofollow, noarchive, nosnippet, notranslate, noimageindex'
  )

  const apiAllowedOrigins = parseOrigins(process.env.NEXT_PUBLIC_API_ALLOWED_ORIGINS)
  const adminAllowed = parseOrigins(process.env.NEXT_PUBLIC_ADMIN_ALLOWED_ORIGINS)
  const webAllowed = parseOrigins(process.env.NEXT_PUBLIC_WEB_ALLOWED_ORIGINS)

  const canApi = isOriginAllowed(hostname, apiAllowedOrigins)
  const canAdmin = isOriginAllowed(hostname, adminAllowed)
  const canWeb = isOriginAllowed(hostname, webAllowed)

  if (pathname.startsWith('/api')) {
    if (!canApi) {
      return new NextResponse('Forbidden', { status: 403 })
    }
    return response
  }

  if (pathname.startsWith('/admin')) {
    if (canAdmin) {
      return response
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (canWeb) {
    return intlMiddleware(request)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
