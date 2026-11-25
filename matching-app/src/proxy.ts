import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /demo/* はSupabase不要のため直接通過
  if (pathname.startsWith('/demo') || pathname === '/') {
    return NextResponse.next({ request })
  }

  // 認証が必要なルートはSupabaseミドルウェアへ
  try {
    const { updateSession } = await import('@/lib/supabase/middleware')
    return await updateSession(request)
  } catch {
    // Supabase未設定時はログインにリダイレクト
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
