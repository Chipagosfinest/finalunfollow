'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

export function UserProfile() {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={user.pfpUrl} 
            alt={`${user.displayName} profile`}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://i.seadn.io/gae/sYAr036bd0bRpj7OX6B-F-MqLGznVkK3--DSneL_BT5GX4NZJ3Zu91PgjpD9-xuVJtHq0qirJfPZeMKrahz8Us2Tj_X8qdNPYC-imqs?w=500&auto=format'
            }}
          />
          <div className="flex-1">
            <h3 className="font-medium dark:text-white">{user.displayName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
            {user.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.bio}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{user.followerCount.toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{user.followingCount.toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Following</div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={signOut}
          className="w-full"
          size="sm"
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  )
} 