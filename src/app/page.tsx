'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { LoginButton } from "@/components/LoginButton"
import { UserProfile } from "@/components/UserProfile"

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

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isLoadingScan, setIsLoadingScan] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [unfollowing, setUnfollowing] = useState<number[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [isUnfollowingAll, setIsUnfollowingAll] = useState(false)
  const usersPerPage = 10

  useEffect(() => {
    // Check for system preference
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(isDark)
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark')
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
    setSelectedUsers(new Set())
    setCurrentPage(1)

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

  const handleUnfollow = async (targetFid: number) => {
    setUnfollowing(prev => [...prev, targetFid])
    
    try {
      const response = await fetch('/api/unfollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetFid }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unfollow user')
      }

      // Remove the unfollowed user from recommendations
      if (scanResult) {
        setScanResult({
          ...scanResult,
          recommendations: scanResult.recommendations.filter(r => r.fid !== targetFid),
          totalFollows: scanResult.totalFollows - 1
        })
      }
      
      // Remove from selected users
      setSelectedUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(targetFid)
        return newSet
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unfollow user')
    } finally {
      setUnfollowing(prev => prev.filter(id => id !== targetFid))
    }
  }

  const handleUnfollowAll = async () => {
    if (selectedUsers.size === 0) return
    
    setIsUnfollowingAll(true)
    
    try {
      // Unfollow all selected users
      const unfollowPromises = Array.from(selectedUsers).map(fid => 
        fetch('/api/unfollow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ targetFid: fid }),
        })
      )
      
      await Promise.all(unfollowPromises)
      
      // Remove all unfollowed users from recommendations
      if (scanResult) {
        setScanResult({
          ...scanResult,
          recommendations: scanResult.recommendations.filter(r => !selectedUsers.has(r.fid)),
          totalFollows: scanResult.totalFollows - selectedUsers.size
        })
      }
      
      // Clear selected users
      setSelectedUsers(new Set())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unfollow users')
    } finally {
      setIsUnfollowingAll(false)
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

  const toggleUserSelection = (fid: number) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fid)) {
        newSet.delete(fid)
      } else {
        newSet.add(fid)
      }
      return newSet
    })
  }

  const selectAllOnPage = () => {
    if (!scanResult) return
    
    const startIndex = (currentPage - 1) * usersPerPage
    const endIndex = startIndex + usersPerPage
    const usersOnPage = scanResult.recommendations.slice(startIndex, endIndex)
    
    setSelectedUsers(prev => {
      const newSet = new Set(prev)
      usersOnPage.forEach(user => newSet.add(user.fid))
      return newSet
    })
  }

  const deselectAllOnPage = () => {
    if (!scanResult) return
    
    const startIndex = (currentPage - 1) * usersPerPage
    const endIndex = startIndex + usersPerPage
    const usersOnPage = scanResult.recommendations.slice(startIndex, endIndex)
    
    setSelectedUsers(prev => {
      const newSet = new Set(prev)
      usersOnPage.forEach(user => newSet.delete(user.fid))
      return newSet
    })
  }

  // Calculate pagination
  const totalPages = scanResult ? Math.ceil(scanResult.recommendations.length / usersPerPage) : 0
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = scanResult ? scanResult.recommendations.slice(startIndex, endIndex) : []

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="rounded-full w-10 h-10 p-0"
              >
                {darkMode ? '☀️' : '🌙'}
              </Button>
            </div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
              Unfollow Tool
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Sign in with Farcaster to analyze your follows
            </p>
          </div>

          {/* Login Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                Sign In
              </CardTitle>
              <CardDescription>
                Connect your Farcaster wallet to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div className="text-purple-500 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Welcome to Unfollow Tool
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Sign in with your Farcaster wallet to analyze your follows and identify who to unfollow
                </p>
                <LoginButton />
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Built with Next.js, Tailwind CSS, and shadcn/ui</p>
          </div>
        </div>
      </div>
    )
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="rounded-full w-10 h-10 p-0"
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Unfollow Tool
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Scan your Farcaster follows and identify who to unfollow
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Profile */}
          <UserProfile />

          {/* Scan Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Scan Your Follows
              </CardTitle>
              <CardDescription>
                Analyze your follows to find inactive and spam accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleScan}
                disabled={isLoadingScan}
              >
                {isLoadingScan ? 'Scanning...' : 'Start Scan'}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                Scan Results
              </CardTitle>
              <CardDescription>
                View your follow analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scanResult ? (
                <div className="space-y-3">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total Follows
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{scanResult.totalFollows}</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        60+ Days Inactive
                      </span>
                      <span className="text-xl font-bold text-orange-600 dark:text-orange-400">{scanResult.veryInactiveUsers}</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        Not Following Back
                      </span>
                      <span className="text-xl font-bold text-red-600 dark:text-red-400">{scanResult.notFollowingBack}</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        Spam Accounts
                      </span>
                      <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{scanResult.spamAccounts}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total Follows
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">0</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        60+ Days Inactive
                      </span>
                      <span className="text-xl font-bold text-orange-600 dark:text-orange-400">0</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        Not Following Back
                      </span>
                      <span className="text-xl font-bold text-red-600 dark:text-red-400">0</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        Spam Accounts
                      </span>
                      <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">0</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selection Controls */}
        {scanResult && scanResult.recommendations.length > 0 && (
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle>Selection Controls</CardTitle>
              <CardDescription>
                Manage your selections across all pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={selectAllOnPage}
                  >
                    Select All on Page
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={deselectAllOnPage}
                  >
                    Deselect All on Page
                  </Button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedUsers.size} users selected
                </div>
              </div>
              
              <div className="flex gap-3">
                {selectedUsers.size > 0 && (
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={handleUnfollowAll}
                    disabled={isUnfollowingAll}
                  >
                    {isUnfollowingAll ? 'Unfollowing...' : `Unfollow All Selected (${selectedUsers.size})`}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Section */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle>Detailed Recommendations</CardTitle>
            <CardDescription>
              Review each user with profile details and take action
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scanResult && scanResult.recommendations.length > 0 ? (
              <div className="space-y-4">
                {/* Pagination Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Showing {startIndex + 1}-{Math.min(endIndex, scanResult.recommendations.length)} of {scanResult.recommendations.length} users
                  </span>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                {/* User List */}
                {currentUsers.map((rec, index) => (
                  <div key={rec.fid} className="flex items-start gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    {/* Selection Checkbox */}
                    <div className="flex-shrink-0 mt-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(rec.fid)}
                        onChange={() => toggleUserSelection(rec.fid)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                      <img 
                        src={rec.pfp_url} 
                        alt={`${rec.display_name} profile`}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://i.seadn.io/gae/sYAr036bd0bRpj7OX6B-F-MqLGznVkK3--DSneL_BT5GX4NZJ3Zu91PgjpD9-xuVJtHq0qirJfPZeMKrahz8Us2Tj_X8qdNPYC-imqs?w=500&auto=format'
                        }}
                      />
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium dark:text-white truncate">
                          {rec.display_name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          @{rec.username}
                        </span>
                        {!rec.follows_back && (
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded">
                            Not Following Back
                          </span>
                        )}
                      </div>
                      
                      {rec.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {rec.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{rec.follower_count} followers</span>
                        <span>{rec.following_count} following</span>
                        <span>{rec.days_inactive} days inactive</span>
                      </div>
                      
                      <div className="mt-2">
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
                    
                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnfollow(rec.fid)}
                        disabled={unfollowing.includes(rec.fid)}
                      >
                        {unfollowing.includes(rec.fid) ? 'Unfollowing...' : 'Unfollow'}
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {scanResult ? 'No accounts to unfollow' : 'No recommendations yet'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {scanResult ? 'All your follows look good!' : 'Run a scan first to see recommendations'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with Next.js, Tailwind CSS, and shadcn/ui</p>
        </div>
      </div>
    </div>
  )
}
