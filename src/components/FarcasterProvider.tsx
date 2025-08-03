'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface FarcasterContextType {
  isReady: boolean
  error: string | null
  context: Awaited<typeof sdk.context> | null
  safeAreaInsets: Awaited<typeof sdk.context>['client']['safeAreaInsets'] | null
  features: Awaited<typeof sdk.context>['features'] | null
  isInMiniApp: boolean
}

const FarcasterContext = createContext<FarcasterContextType | undefined>(undefined)

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [context, setContext] = useState<Awaited<typeof sdk.context> | null>(null)
  const [safeAreaInsets, setSafeAreaInsets] = useState<Awaited<typeof sdk.context>['client']['safeAreaInsets'] | null>(null)
  const [features, setFeatures] = useState<Awaited<typeof sdk.context>['features'] | null>(null)
  const [isInMiniApp, setIsInMiniApp] = useState(false)

  useEffect(() => {
    console.log('FarcasterProvider: Starting initialization with official SDK...')
    
    const initializeFarcaster = async () => {
      try {
        // Always try to call ready() if SDK is available
        if (sdk?.actions?.ready) {
          console.log('FarcasterProvider: Calling SDK ready()...')
          try {
            await sdk.actions.ready()
            console.log('Farcaster SDK ready() called successfully')
          } catch (err) {
            console.error('Error calling Farcaster SDK ready():', err)
            setError(err instanceof Error ? err.message : 'Failed to call ready()')
          }
        }
        
        // Check if we're in a Farcaster mini app environment
        const miniAppCheck = await sdk.isInMiniApp()
        console.log('FarcasterProvider: Mini App environment detected:', miniAppCheck)
        setIsInMiniApp(miniAppCheck)
        
        if (miniAppCheck) {
          // We're in a Mini App environment, get context information
          const sdkContext = await sdk.context
          console.log('FarcasterProvider: SDK Context:', sdkContext)
          setContext(sdkContext)
          
          // Get safe area insets for mobile
          if (sdkContext.client?.safeAreaInsets) {
            console.log('FarcasterProvider: Safe area insets:', sdkContext.client.safeAreaInsets)
            setSafeAreaInsets(sdkContext.client.safeAreaInsets)
          }
          
          // Get available features
          if (sdkContext.features) {
            console.log('FarcasterProvider: Available features:', sdkContext.features)
            setFeatures(sdkContext.features)
          }
        }
        
        // Always mark as ready
        setIsReady(true)
      } catch (err) {
        console.error('FarcasterProvider: Initialization error:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize Farcaster SDK')
        // Still mark as ready to prevent splash screen from persisting
        setIsReady(true)
      }
    }
    
    initializeFarcaster()
  }, [])

  const value: FarcasterContextType = {
    isReady,
    error,
    context,
    safeAreaInsets,
    features,
    isInMiniApp
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