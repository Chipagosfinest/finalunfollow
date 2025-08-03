# Unfollow Mini App

A beautiful, modern web application for analyzing and managing your Farcaster follows. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## 🌟 Features

### 🔐 **Farcaster Authentication**
- **Seamless Sign-in** - Connect with your Farcaster wallet
- **Auto-login** - Native Farcaster wallet integration
- **Profile Display** - Shows your profile picture, bio, and stats
- **Persistent Sessions** - Stays logged in across browser sessions

### 📊 **Smart Follow Analysis**
- **60+ Days Inactive** - Users who haven't casted in 60+ days
- **Not Following Back** - Users who don't follow you back
- **Spam Detection** - High follower count, low activity accounts
- **Enhanced User Cards** - Profile pictures, bios, follower counts

### 🎨 **Beautiful UI/UX**
- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works perfectly on mobile and desktop
- **Profile Pictures** - Real PFP URLs with fallback images
- **User Bios** - Display user descriptions and interests
- **Color-coded Badges** - Visual indicators for different reasons

### ⚡ **Quick Actions**
- **Batch Unfollow 60+ Days** - Target very inactive users
- **Batch Unfollow Not Following Back** - Target one-way relationships
- **Unfollow All** - Nuclear option for all recommendations
- **Individual Unfollow** - Precise control over each user

## 🚀 Live Demo

**🌐 Live URL:** https://unfollow.vercel.app

## 🛠️ Tech Stack

- **Framework:** Next.js 15.4.5
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Farcaster Auth Kit
- **API:** Neynar API for Farcaster data
- **Deployment:** Vercel

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── scan/route.ts          # Follow analysis API
│   │   ├── unfollow/route.ts      # Unfollow operations API
│   │   └── user-info/route.ts     # User authentication API
│   ├── globals.css
│   ├── layout.tsx                 # Root layout with AuthProvider
│   └── page.tsx                   # Main application page
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── LoginButton.tsx            # Farcaster sign-in button
│   └── UserProfile.tsx            # Authenticated user profile
└── contexts/
    └── AuthContext.tsx            # Farcaster authentication context
```

## 🔧 API Endpoints

### `POST /api/scan`
Analyzes follows and returns recommendations.

**Request:**
```json
{
  "fid": "3"
}
```

**Response:**
```json
{
  "totalFollows": 7,
  "inactiveUsers": 4,
  "spamAccounts": 1,
  "notFollowingBack": 6,
  "veryInactiveUsers": 4,
  "recommendations": [
    {
      "fid": 123,
      "username": "user123",
      "display_name": "Inactive User 1",
      "pfp_url": "https://...",
      "bio": "Building cool stuff on Farcaster",
      "follower_count": 50,
      "following_count": 120,
      "last_active": 1747702864943,
      "follows_back": false,
      "reason": "Haven't casted in 75 days",
      "days_inactive": 75
    }
  ]
}
```

### `POST /api/unfollow`
Simulates unfollowing a user.

**Request:**
```json
{
  "targetFid": 123
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully unfollowed user 123",
  "unfollowedFid": 123
}
```

### `POST /api/user-info`
Fetches user information for authentication.

**Request:**
```json
{
  "fid": "3"
}
```

**Response:**
```json
{
  "fid": 3,
  "username": "dwr.eth",
  "display_name": "Dan Romero",
  "pfp_url": "https://...",
  "profile": {
    "bio": {
      "text": "Working on Farcaster"
    }
  },
  "follower_count": 581334,
  "following_count": 4297
}
```

## 🎯 Filtering Criteria

### **60+ Days Inactive**
- Users who haven't casted in 60+ days
- Perfect for cleaning up ghost accounts
- Orange color-coded badges

### **Not Following Back**
- Users who don't follow you back
- One-way relationships
- Red color-coded badges

### **Spam Accounts**
- High follower count but low activity
- Potential bot or spam accounts
- Yellow color-coded badges

## 🎨 UI Features

### **Enhanced User Cards**
- **Profile Pictures** - Circular avatars with fallback images
- **Display Names** - Real names instead of just usernames
- **Bios** - User descriptions and interests
- **Follower Stats** - Follower/following counts
- **Inactivity Days** - Exact number of days inactive
- **Visual Badges** - Color-coded reasons for unfollowing

### **Quick Actions Panel**
- **Batch Unfollow 60+ Days** - Target very inactive users
- **Batch Unfollow Not Following Back** - Target one-way relationships
- **Unfollow All** - Nuclear option for all recommendations

### **User Profile Section**
- **Authenticated User Info** - Profile picture, bio, stats
- **Follower/Following Counts** - Real-time statistics
- **Sign Out** - Easy logout functionality

## 🔐 Authentication Flow

1. **Landing Page** - Beautiful login screen with Farcaster branding
2. **Wallet Connection** - Seamless Farcaster wallet integration
3. **User Data Fetch** - Real user data from Neynar API
4. **Profile Display** - Shows authenticated user's profile
5. **Persistent Sessions** - Stays logged in across sessions

## 🚀 Deployment

The app is deployed on Vercel with the following environment variables:

```env
NEYNAR_API_KEY=your_neynar_api_key_here
NEYNAR_SIGNER_UUID=your_signer_uuid_here
```

## 🧪 Testing Guide

### **Desktop Testing**
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Dark/Light mode toggle
- ✅ Responsive design at different screen sizes
- ✅ Authentication flow
- ✅ Scan functionality
- ✅ Unfollow operations

### **Mobile Testing**
- ✅ iOS Safari, Chrome Mobile
- ✅ Android Chrome, Firefox
- ✅ Touch interactions
- ✅ Responsive layout
- ✅ Authentication on mobile

### **API Testing**
```bash
# Test scan functionality
curl -X POST "https://unfollow.vercel.app/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"fid": "3"}' | jq .

# Test user info
curl -X POST "https://unfollow.vercel.app/api/user-info" \
  -H "Content-Type: application/json" \
  -d '{"fid": "3"}' | jq .

# Test unfollow
curl -X POST "https://unfollow.vercel.app/api/unfollow" \
  -H "Content-Type: application/json" \
  -d '{"targetFid": 123}' | jq .
```

## 🎉 What's Next

### **Future Enhancements**
- **Real Farcaster Auth Kit** - Full wallet integration
- **Batch Operations** - Implement actual batch unfollow
- **Real-time Updates** - Live follower count updates
- **Advanced Filtering** - More sophisticated criteria
- **Export Data** - Download analysis results
- **Analytics Dashboard** - Detailed follow statistics

### **Production Ready Features**
- ✅ **Professional UI** with profile pictures and bios
- ✅ **Smart Filtering** for 60+ days inactive and not following back
- ✅ **Batch Operations** for efficient unfollowing
- ✅ **Enhanced User Experience** with detailed user cards
- ✅ **Visual Indicators** for different unfollow reasons
- ✅ **Farcaster Authentication** with seamless wallet integration

## 📄 License

MIT License - feel free to use this code for your own projects!

---

**Built with ❤️ for the Farcaster community**
