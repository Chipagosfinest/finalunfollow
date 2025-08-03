'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useFarcaster } from "@/components/FarcasterProvider"
import Head from 'next/head'
import Image from 'next/image'

interface ScanResult {
  totalFollows: number
  inactiveUsers: number
  spamAccounts: number
  notFollowingBack: number
  veryInactiveUsers: number
<<<<<<< HEAD
  message?: string
=======
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
  recommendations: Array<{
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

export default function EmbedPage() {
  const { user, isAuthenticated, isLoading, signIn } = useAuth()
  const { isReady, isInMiniApp } = useFarcaster()
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isLoadingScan, setIsLoadingScan] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('EmbedPage: Component mounted')
    console.log('EmbedPage: isReady:', isReady)
    console.log('EmbedPage: isInMiniApp:', isInMiniApp)
    console.log('EmbedPage: isAuthenticated:', isAuthenticated)
    console.log('EmbedPage: isLoading:', isLoading)
  }, [isReady, isInMiniApp, isAuthenticated, isLoading])

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true)
      setError(null)
      console.log('EmbedPage: Starting sign in...')
      await signIn()
      console.log('EmbedPage: Sign in completed')
    } catch (error) {
      console.error('EmbedPage: Sign in failed:', error)
      setError('Sign in failed. Please try again.')
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleScan = async () => {
    if (!user) {
      setError('Please sign in first')
      return
    }

    setIsLoadingScan(true)
    setError(null)
    setScanResult(null)

    try {
<<<<<<< HEAD
      console.log('🔍 Starting scan for user:', user.username, 'FID:', user.fid)
      
=======
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fid: user.fid.toString() }),
      })

      const data = await response.json()

      if (!response.ok) {
<<<<<<< HEAD
        console.error('❌ Scan failed:', data.error)
        throw new Error(data.error || 'Failed to scan follows')
      }

      console.log('✅ Scan completed successfully:', data)
      setScanResult(data)
    } catch (err) {
      console.error('❌ Scan error:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
=======
        throw new Error(data.error || 'Failed to scan follows')
      }

      setScanResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
    } finally {
      setIsLoadingScan(false)
    }
  }

  const handleShare = () => {
    const shareText = `🔍 Unfollow Tool - Just cleaned up my Farcaster follows!

Found ${scanResult?.veryInactiveUsers || 0} inactive users and ${scanResult?.notFollowingBack || 0} who don&apos;t follow back. This tool is 🔥

<<<<<<< HEAD
Try it: https://unfollow.vercel.app/embed
=======
Try it: https://unfollow-tool.vercel.app/embed
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497

#farcaster #unfollow #tool`
    
    alert(`Share text copied to clipboard! You can now paste this in your Farcaster client:

${shareText}`)
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        console.log('Share text copied to clipboard')
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err)
      })
    }
  }

  return (
    <>
      <Head>
<<<<<<< HEAD
        {/* Farcaster Mini App Embed Metadata */}
        <meta property="fc:miniapp" content="https://unfollow-blxn2u2jj-chipagosfinests-projects.vercel.app" />
        <meta property="fc:miniapp:version" content="1.0.0" />
        <meta property="fc:miniapp:image" content="https://unfollow-blxn2u2jj-chipagosfinests-projects.vercel.app/embed-thumbnail.png" />
        <meta property="fc:miniapp:button" content="Analyze Follows" />
        <meta property="fc:miniapp:action" content="https://unfollow-blxn2u2jj-chipagosfinests-projects.vercel.app/embed" />
        
        {/* Farcaster Frame Metadata */}
        <meta property="fc:frame" content="https://unfollow-blxn2u2jj-chipagosfinests-projects.vercel.app" />
        <meta property="fc:frame:image" content="https://unfollow-blxn2u2jj-chipagosfinests-projects.vercel.app/embed-thumbnail.png" />
        <meta property="fc:frame:button:1" content="Analyze Follows" />
        <meta property="fc:frame:post_url" content="https://unfollow-blxn2u2jj-chipagosfinests-projects.vercel.app/embed" />
        
        {/* Open Graph Metadata */}
        <meta property="og:title" content="Unfollow Tool - Farcaster Mini App" />
        <meta property="og:description" content="Analyze your Farcaster follows and identify who to unfollow. Find inactive users, spam accounts, and users who don't follow you back." />
        <meta property="og:url" content="https://unfollow-blxn2u2jj-chipagosfinests-projects.vercel.app" />
        <meta property="og:site_name" content="Unfollow Tool" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://unfollow-blxn2u2jj-chipagosfinests-projects.vercel.app/embed-thumbnail.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Unfollow Tool - Farcaster Mini App" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Unfollow Tool - Farcaster Mini App" />
        <meta name="twitter:description" content="Analyze your Farcaster follows and identify who to unfollow. Find inactive users, spam accounts, and users who don't follow you back." />
        <meta name="twitter:image" content="https://unfollow-blxn2u2jj-chipagosfinests-projects.vercel.app/embed-thumbnail.png" />
=======
        <meta property="fc:miniapp" content="https://unfollow-tool.vercel.app" />
        <meta property="fc:miniapp:version" content="1.0.0" />
        <meta property="fc:miniapp:image" content="https://unfollow-tool.vercel.app/embed-thumbnail.png" />
        <meta property="fc:miniapp:button" content="Analyze Follows" />
        <meta property="fc:miniapp:action" content="https://unfollow-tool.vercel.app/embed" />
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
      </Head>

      {isLoading ? (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                🔍 Unfollow Tool
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Analyze your follows and identify who to unfollow
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Sign in to start analyzing your follows
                </p>
                <Button 
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  size="lg"
                >
                  {isSigningIn ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Sign in with Farcaster
                    </div>
                  )}
                </Button>
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : scanResult ? (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
          <div className="max-w-md mx-auto space-y-4">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🔍 Follow Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Analysis for @{user?.username}
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-red-600">{scanResult.veryInactiveUsers}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Inactive Users</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-orange-600">{scanResult.notFollowingBack}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Don&apos;t Follow Back</div>
              </Card>
            </div>

<<<<<<< HEAD
            {/* Status Message - Only show for empty results */}
            {scanResult.message && scanResult.recommendations.length === 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-blue-800 dark:text-blue-200">{scanResult.message}</span>
                </div>
              </div>
            )}

=======
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scanResult.recommendations.slice(0, 3).map((user) => (
                  <div key={user.fid} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Image 
                      src={user.pfp_url} 
                      alt={user.display_name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {user.display_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{user.username}
                      </div>
                      <div className="text-xs text-red-600 font-medium">
                        {user.reason.replace("'", "&apos;")}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleShare}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                size="lg"
              >
                📤 Share Results
              </Button>
              <Button 
<<<<<<< HEAD
                onClick={() => window.open('https://unfollow.vercel.app', '_blank')}
=======
                onClick={() => window.open('https://unfollow-tool.vercel.app', '_blank')}
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
                variant="outline"
                className="w-full py-3 px-6 rounded-lg transition-colors"
                size="lg"
              >
                View All Recommendations
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                🔍 Unfollow Tool
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Ready to analyze your follows?
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
                              {/* User Info */}
                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {user?.pfpUrl && (
                    <Image 
                      src={user.pfpUrl} 
                      alt={user.displayName || 'User'}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user?.displayName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      @{user?.username}
                    </div>
                  </div>
                </div>

              {/* Scan Button */}
              <Button 
                onClick={handleScan}
                disabled={isLoadingScan}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                size="lg"
              >
                {isLoadingScan ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Start Analysis
                  </div>
                )}
              </Button>

              {error && (
                <div className="text-red-600 text-sm text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
<<<<<<< HEAD
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Analysis Failed</span>
                  </div>
                  {error}
                  <div className="mt-2 text-xs text-red-500">
                    Please try again in a few moments
                  </div>
=======
                  {error}
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
                </div>
              )}

              {/* Open Full App */}
              <Button 
<<<<<<< HEAD
                onClick={() => window.open('https://unfollow.vercel.app', '_blank')}
=======
                onClick={() => window.open('https://unfollow-tool.vercel.app', '_blank')}
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
                variant="outline"
                className="w-full py-3 px-6 rounded-lg transition-colors"
                size="lg"
              >
                Open Full App
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
} 