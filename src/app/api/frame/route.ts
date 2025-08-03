import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Unfollow Tool</title>
        <meta property="og:title" content="Unfollow Tool" />
        <meta property="og:description" content="Unfollow on Farcaster - Analyze your follows and identify who to unfollow" />
        <meta property="og:image" content="https://unfollow.vercel.app/thumbnail.png" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://unfollow.vercel.app/thumbnail.png" />
        <meta property="fc:frame:button:1" content="Try Unfollow Tool" />
        <meta property="fc:frame:post_url" content="https://unfollow.vercel.app/embed" />
      </head>
      <body>
        <h1>Unfollow Tool</h1>
        <p>Analyze your follows and identify who to unfollow</p>
        <a href="https://unfollow.vercel.app/embed">Try the tool</a>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
} 