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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const signIn = async () => {
    try {
      setIsLoading(true)
      
      console.log('Starting sign in process...')
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate wallet connection delay
      
      // Use mock data for preview/demo purposes
      const mockUser: User = {
        fid: 2,
        username: 'demo_user',
        displayName: 'Demo User',
        pfpUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Demo user for testing the unfollow tool',
        followerCount: 1250,
        followingCount: 890
      }
      
      console.log('Setting mock user:', mockUser)
      setUser(mockUser)
      
      // Store in localStorage for persistence
      localStorage.setItem('farcaster_user', JSON.stringify(mockUser))
      
      console.log('Sign in completed successfully')
    } catch (error) {
      console.error('Sign in error:', error)
      // Don't throw error, just log it and continue
      // This prevents the UI from breaking in preview
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