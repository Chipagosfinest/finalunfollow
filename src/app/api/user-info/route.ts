import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { fid } = await request.json()
    
    if (!fid) {
      return NextResponse.json(
        { error: 'FID is required' },
        { status: 400 }
      )
    }

    const NEYNAR_API_KEY = process.env.neynar_api
    
    if (!NEYNAR_API_KEY) {
      console.log('Neynar API key not configured, using fallback data')
      // Return fallback data when API key is not available
      return NextResponse.json({
        fid: parseInt(fid),
        username: `user_${fid}`,
        display_name: `User ${fid}`,
        pfp_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fid}`,
        profile: {
          bio: {
            text: `Farcaster user ${fid}`
          }
        },
        follower_count: Math.floor(Math.random() * 1000) + 100,
        following_count: Math.floor(Math.random() * 500) + 50
      })
    }

    // Fetch user info from Neynar API
    const userResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          'accept': 'application/json',
          'api_key': NEYNAR_API_KEY
        }
      }
    )

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error('Neynar API error:', userResponse.status, errorText)
      throw new Error(`Neynar API error: ${userResponse.status} - ${errorText}`)
    }

    const userData = await userResponse.json()
    const user = userData.users?.[0]
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)

  } catch (error) {
    console.error('User info error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user info' },
      { status: 500 }
    )
  }
} 