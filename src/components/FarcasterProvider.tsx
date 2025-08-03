'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface FarcasterContextType {
  isReady: boolean
  error: string | null
}

const FarcasterContext = createContext<FarcasterContextType | undefined>(undefined)

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('FarcasterProvider: Starting initialization with official SDK...')
    
    const initializeFarcaster = async () => {
      try {
        // Check if we're in a Farcaster environment
        if (typeof window !== 'undefined') {
          console.log('FarcasterProvider: Window object available')
          
          // Check if we're in a Farcaster mini app environment
          const isInFarcaster = window.location.hostname.includes('farcaster') || 
                               window.location.hostname.includes('warpcast') ||
                               window.location.hostname.includes('vercel.app') ||
                               document.referrer.includes('farcaster') ||
                               document.referrer.includes('warpcast')
          
          console.log('FarcasterProvider: In Farcaster environment:', isInFarcaster)
          
          // Use the official SDK
          if (sdk?.actions?.ready) {
            console.log('FarcasterProvider: Official SDK found, calling ready()...')
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK ready() called successfully')
              setIsReady(true)
            } catch (err) {
              console.error('Error calling Farcaster SDK ready():', err)
              setError(err instanceof Error ? err.message : 'Failed to call ready()')
              // Still mark as ready to prevent splash screen from persisting
              setIsReady(true)
            }
          } else {
            console.log('FarcasterProvider: Official SDK not available, marking as ready')
            setIsReady(true)
          }
        } else {
          // Not in browser environment
          console.log('FarcasterProvider: Not in browser environment, marking as ready')
          setIsReady(true)
        }
      } catch (err) {
        console.error('FarcasterProvider: Farcaster SDK initialization error:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize Farcaster SDK')
        // Still mark as ready to prevent splash screen from persisting
        console.log('FarcasterProvider: Setting ready state to true despite error')
        setIsReady(true)
      }
    }

    // Initialize immediately
    initializeFarcaster()
  }, [])

  const value: FarcasterContextType = {
    isReady,
    error
  }

  return (
    <FarcasterContext.Provider value={value}>
      {children}
    </FarcasterContext.Provider>
  )
}

export function useFarcaster() {
  const context = useContext(FarcasterContext)
  if (context === undefined) {
    throw new Error('useFarcaster must be used within a FarcasterProvider')
  }
  return context
} 