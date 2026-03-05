import { NextRequest, NextResponse } from 'next/server'

/**
 * Минимальный proxy для Next.js 16.
 * Без proxy.ts пустой middleware-manifest вызывает:
 * TypeError: Cannot read properties of undefined (reading '/_middleware')
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next()
}
