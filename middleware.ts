import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/auth/signin' || path === '/auth/signup' || path === '/' || path === '/about' || path === '/pricing'

  const token = request.cookies.get('authToken')?.value || ''

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.nextUrl))
  }
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/:path*',
    '/account',
    '/auth/signin',
    '/auth/signup',
    '/about',
    '/pricing',
  ]
}