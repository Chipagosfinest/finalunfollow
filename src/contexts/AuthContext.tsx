'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface User {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
  bio?: string
  followerCount?: number
  followingCount?: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => void
  refreshUser: () => Promise<void>
  context: Awaited<typeof sdk.context> | null
  location: Awaited<typeof sdk.context>['location'] | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [context, setContext] = useState<Awaited<typeof sdk.context> | null>(null)
  const [location, setLocation] = useState<Awaited<typeof sdk.context>['location'] | null>(null)

  const isAuthenticated = !!user

  // Set up SDK event listeners
  useEffect(() => {
    const setupEventListeners = () => {
      // Listen for when user adds/removes your app
      // Note: These events may not be available in the current SDK version
      /*
      sdk.on('miniappAdded', () => {
        console.log('User added the mini app')
        // Refresh user data when app is added
        refreshUser()
      })

      sdk.on('miniappRemoved', () => {
        console.log('User removed the mini app')
        // Clear user data when app is removed
        setUser(null)
      })

      // Listen for notification permission changes
      sdk.on('notificationsEnabled', () => {
        console.log('User enabled notifications')
      })

      sdk.on('notificationsDisabled', () => {
        console.log('User disabled notifications')
      })
      */

      // Cleanup function
      return () => {
        // sdk.removeAllListeners()
      }
    }

    const cleanup = setupEventListeners()
    return cleanup
  }, [])

  const signIn = async () => {
    try {
      setIsLoading(true)
      console.log('Starting Farcaster authentication...')

      // Check if we're in a Mini App environment
      const isInMiniApp = await sdk.isInMiniApp()
      console.log('Mini App environment detected:', isInMiniApp)
      
      if (!isInMiniApp) {
        console.log('Not in Mini App environment, using web authentication')
        // For web version, we'll use a demo user or prompt for FID
        const demoUser: User = {
          fid: 1, // Demo FID
          username: 'demo_user',
          displayName: 'Demo User',
          pfpUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
        }
        setUser(demoUser)
        localStorage.setItem('farcaster_user', JSON.stringify(demoUser))
        setIsLoading(false)
        return
      }

      // Get context information from SDK
      const sdkContext = await sdk.context
      console.log('SDK Context:', sdkContext)
      setContext(sdkContext)
      setLocation(sdkContext.location)

      // Get user information from SDK context
      const userInfo = sdkContext.user
      console.log('User info from SDK:', userInfo)

      if (!userInfo?.fid) {
        console.log('No user FID found in SDK context')
        setIsLoading(false)
        return
      }

      // Create user object from SDK context
      const sdkUser: User = {
        fid: userInfo.fid,
        username: userInfo.username,
        displayName: userInfo.displayName,
        pfpUrl: userInfo.pfpUrl
      }

      // Try to get additional user data from API if available
      try {
        const response = await fetch('/api/user-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fid: userInfo.fid.toString() }),
        })

        if (response.ok) {
          const userData = await response.json()
          
          const fullUser: User = {
            fid: userData.fid,
            username: userData.username || userInfo.username,
            displayName: userData.display_name || userInfo.displayName,
            pfpUrl: userData.pfp_url || userInfo.pfpUrl,
            bio: userData.profile?.bio?.text,
            followerCount: userData.follower_count,
            followingCount: userData.following_count
          }
          
          console.log('Setting full user data:', fullUser)
          setUser(fullUser)
          localStorage.setItem('farcaster_user', JSON.stringify(fullUser))
        } else {
          // Fall back to SDK user data
          console.log('API call failed, using SDK user data')
          setUser(sdkUser)
          localStorage.setItem('farcaster_user', JSON.stringify(sdkUser))
        }
      } catch (error) {
        console.log('API call error, using SDK user data:', error)
        setUser(sdkUser)
        localStorage.setItem('farcaster_user', JSON.stringify(sdkUser))
      }
      
      console.log('Authentication completed successfully')
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('farcaster_user')
  }

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      
      // Check if we're in a Mini App environment
      const isInMiniApp = await sdk.isInMiniApp()
      
      if (isInMiniApp) {
        // In Mini App environment, get user from SDK context
        const sdkContext = await sdk.context
        const userInfo = sdkContext.user
        
        if (userInfo?.fid) {
          const sdkUser: User = {
            fid: userInfo.fid,
            username: userInfo.username,
            displayName: userInfo.displayName,
            pfpUrl: userInfo.pfpUrl
          }
          
          // Try to get additional data from API
          try {
            const response = await fetch('/api/user-info', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ fid: userInfo.fid.toString() }),
            })

            if (response.ok) {
              const userData = await response.json()
              
              const fullUser: User = {
                fid: userData.fid,
                username: userData.username || userInfo.username,
                displayName: userData.display_name || userInfo.displayName,
                pfpUrl: userData.pfp_url || userInfo.pfpUrl,
                bio: userData.profile?.bio?.text,
                followerCount: userData.follower_count,
                followingCount: userData.following_count
              }
              
              setUser(fullUser)
              localStorage.setItem('farcaster_user', JSON.stringify(fullUser))
            } else {
              setUser(sdkUser)
              localStorage.setItem('farcaster_user', JSON.stringify(sdkUser))
            }
          } catch (error) {
            setUser(sdkUser)
            localStorage.setItem('farcaster_user', JSON.stringify(sdkUser))
          }
        }
      } else {
        // In web environment, try to get stored user
        const storedUser = localStorage.getItem('farcaster_user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing authentication...')
        
        // Check if we're in a Mini App environment
        const isInMiniApp = await sdk.isInMiniApp()
        console.log('AuthContext: Mini App environment detected:', isInMiniApp)
        
        if (isInMiniApp) {
          // In Mini App environment, get context and user info
          const sdkContext = await sdk.context
          console.log('AuthContext: SDK Context:', sdkContext)
          setContext(sdkContext)
          setLocation(sdkContext.location)
          
          const userInfo = sdkContext.user
          console.log('AuthContext: User info from SDK:', userInfo)
          
          if (userInfo?.fid) {
            const sdkUser: User = {
              fid: userInfo.fid,
              username: userInfo.username,
              displayName: userInfo.displayName,
              pfpUrl: userInfo.pfpUrl
            }
            
            // Try to get additional data from API
            try {
              const response = await fetch('/api/user-info', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fid: userInfo.fid.toString() }),
              })

              if (response.ok) {
                const userData = await response.json()
                
                const fullUser: User = {
                  fid: userData.fid,
                  username: userData.username || userInfo.username,
                  displayName: userData.display_name || userInfo.displayName,
                  pfpUrl: userData.pfp_url || userInfo.pfpUrl,
                  bio: userData.profile?.bio?.text,
                  followerCount: userData.follower_count,
                  followingCount: userData.following_count
                }
                
                console.log('AuthContext: Setting full user data:', fullUser)
                setUser(fullUser)
                localStorage.setItem('farcaster_user', JSON.stringify(fullUser))
              } else {
                setUser(sdkUser)
                localStorage.setItem('farcaster_user', JSON.stringify(sdkUser))
              }
            } catch {
              console.log('AuthContext: API call error, using SDK user data')
              setUser(sdkUser)
              localStorage.setItem('farcaster_user', JSON.stringify(sdkUser))
            }
          }
        } else {
          // In web environment, try to get stored user
          const storedUser = localStorage.getItem('farcaster_user')
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          }
        }
      } catch (error) {
        console.error('AuthContext: Initialization error:', error)
        // Fall back to refreshing stored user
        const storedUser = localStorage.getItem('farcaster_user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    refreshUser,
    context,
    location
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 