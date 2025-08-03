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

<<<<<<< HEAD
    const NEYNAR_API_KEY = process.env.neynar_api
    
    console.log('🔍 Starting scan for FID:', fid)
    console.log('🔑 Neynar API Key configured:', !!NEYNAR_API_KEY)
    
    if (!NEYNAR_API_KEY) {
      console.error('❌ Neynar API key not configured')
      return NextResponse.json(
        { error: 'Neynar API key not configured. Please check your environment variables.' },
=======
    const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY
    
    if (!NEYNAR_API_KEY) {
      return NextResponse.json(
        { error: 'Neynar API key not configured' },
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
        { status: 500 }
      )
    }

    // First, get the user's basic info to verify the FID
<<<<<<< HEAD
    console.log('👤 Fetching user info from Neynar...')
=======
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
    const userResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          'accept': 'application/json',
<<<<<<< HEAD
          'x-api-key': NEYNAR_API_KEY
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
=======
          'api_key': NEYNAR_API_KEY
        }
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
      }
    )

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
<<<<<<< HEAD
      console.error('❌ Neynar API error:', userResponse.status, errorText)
=======
      console.error('Neynar API error:', userResponse.status, errorText)
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
      
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
      
<<<<<<< HEAD
      // If Neynar API fails, return error
      return NextResponse.json(
        { error: 'Unable to connect to Farcaster data. Please try again later.' },
        { status: 503 }
      )
=======
      throw new Error(`Neynar API error: ${userResponse.status} - ${errorText}`)
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
    }

    const userData = await userResponse.json()
    const user = userData.users?.[0] as FarcasterUser
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

<<<<<<< HEAD
    console.log('✅ User info retrieved:', user.username)
    
    // Get the user's actual following list using the correct Neynar API endpoint
    console.log('📋 Fetching following list...')
    const followingResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/following?fid=${fid}&viewer_fid=${fid}&sort_type=desc_chron&limit=100`,
      {
        headers: {
          'accept': 'application/json',
          'x-api-key': NEYNAR_API_KEY
        },
        signal: AbortSignal.timeout(15000) // 15 second timeout
=======
    console.log('User info:', JSON.stringify(user, null, 2))
    
    // Get the user's actual following list
    const followingResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/user/following?fid=${fid}&limit=1000`,
      {
        headers: {
          'accept': 'application/json',
          'api_key': NEYNAR_API_KEY
        }
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
      }
    )

    if (!followingResponse.ok) {
      const errorText = await followingResponse.text()
<<<<<<< HEAD
      console.error('❌ Following API error:', followingResponse.status, errorText)
      
      // If following endpoint fails, return error
      return NextResponse.json(
        { error: 'Unable to fetch following data. Please try again later.' },
        { status: 503 }
      )
=======
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
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
    }

    const followingData = await followingResponse.json()
    const following = followingData.users || []
    
<<<<<<< HEAD
    console.log(`✅ Found ${following.length} users in following list`)

    // Get detailed info for all following users (in batches to avoid rate limits)
    if (following.length > 0) {
      console.log('🔍 Getting detailed user info...')
      
      // Process in batches of 50 to avoid rate limits
      const batchSize = 50
      const batches = []
      for (let i = 0; i < following.length; i += batchSize) {
        batches.push(following.slice(i, i + batchSize))
      }
      
      const allDetailedUsers: FarcasterUser[] = []
      
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        // Extract user data from the nested structure
        const users = batch.map((item: { user?: FarcasterUser } & FarcasterUser) => item.user || item)
        const fids = users.map((u: FarcasterUser) => u.fid).join(',')
        
        console.log(`📦 Processing batch ${i + 1}/${batches.length} (${batch.length} users)`)
        
        const bulkUserResponse = await fetch(
          `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`,
          {
            headers: {
              'accept': 'application/json',
              'x-api-key': NEYNAR_API_KEY
            },
            signal: AbortSignal.timeout(10000)
          }
        )

        if (bulkUserResponse.ok) {
          const bulkUserData = await bulkUserResponse.json()
          const detailedUsers = bulkUserData.users || []
          allDetailedUsers.push(...detailedUsers)
          console.log(`✅ Got detailed info for ${detailedUsers.length} users in batch ${i + 1}`)
        } else {
          console.error(`❌ Batch ${i + 1} failed:`, bulkUserResponse.status)
          // Continue with other batches
        }
        
        // Add small delay between batches to avoid rate limits
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      console.log(`✅ Total detailed users: ${allDetailedUsers.length}`)
      
      if (allDetailedUsers.length > 0) {
        // Analyze real following data with enhanced profile info
        return await analyzeRealFollowing(allDetailedUsers)
      }
    }

    // If no following found, return empty analysis
    console.log('⚠️ No following data found')
    return NextResponse.json({
      totalFollows: 0,
      inactiveUsers: 0,
      spamAccounts: 0,
      notFollowingBack: 0,
      veryInactiveUsers: 0,
      recommendations: [],
      message: 'No following data found. You may not be following anyone yet.'
    })



  } catch (error) {
    console.error('❌ Scan error:', error)
    
    // Check if it's a timeout or network error
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Network timeout. Please check your connection and try again.' },
          { status: 408 }
        )
      }
    }
    
=======
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
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
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

<<<<<<< HEAD
  console.log(`🔍 Analyzing ${following.length} users for recommendations`)

=======
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
  // For each following user, analyze their activity
  for (const follow of following) {
    const lastActive = follow.last_active || Date.now() - (30 * 24 * 60 * 60 * 1000) // Default to 30 days ago
    const daysSinceActive = (Date.now() - lastActive) / (1000 * 60 * 60 * 24)
    
<<<<<<< HEAD
    // Ensure we have a profile image - use DiceBear as fallback
    const profileImage = follow.pfp_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${follow.fid}`
    const bio = follow.profile?.bio?.text || 'No bio available'
    
    console.log(`📊 Analyzing ${follow.username} (${follow.fid}): ${daysSinceActive.toFixed(1)} days inactive`)
    
=======
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
    // Check for very inactive users (60+ days)
    if (daysSinceActive > 60) {
      analysis.veryInactiveUsers++
      analysis.recommendations.push({
        fid: follow.fid,
        username: follow.username,
        display_name: follow.display_name,
<<<<<<< HEAD
        pfp_url: profileImage,
        bio: bio,
=======
        pfp_url: follow.pfp_url,
        bio: follow.profile?.bio?.text || '',
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
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
<<<<<<< HEAD
          pfp_url: profileImage,
          bio: bio,
=======
          pfp_url: follow.pfp_url,
          bio: follow.profile?.bio?.text || '',
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
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
<<<<<<< HEAD
          pfp_url: profileImage,
          bio: bio,
=======
          pfp_url: follow.pfp_url,
          bio: follow.profile?.bio?.text || '',
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
          follower_count: follow.follower_count || 0,
          following_count: follow.following_count || 0,
          last_active: lastActive,
          follows_back: false,
          reason: `Inactive for ${Math.floor(daysSinceActive)} days`,
          days_inactive: Math.floor(daysSinceActive)
<<<<<<< HEAD
      })
=======
        })
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
      }
    }
  }

<<<<<<< HEAD
  // Sort recommendations by days inactive (most inactive first)
  analysis.recommendations.sort((a, b) => b.days_inactive - a.days_inactive)
  
  // Limit to top 10 recommendations
  analysis.recommendations = analysis.recommendations.slice(0, 10)

  console.log(`✅ Analysis complete: ${analysis.recommendations.length} recommendations found`)
  return NextResponse.json(analysis)
}

 
=======
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
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
