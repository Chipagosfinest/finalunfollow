'use client'

import { useEffect, useState } from 'react'
import { useFarcaster } from '@/components/FarcasterProvider'

export default function TestPage() {
  const { isReady, error } = useFarcaster()
  const [sdkInfo, setSdkInfo] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const farcasterWindow = window as any
      
      // Add logs to track what's happening
      const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
      }
      
      addLog('Checking for Farcaster SDK...')
      addLog(`Window object: ${typeof window}`)
      addLog(`Farcaster object: ${farcasterWindow.farcaster}`)
      addLog(`Hostname: ${window.location.hostname}`)
      addLog(`User Agent: ${navigator.userAgent}`)
      
      setSdkInfo({
        farcaster: farcasterWindow.farcaster,
        hasActions: !!farcasterWindow.farcaster?.actions,
        hasReady: !!farcasterWindow.farcaster?.actions?.ready,
        userAgent: navigator.userAgent,
        hostname: window.location.hostname,
        isFarcasterEnv: window.location.hostname.includes('warpcast') || 
                        window.location.hostname.includes('farcaster') ||
                        window.location.hostname.includes('localhost')
      })
      
      // Simulate Farcaster SDK for local testing
      if (!farcasterWindow.farcaster && window.location.hostname.includes('localhost')) {
        addLog('Simulating Farcaster SDK for local testing...')
        
        // Create a mock Farcaster SDK
        farcasterWindow.farcaster = {
          actions: {
            ready: async () => {
              addLog('Mock SDK ready() called')
              return Promise.resolve()
            },
            getUser: async () => {
              addLog('Mock SDK getUser() called')
              return Promise.resolve({ fid: 2, username: 'testuser' })
            }
          }
        }
        
        addLog('Mock Farcaster SDK created')
        
        // Update SDK info
        setSdkInfo({
          farcaster: farcasterWindow.farcaster,
          hasActions: !!farcasterWindow.farcaster?.actions,
          hasReady: !!farcasterWindow.farcaster?.actions?.ready,
          userAgent: navigator.userAgent,
          hostname: window.location.hostname,
          isFarcasterEnv: true,
          isMock: true
        })
      }
    }
  }, [])

  const simulateSDK = () => {
    if (typeof window !== 'undefined') {
      const farcasterWindow = window as any
      
      if (!farcasterWindow.farcaster) {
        farcasterWindow.farcaster = {
          actions: {
            ready: async () => {
              setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: Mock SDK ready() called`])
              return Promise.resolve()
            },
            getUser: async () => {
              setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: Mock SDK getUser() called`])
              return Promise.resolve({ fid: 2, username: 'testuser' })
            }
          }
        }
        
        setSdkInfo({
          farcaster: farcasterWindow.farcaster,
          hasActions: !!farcasterWindow.farcaster?.actions,
          hasReady: !!farcasterWindow.farcaster?.actions?.ready,
          userAgent: navigator.userAgent,
          hostname: window.location.hostname,
          isFarcasterEnv: true,
          isMock: true
        })
        
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: Mock SDK manually created`])
        
        // Trigger a page reload to reinitialize the provider
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Farcaster SDK Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">SDK Status</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Is Ready:</span>
                  <span className={`px-2 py-1 rounded text-sm ${isReady ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isReady ? 'Yes' : 'No'}
                  </span>
                </div>
                {error && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Error:</span>
                    <span className="text-red-600">{error}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Environment</h2>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Hostname:</span> {sdkInfo?.hostname}
                </div>
                <div>
                  <span className="font-medium">User Agent:</span> {sdkInfo?.userAgent}
                </div>
                <div>
                  <span className="font-medium">Is Farcaster Env:</span> 
                  <span className={`px-2 py-1 rounded text-sm ${sdkInfo?.isFarcasterEnv ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sdkInfo?.isFarcasterEnv ? 'Yes' : 'No'}
                  </span>
                </div>
                {sdkInfo?.isMock && (
                  <div>
                    <span className="font-medium">Mock SDK:</span> 
                    <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">Active</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={simulateSDK}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Simulate Farcaster SDK
                </button>
                <p className="text-sm text-gray-600">
                  This will create a mock Farcaster SDK for testing the ready() functionality locally.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">SDK Information</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(sdkInfo, null, 2)}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Debug Logs</h2>
              <div className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {logs.map((log, index) => (
                  <div key={index} className="text-xs font-mono">
                    {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-gray-500">No logs yet...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• The Farcaster SDK is only available when the app is embedded in a Farcaster client (like Warpcast)</li>
            <li>• When testing locally, you can simulate the SDK using the button above</li>
            <li>• The "Ready not called" error only appears in the actual Farcaster environment</li>
            <li>• Check the browser console for additional debugging information</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 