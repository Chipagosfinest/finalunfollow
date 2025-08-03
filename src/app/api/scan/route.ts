import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

interface FarcasterUser {
  fid: number
  username: string
  display_name: string
  pfp_url: string
  profile?: {
    bio?: {
      text?: string
    }
  }
  follower_count?: number
  following_count?: number
  last_active?: number
}

export async function POST(request: NextRequest) {
  try {
    const { fid } = await request.json()
    
    if (!fid) {
      return NextResponse.json(
        { error: 'FID is required' },
        { status: 400 }
      )
    }

    // Rate limiting
    const clientId = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(clientId, 5, 60000)) { // 5 requests per minute
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      )
    }

    const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY
    
    if (!NEYNAR_API_KEY) {
      return NextResponse.json(
        { error: 'Neynar API key not configured' },
        { status: 500 }
      )
    }

    // First, get the user's basic info to verify the FID
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
      
      if (userResponse.status === 404) {
        return NextResponse.json(
          { error: 'User not found. Please check the FID and try again.' },
          { status: 404 }
        )
      }
      
      if (userResponse.status === 429) {
        return NextResponse.json(
          { error: 'Neynar API rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      
      throw new Error(`Neynar API error: ${userResponse.status} - ${errorText}`)
    }

    const userData = await userResponse.json()
    const user = userData.users?.[0] as FarcasterUser
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('User info:', JSON.stringify(user, null, 2))
    
    // Get the user's actual following list
    const followingResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/user/following?fid=${fid}&limit=1000`,
      {
        headers: {
          'accept': 'application/json',
          'api_key': NEYNAR_API_KEY
        }
      }
    )

    if (!followingResponse.ok) {
      const errorText = await followingResponse.text()
      console.error('Following API error:', followingResponse.status, errorText)
      
      // If following endpoint fails, try to get at least some real user data
      console.log('Following endpoint failed, trying to get user data only')
      
      // Get the user's own data to show at least something
      const userResponse = await fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
        {
          headers: {
            'accept': 'application/json',
            'api_key': NEYNAR_API_KEY
          }
        }
      )
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        const user = userData.users?.[0]
        
        if (user) {
          // Return analysis with just the user's own data
          return NextResponse.json({
            totalFollows: user.following_count || 0,
            inactiveUsers: 0,
            spamAccounts: 0,
            notFollowingBack: 0,
            veryInactiveUsers: 0,
            recommendations: [],
            message: 'Following data unavailable, showing user profile only'
          })
        }
      }
      
      // Final fallback to mock data
      return await generateMockAnalysis()
    }

    const followingData = await followingResponse.json()
    const following = followingData.users || []
    
    console.log(`Found ${following.length} users in following list`)

    // Get detailed info for all following users
    if (following.length > 0) {
      const fids = following.map((u: FarcasterUser) => u.fid).join(',')
      const bulkUserResponse = await fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`,
        {
          headers: {
            'accept': 'application/json',
            'api_key': NEYNAR_API_KEY
          }
        }
      )

      if (bulkUserResponse.ok) {
        const bulkUserData = await bulkUserResponse.json()
        const detailedUsers = bulkUserData.users || []
        
        // Analyze real following data
        return await analyzeRealFollowing(detailedUsers)
      }
    }

    // Fallback to mock data if no following found
    return await generateMockAnalysis()

  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json(
      { error: 'Failed to scan follows. Please try again.' },
      { status: 500 }
    )
  }
}

