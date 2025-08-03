'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { sdk } from '@farcaster/miniapp-sdk'

export function LoginButton() {
  const { signIn, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isInMiniApp, setIsInMiniApp] = useState(false)

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        const miniApp = await sdk.isInMiniApp()
        setIsInMiniApp(miniApp)
      } catch (error) {
        console.error('Error checking environment:', error)
        setIsInMiniApp(false)
      }
    }
    checkEnvironment()
  }, [])

  const handleSignIn = async () => {
    try {
      setError(null)
      await signIn()
    } catch (error) {
      console.error('Sign in failed:', error)
      setError('Sign in failed. Please try again.')
    }
  }

  return (
    <div className="w-full">
      <Button 
        onClick={handleSignIn}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {isInMiniApp ? 'Connecting...' : 'Connecting...'}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {isInMiniApp ? 'Continue with Farcaster' : 'Sign in with Farcaster'}
          </div>
        )}
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  )
} 