'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

interface ScanResult {
  totalFollows: number
  inactiveUsers: number
  spamAccounts: number
  notFollowingBack: number
  veryInactiveUsers: number
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
  const { user, isAuthenticated, isLoading } = useAuth()
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isLoadingScan, setIsLoadingScan] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async () => {
    if (!user) {
      setError('Please sign in first')
      return
    }

    setIsLoadingScan(true)
    setError(null)
    setScanResult(null)

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fid: user.fid.toString() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scan follows')
      }

      setScanResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoadingScan(false)
    }
  }

  const handleShare = () => {
    const shareText = `🔍 Unfollow Tool - Just cleaned up my Farcaster follows!

Found ${scanResult?.veryInactiveUsers || 0} inactive users and ${scanResult?.notFollowingBack || 0} who don't follow back. This tool is 🔥

Try it: https://unfollow.vercel.app/embed

#farcaster #unfollow #tool`
    
    // For mini app experience, show a success message instead of opening external tab
    alert(`Share text copied to clipboard! You can now paste this in your Farcaster client:

${shareText}`)
    
    // Copy to clipboard if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        console.log('Share text copied to clipboard')
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err)
      })
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Unfollow Tool
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Unfollow on Farcaster - Sign in to analyze your follows
            </p>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Sign In Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Connect your Farcaster wallet to analyze your follows and identify who to unfollow.
              </p>
              <Button 
                className="w-full"
                onClick={() => window.open('https://unfollow.vercel.app', '_blank')}
              >
                Open Full App
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src={user?.pfpUrl} 
              alt={`${user?.displayName} profile`}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://i.seadn.io/gae/sYAr036bd0bRpj7OX6B-F-MqLGznVkK3--DSneL_BT5GX4NZJ3Zu91PgjpD9-xuVJtHq0qirJfPZeMKrahz8Us2Tj_X8qdNPYC-imqs?w=500&auto=format'
              }}
            />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Unfollow Analysis
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            @{user?.username} • {user?.followingCount.toLocaleString()} following
          </p>
        </div>

        {/* Scan Button */}
        <Card className="shadow-lg mb-4">
          <CardContent className="p-4">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 mb-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            <Button 
              className="w-full" 
              onClick={handleScan}
              disabled={isLoadingScan}
            >
              {isLoadingScan ? 'Analyzing...' : 'Analyze My Follows'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {scanResult && (
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        {scanResult.veryInactiveUsers}
                      </div>
                      <div className="text-xs text-orange-700 dark:text-orange-300">
                        60+ Days Inactive
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600 dark:text-red-400">
                        {scanResult.notFollowingBack}
                      </div>
                      <div className="text-xs text-red-700 dark:text-red-300">
                        Not Following Back
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      {scanResult.spamAccounts}
                    </div>
                    <div className="text-xs text-yellow-700 dark:text-yellow-300">
                      Spam Accounts
                    </div>
                  </div>
                </div>
                
                {/* Share Button */}
                <Button 
                  onClick={handleShare}
                  className="w-full flex items-center gap-2"
                  variant="outline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Results
                </Button>
              </CardContent>
            </Card>

            {/* Top Recommendations */}
            {scanResult.recommendations.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Top Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scanResult.recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                        <img 
                          src={rec.pfp_url} 
                          alt={`${rec.display_name} profile`}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://i.seadn.io/gae/sYAr036bd0bRpj7OX6B-F-MqLGznVkK3--DSneL_BT5GX4NZJ3Zu91PgjpD9-xuVJtHq0qirJfPZeMKrahz8Us2Tj_X8qdNPYC-imqs?w=500&auto=format'
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium dark:text-white truncate">
                              {rec.display_name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              @{rec.username}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              rec.reason.includes('60+') || rec.reason.includes('Haven\'t casted') 
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                : rec.reason.includes('Not following') 
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                            }`}>
                              {rec.reason}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                                      <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://unfollow.vercel.app', '_blank')}
                  >
                    View All ({scanResult.recommendations.length})
                  </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
                      <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://unfollow.vercel.app', '_blank')}
            >
              Open Full App
            </Button>
        </div>
      </div>
    </div>
  )
} 