async function analyzeRealFollowing(following: FarcasterUser[]) {
  const analysis = {
    totalFollows: following.length,
    inactiveUsers: 0,
    spamAccounts: 0,
    notFollowingBack: 0,
    veryInactiveUsers: 0,
    recommendations: [] as Array<{
      fid: number
      username: string
      display_name: string
      pfp_url: string
      bio: string
      follower_count: number
      following_count: number
      last_active: number
      follows_back: boolean
      reason: string
      days_inactive: number
    }>
  }

  // For each following user, analyze their activity
  for (const follow of following) {
    const lastActive = follow.last_active || Date.now() - (30 * 24 * 60 * 60 * 1000) // Default to 30 days ago
    const daysSinceActive = (Date.now() - lastActive) / (1000 * 60 * 60 * 24)
    
    // Check for very inactive users (60+ days)
    if (daysSinceActive > 60) {
      analysis.veryInactiveUsers++
      analysis.recommendations.push({
        fid: follow.fid,
        username: follow.username,
        display_name: follow.display_name,
        pfp_url: follow.pfp_url,
        bio: follow.profile?.bio?.text || '',
        follower_count: follow.follower_count || 0,
        following_count: follow.following_count || 0,
        last_active: lastActive,
        follows_back: false, // We'll need to check this separately
        reason: `Haven't casted in ${Math.floor(daysSinceActive)} days`,
        days_inactive: Math.floor(daysSinceActive)
      })
    }
    
    // Check for potential spam (high follower count but low engagement)
    if (follow.follower_count && follow.follower_count > 1000 && daysSinceActive > 7) {
      analysis.spamAccounts++
      if (!analysis.recommendations.find(r => r.fid === follow.fid)) {
        analysis.recommendations.push({
          fid: follow.fid,
          username: follow.username,
          display_name: follow.display_name,
          pfp_url: follow.pfp_url,
          bio: follow.profile?.bio?.text || '',
          follower_count: follow.follower_count || 0,
          following_count: follow.following_count || 0,
          last_active: lastActive,
          follows_back: false,
          reason: 'Potential spam account (high followers, low activity)',
          days_inactive: Math.floor(daysSinceActive)
        })
      }
    }
    
    // Check for inactivity (more than 30 days)
    if (daysSinceActive > 30) {
      analysis.inactiveUsers++
      if (!analysis.recommendations.find(r => r.fid === follow.fid)) {
        analysis.recommendations.push({
          fid: follow.fid,
          username: follow.username,
          display_name: follow.display_name,
          pfp_url: follow.pfp_url,
          bio: follow.profile?.bio?.text || '',
          follower_count: follow.follower_count || 0,
          following_count: follow.following_count || 0,
          last_active: lastActive,
          follows_back: false,
          reason: `Inactive for ${Math.floor(daysSinceActive)} days`,
          days_inactive: Math.floor(daysSinceActive)
        })
      }
    }
  }

  return NextResponse.json(analysis)
}

async function generateMockAnalysis() {
  // Fallback mock data for demo purposes
  const sampleUsers = [
    { 
      fid: 123, 
      username: 'user123', 
      display_name: 'Inactive User 1', 
      pfp_url: 'https://i.seadn.io/gae/sYAr036bd0bRpj7OX6B-F-MqLGznVkK3--DSneL_BT5GX4NZJ3Zu91PgjpD9-xuVJtHq0qirJfPZeMKrahz8Us2Tj_X8qdNPYC-imqs?w=500&auto=format',
      bio: 'Building cool stuff on Farcaster',
      last_active: Date.now() - (75 * 24 * 60 * 60 * 1000), 
      follower_count: 50,
      following_count: 120,
      follows_back: false
    },
    { 
      fid: 456, 
      username: 'user456', 
      display_name: 'Spam Account', 
      pfp_url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bc698287-5adc-4cc5-a503-de16963ed900/original',
      bio: 'Check out my amazing products! 🚀',
      last_active: Date.now() - (10 * 24 * 60 * 60 * 1000), 
      follower_count: 5000,
      following_count: 50,
      follows_back: false
    },
    { 
      fid: 789, 
      username: 'user789', 
      display_name: 'Another Inactive', 
      pfp_url: 'https://i.seadn.io/gae/sYAr036bd0bRpj7OX6B-F-MqLGznVkK3--DSneL_BT5GX4NZJ3Zu91PgjpD9-xuVJtHq0qirJfPZeMKrahz8Us2Tj_X8qdNPYC-imqs?w=500&auto=format',
      bio: 'Web3 enthusiast | NFT collector',
      last_active: Date.now() - (90 * 24 * 60 * 60 * 1000), 
      follower_count: 120,
      following_count: 80,
      follows_back: false
    }
  ]

  const analysis = {
    totalFollows: sampleUsers.length,
    inactiveUsers: 2,
    spamAccounts: 1,
    notFollowingBack: 3,
    veryInactiveUsers: 2,
    recommendations: sampleUsers.map(user => ({
      fid: user.fid,
      username: user.username,
      display_name: user.display_name,
      pfp_url: user.pfp_url,
      bio: user.bio,
      follower_count: user.follower_count,
      following_count: user.following_count,
      last_active: user.last_active,
      follows_back: user.follows_back,
      reason: user.last_active < Date.now() - (60 * 24 * 60 * 60 * 1000) 
        ? `Haven't casted in ${Math.floor((Date.now() - user.last_active) / (1000 * 60 * 60 * 24))} days`
        : 'Not following you back',
      days_inactive: Math.floor((Date.now() - user.last_active) / (1000 * 60 * 60 * 24))
    }))
  }

  return NextResponse.json(analysis)
} 