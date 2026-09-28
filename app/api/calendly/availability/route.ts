import { NextResponse } from 'next/server'
import { checkAvailability } from '@/lib/calendly'

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url')
  if (!url) return NextResponse.json({ available: null, error: 'missing_url' }, { status: 400 })
  const result = await checkAvailability(url)
  return NextResponse.json(result, { headers: { 'Cache-Control': 'public, max-age=300' } })
}
