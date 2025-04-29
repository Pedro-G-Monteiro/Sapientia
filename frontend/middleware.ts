// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('[middleware] caminho:', req.nextUrl.pathname);
  return NextResponse.next();
}

// só dispara em /platform e tudo o que estiver debaixo
export const config = {
  matcher: ['/:path*'],
};
