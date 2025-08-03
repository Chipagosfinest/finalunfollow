'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
  bio?: string
  followerCount: number
  followingCount: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface FarcasterSDK {
  actions?: {
    getUser?: () => Promise<{ fid: number; username?: string }>
    ready?: () => Promise<void>
  }
}

interface WindowWithFarcaster extends Window {
  farcaster?: FarcasterSDK
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const signIn = async () => {
    try {
      setIsLoading(true)
      
      // Check if we're in a Farcaster mini app environment
      if (typeof window !== 'undefined') {
        const farcasterWindow = window as WindowWithFarcaster
        const sdk = farcasterWindow.farcaster
        
        // Get the authenticated user's FID from the Farcaster SDK
        if (sdk?.actions?.getUser) {
          const userData = await sdk.actions.getUser()
          console.log('Farcaster user data:', userData)
          
          if (userData && userData.fid) {
            // Fetch detailed user info from Neynar API
            const response = await fetch('/api/user-info', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ fid: userData.fid }),
            })

            if (!response.ok) {
              throw new Error('Failed to fetch user data')
            }

            const neynarUserData = await response.json()
            
            const mockUser: User = {
              fid: neynarUserData.fid,
              username: neynarUserData.username,
              displayName: neynarUserData.display_name,
              pfpUrl: neynarUserData.pfp_url,
              bio: neynarUserData.profile?.bio?.text,
              followerCount: neynarUserData.follower_count,
              followingCount: neynarUserData.following_count
            }
            
            setUser(mockUser)
            localStorage.setItem('farcaster_user', JSON.stringify(mockUser))
            return
          }
        }
      }
      
      // Fallback: Simulate Farcaster wallet connection
      console.log('Falling back to simulated authentication')
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate wallet connection delay
      
      // For demo purposes, we'll use a different FID to avoid conflicts
      const userFid = 2 // Using a different FID for demo
      
      // Fetch user data from Neynar API
      const response = await fetch('/api/user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fid: userFid }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await response.json()
      
      const mockUser: User = {
        fid: userData.fid,
        username: userData.username,
        displayName: userData.display_name,
        pfpUrl: userData.pfp_url,
        bio: userData.profile?.bio?.text,
        followerCount: userData.follower_count,
        followingCount: userData.following_count
      }
      
      setUser(mockUser)
      
      // Store in localStorage for persistence
      localStorage.setItem('farcaster_user', JSON.stringify(mockUser))
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
      
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem('farcaster_user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    refreshUser
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