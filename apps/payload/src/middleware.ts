import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

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

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  const response = NextResponse.next()

  const apiAllowedOrigins = parseOrigins(process.env.NEXT_PUBLIC_API_ALLOWED_ORIGINS)
  const adminAllowed = parseOrigins(process.env.NEXT_PUBLIC_ADMIN_ALLOWED_ORIGINS)

  if (pathname.startsWith('/api')) {
    if (apiAllowedOrigins.length > 0 && !isOriginAllowed(hostname, apiAllowedOrigins)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
    return response
  }

  if (pathname.startsWith('/admin')) {
    if (adminAllowed.length > 0 && !isOriginAllowed(hostname, adminAllowed)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return response
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
