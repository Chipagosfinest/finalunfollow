# Farcaster Embed Setup

## 🎯 App Name: "Unfollow Tool"

**Preview Text:** "Unfollow on Farcaster"

## 📁 Files Created

### 1. **Farcaster Manifest** (`public/farcaster-manifest.json`)
- Defines app metadata for Farcaster
- Configures embed settings
- Sets permissions for read/write follows

### 2. **Embed Page** (`src/app/embed/page.tsx`)
- Compact view for Farcaster feed
- Shows analysis results
- Links to full app

### 3. **Thumbnail Images** (HTML templates)
- `public/thumbnail.html` - Main app thumbnail
- `public/embed-thumbnail.html` - Embed-specific thumbnail
- `public/icon.html` - App icon

## 🖼️ Thumbnail Generation

The HTML files can be converted to PNG images using:

```bash
# Using Chrome headless (recommended)
google-chrome --headless --screenshot=thumbnail.png --window-size=600,315 public/thumbnail.html
google-chrome --headless --screenshot=embed-thumbnail.png --window-size=600,315 public/embed-thumbnail.html
google-chrome --headless --screenshot=icon.png --window-size=512,512 public/icon.html
```

## 🔗 Live URLs

- **Main App:** https://unfollow.vercel.app
- **Embed Page:** https://unfollow.vercel.app/embed
- **Manifest:** https://unfollow.vercel.app/farcaster-manifest.json

## 📊 Embed Features

### **Compact View**
- User profile display
- Quick analysis button
- Results summary with stats
- Top 3 recommendations
- Link to full app

### **Authentication Flow**
- Shows login prompt if not authenticated
- Displays user info when authenticated
- Seamless integration with main app

### **Analysis Results**
- 60+ Days Inactive count
- Not Following Back count
- Spam Accounts count
- Color-coded badges

## 🎨 Design

### **Thumbnail Design**
- Purple gradient background
- Magnifying glass icon (🔍)
- "Unfollow Tool" title
- "Unfollow on Farcaster" subtitle
- Sample statistics display

### **Embed Page Design**
- Responsive layout
- Dark/light mode support
- Profile pictures with fallbacks
- Color-coded recommendation badges
- Clean, modern UI

## 🚀 Ready for Farcaster Feed

The app is now ready to be embedded in the Farcaster social feed with:

✅ **Proper manifest configuration**
✅ **Embed page with compact view**
✅ **Thumbnail images (HTML templates)**
✅ **"Unfollow on Farcaster" branding**
✅ **Authentication integration**
✅ **Analysis functionality**

## 📝 Next Steps

1. **Convert HTML to PNG** - Use the Chrome commands above
2. **Upload images** - Replace the HTML files with actual PNG images
3. **Submit to Farcaster** - Use the manifest for mini app submission
4. **Test in feed** - Verify the embed works correctly

## 🎯 Embed Preview

When users see the embed in their Farcaster feed, they'll see:

- **Thumbnail:** "Unfollow Tool" with analysis stats
- **Title:** "Unfollow on Farcaster"
- **Description:** Analysis of follows with recommendations
- **Action:** Click to open the embed page
- **Result:** Compact analysis view with link to full app 