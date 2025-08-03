'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { useFarcaster } from "@/components/FarcasterProvider"
import { sdk } from '@farcaster/miniapp-sdk'

export default function TestPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isReady, error: farcasterError } = useFarcaster()
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const gatherDebugInfo = async () => {
      const info: any = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        hostname: window.location.hostname,
        referrer: document.referrer,
        isInFarcaster: window.location.hostname.includes('farcaster') || 
                       window.location.hostname.includes('warpcast') ||
                       document.referrer.includes('farcaster') ||
                       document.referrer.includes('warpcast'),
        sdkAvailable: !!sdk,
        sdkActions: sdk?.actions ? Object.keys(sdk.actions) : [],
        windowFarcaster: !!(window as any).farcaster,
        localStorage: typeof window !== 'undefined' ? localStorage.getItem('farcaster_user') : null,
      }

      // Try to get user info from SDK
      if (sdk?.actions?.getUser) {
        try {
          const userInfo = await sdk.actions.getUser()
          info.sdkUserInfo = userInfo
        } catch (error) {
          info.sdkUserError = error
        }
      }

      // Try to get user info from window.farcaster
      if ((window as any).farcaster?.getUser) {
        try {
          const userInfo = await (window as any).farcaster.getUser()
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
                  const info = {
                    sdk: !!sdk,
                    sdkActions: sdk?.actions ? Object.keys(sdk.actions) : [],
                    windowFarcaster: !!(window as any).farcaster,
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
                    if (sdk?.actions?.getUser) {
                      const user = await sdk.actions.getUser()
                      alert(`SDK getUser result: ${JSON.stringify(user)}`)
                    } else {
                      alert('SDK getUser not available')
                    }
                  } catch (error) {
                    alert(`SDK getUser error: ${error}`)
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded ml-2"
              >
                Test SDK getUser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 