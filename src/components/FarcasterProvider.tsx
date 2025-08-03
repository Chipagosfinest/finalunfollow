'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface FarcasterContextType {
  isReady: boolean
  error: string | null
}

interface FarcasterSDK {
  actions?: {
    ready?: () => Promise<void>
  }
}

interface WindowWithFarcaster extends Window {
  farcaster?: FarcasterSDK
}

const FarcasterContext = createContext<FarcasterContextType | undefined>(undefined)

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('FarcasterProvider: Starting initialization...')
    
    let isInitialized = false
    
    const initializeFarcaster = async () => {
      if (isInitialized) return
      isInitialized = true
      
      try {
        // Check if we're in a Farcaster environment
        if (typeof window !== 'undefined') {
          const farcasterWindow = window as WindowWithFarcaster
          
          console.log('FarcasterProvider: Window object available')
          console.log('FarcasterProvider: farcaster object:', farcasterWindow.farcaster)
          
          // Function to check and call ready()
          const checkAndCallReady = async (): Promise<boolean> => {
            const sdk = farcasterWindow.farcaster
            
            console.log('FarcasterProvider: Checking SDK...', sdk)
            
            if (sdk?.actions?.ready) {
              console.log('FarcasterProvider: SDK ready method found, calling...')
              try {
                await sdk.actions.ready()
                console.log('Farcaster SDK ready() called successfully')
                return true
              } catch (err) {
                console.error('Error calling Farcaster SDK ready():', err)
                return false
              }
            } else {
              console.log('FarcasterProvider: SDK ready method not available')
              return false
            }
          }

          // Try to call ready() immediately
          let success = await checkAndCallReady()
          
          // If not successful, retry with exponential backoff
          if (!success) {
            console.log('FarcasterProvider: Initial ready() call failed, starting retry logic...')
            let retryCount = 0
            const maxRetries = 20 // Increased retries
            
            while (!success && retryCount < maxRetries) {
              retryCount++
              const delay = Math.min(25 * Math.pow(2, retryCount - 1), 500) // Faster retries, max 500ms
              
              console.log(`FarcasterProvider: Retrying Farcaster SDK ready() call (attempt ${retryCount}/${maxRetries})`)
              await new Promise(resolve => setTimeout(resolve, delay))
              
              success = await checkAndCallReady()
            }
            
            if (!success) {
              console.warn('FarcasterProvider: Farcaster SDK ready() could not be called after retries')
            }
          }
          
          console.log('FarcasterProvider: Setting ready state to true')
          setIsReady(true)
        } else {
          // Not in Farcaster environment, still mark as ready
          console.log('FarcasterProvider: Not in Farcaster environment, proceeding normally')
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

    // Multiple strategies to ensure SDK is initialized
    
    // Strategy 1: Immediate check
    if (typeof window !== 'undefined') {
      const farcasterWindow = window as WindowWithFarcaster
      
      if (farcasterWindow.farcaster) {
        console.log('FarcasterProvider: SDK already available, initializing immediately')
        initializeFarcaster()
      } else {
        console.log('FarcasterProvider: SDK not available, setting up detection strategies')
        
        // Strategy 2: Polling
        const pollInterval = setInterval(() => {
          if (farcasterWindow.farcaster && !isReady) {
            console.log('FarcasterProvider: SDK detected via polling')
            clearInterval(pollInterval)
            initializeFarcaster()
          }
        }, 50) // Check every 50ms
        
        // Strategy 3: Mutation observer
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && farcasterWindow.farcaster && !isReady) {
              console.log('FarcasterProvider: SDK detected via mutation observer')
              observer.disconnect()
              clearInterval(pollInterval)
              initializeFarcaster()
            }
          })
        })
        
        // Start observing
        observer.observe(document.head, {
          childList: true,
          subtree: true
        })
        
        // Strategy 4: Delayed initialization
        setTimeout(() => {
          if (!isReady) {
            console.log('FarcasterProvider: Attempting delayed initialization')
            initializeFarcaster()
          }
        }, 100)
        
        // Strategy 5: Final fallback
        setTimeout(() => {
          if (!isReady) {
            console.log('FarcasterProvider: Final fallback initialization')
            clearInterval(pollInterval)
            observer.disconnect()
            initializeFarcaster()
          }
        }, 2000)
        
        // Cleanup after 10 seconds
        setTimeout(() => {
          clearInterval(pollInterval)
          observer.disconnect()
        }, 10000)
      }
    } else {
      // Not in browser environment
      setIsReady(true)
    }
  }, [isReady])

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