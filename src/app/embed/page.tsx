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

  // Show sign in prompt
  if (!isAuthenticated) {
    return (
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
                onClick={() => window.open('https://unfollow.vercel.app', '_blank')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Open Full App
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show scan results
  if (scanResult) {
    return (
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

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scanResult.recommendations.slice(0, 3).map((user, index) => (
                <div key={user.fid} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <img 
                    src={user.pfp_url} 
                    alt={user.display_name}
                    className="w-10 h-10 rounded-full"
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
              onClick={() => window.open('https://unfollow.vercel.app', '_blank')}
              variant="outline"
              className="w-full py-3 px-6 rounded-lg transition-colors"
              size="lg"
            >
              View All Recommendations
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show scan prompt
  return (
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
            <img 
              src={user?.pfpUrl} 
              alt={user?.displayName}
              className="w-12 h-12 rounded-full"
            />
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
              {error}
            </div>
          )}

          {/* Open Full App */}
          <Button 
            onClick={() => window.open('https://unfollow.vercel.app', '_blank')}
            variant="outline"
            className="w-full py-3 px-6 rounded-lg transition-colors"
            size="lg"
          >
            Open Full App
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 