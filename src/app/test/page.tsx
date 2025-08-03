'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useFarcaster } from '@/components/FarcasterProvider'
import { sdk } from '@farcaster/miniapp-sdk'

interface DebugInfo {
  timestamp: string
  userAgent: string
  url: string
  isInFarcaster: boolean
  windowFarcasterUser?: unknown
  windowFarcasterError?: unknown
}

interface SdkInfo {
  sdk: boolean
  sdkActions: string[]
  windowFarcaster: boolean
  url: string
  referrer: string
}

export default function TestPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isReady, error: farcasterError } = useFarcaster()
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)

  useEffect(() => {
    const gatherDebugInfo = async (): Promise<void> => {
      const info: DebugInfo = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        isInFarcaster: window.location.hostname.includes('farcaster') || 
                       window.location.hostname.includes('warpcast') ||
                       document.referrer.includes('farcaster') ||
                       document.referrer.includes('warpcast'),
      }

      // Try to get user info from window.farcaster
      if (typeof window !== 'undefined' && (window as unknown as { farcaster?: { getUser?: () => Promise<unknown> } }).farcaster?.getUser) {
        try {
          const userInfo = await (window as unknown as { farcaster?: { getUser?: () => Promise<unknown> } }).farcaster!.getUser!()
          info.windowFarcasterUser = userInfo
        } catch (error) {
          info.windowFarcasterError = error
        }
      }

      setDebugInfo(info)
    }

    gatherDebugInfo()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
        
        <div className="grid gap-6">
          {/* Authentication Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
            </div>
          </div>

          {/* Farcaster SDK Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Farcaster SDK Status</h2>
            <div className="space-y-2">
              <p><strong>Ready:</strong> {isReady ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {farcasterError || 'None'}</p>
            </div>
          </div>

          {/* Debug Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          {/* Test Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-4">
              <button 
                onClick={() => {
                  const info: SdkInfo = {
                    sdk: !!sdk,
                    sdkActions: sdk?.actions ? Object.keys(sdk.actions) : [],
                    windowFarcaster: !!(window as unknown as { farcaster?: unknown }).farcaster,
                    url: window.location.href,
                    referrer: document.referrer,
                  }
                  console.log('Debug info:', info)
                  alert('Check console for debug info')
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Log Debug Info
              </button>
              
              <button 
                onClick={async () => {
                  try {
                    if (sdk?.actions?.signIn) {
                      const result = await sdk.actions.signIn({ nonce: 'test-nonce-' + Date.now() })
                      alert(`SDK signIn result: ${JSON.stringify(result)}`)
                    } else {
                      alert('SDK signIn not available')
                    }
                  } catch (error) {
                    alert(`SDK signIn error: ${error}`)
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Test SDK signIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 