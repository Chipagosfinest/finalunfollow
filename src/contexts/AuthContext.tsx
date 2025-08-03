'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

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

// Define the Farcaster window interface
interface FarcasterWindow extends Window {
  farcaster?: {
    getUser?: () => Promise<{ fid?: number }>
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const signIn = async () => {
    try {
      setIsLoading(true)
      console.log('Starting real Farcaster authentication...')

      // Check if we're in a Mini App environment using the proper SDK method
      const isInMiniApp = await sdk.isInMiniApp()
      console.log('Mini App environment detected:', isInMiniApp)
      
      let userFid: number | null = null
      
      // Method 1: Try to use the official SDK signIn method
      if (isInMiniApp && sdk?.actions?.signIn) {
        try {
          console.log('Trying SDK signIn()...')
          const signInResult = await sdk.actions.signIn({ nonce: 'auth-nonce-' + Date.now() })
          console.log('SDK signIn result:', signInResult)
          
          // The signIn result might not contain FID directly, so we'll try other methods
          // to get the user FID after successful sign in
        } catch (error) {
          console.log('SDK signIn failed:', error)
        }
      }
      
      // Method 2: Try to get FID from window.farcaster in Mini App environment
      if (!userFid && isInMiniApp && typeof window !== 'undefined') {
        const farcasterWindow = window as FarcasterWindow
        if (farcasterWindow.farcaster?.getUser) {
          try {
            console.log('Trying window.farcaster.getUser()...')
            const userInfo = await farcasterWindow.farcaster.getUser()
            console.log('Window farcaster getUser result:', userInfo)
            if (userInfo && userInfo.fid) {
              userFid = userInfo.fid
            }
          } catch (error) {
            console.log('Window farcaster getUser failed:', error)
          }
        }
      }
      
      // Method 3: Try to get FID from URL parameters
      if (!userFid && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const fidParam = urlParams.get('fid')
        if (fidParam) {
          userFid = parseInt(fidParam)
          console.log('Got FID from URL parameter:', userFid)
        }
      }
      
      // Method 4: Try to get FID from localStorage (if previously stored)
      if (!userFid && typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('farcaster_user')
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            if (parsedUser.fid) {
              userFid = parsedUser.fid
              console.log('Got FID from localStorage:', userFid)
            }
          } catch (error) {
            console.log('Failed to parse stored user:', error)
          }
        }
      }
      
      // If we don't have a FID, show a user-friendly message instead of throwing an error
      if (!userFid) {
        console.log('No FID found, showing authentication prompt')
        // Don't throw an error - let the UI handle this gracefully
        setIsLoading(false)
        return
      }
      
      console.log('Using FID for authentication:', userFid)
      
      // Fetch user data using the FID
      const response = await fetch('/api/user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fid: userFid.toString() }),
      })

      if (response.ok) {
        const userData = await response.json()
        
        const realUser: User = {
          fid: userData.fid,
          username: userData.username,
          displayName: userData.display_name,
          pfpUrl: userData.pfp_url,
          bio: userData.profile?.bio?.text,
          followerCount: userData.follower_count,
          followingCount: userData.following_count
        }
        
        console.log('Setting real user:', realUser)
        setUser(realUser)
        localStorage.setItem('farcaster_user', JSON.stringify(realUser))
      } else {
        console.error('Failed to fetch user data from API')
        throw new Error('Failed to fetch user data')
      }
      
      console.log('Real authentication completed successfully')
    } catch (error) {
      console.error('Real sign in error:', error)
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
    const initializeAuth = async () => {
      try {
        // Check if we're in a Mini App environment
        const isInMiniApp = await sdk.isInMiniApp()
        console.log('AuthContext: Mini App environment detected:', isInMiniApp)
        
        // If we're in a Mini App, try to authenticate automatically
        if (isInMiniApp) {
          console.log('AuthContext: Attempting automatic authentication in Mini App...')
          await signIn()
        } else {
          // In regular web environment, just refresh stored user
          refreshUser()
        }
      } catch (error) {
        console.error('AuthContext: Initialization error:', error)
        // Fall back to refreshing stored user
        refreshUser()
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