import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer'),
    host: request.headers.get('host'),
    isFarcaster: request.headers.get('user-agent')?.includes('Farcaster') || 
                 request.headers.get('user-agent')?.includes('Warpcast') ||
                 request.headers.get('referer')?.includes('farcaster') ||
                 request.headers.get('referer')?.includes('warpcast'),
    environment: process.env.NODE_ENV,
    neynarApiKey: process.env.NEYNAR_API_KEY ? 'Configured' : 'Not configured'
  }

  return NextResponse.json(debugInfo)
} 