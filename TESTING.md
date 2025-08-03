# Testing Guide - Unfollow Mini App

## 🧪 **Testing Checklist**

### **1. Desktop Testing**
- [ ] **Chrome** - Test all functionality
- [ ] **Firefox** - Test all functionality  
- [ ] **Safari** - Test all functionality
- [ ] **Edge** - Test all functionality

### **2. Mobile Testing**
- [ ] **iPhone Safari** - Test responsive design
- [ ] **Android Chrome** - Test responsive design
- [ ] **Mobile Firefox** - Test responsive design

### **3. Dark Mode Testing**
- [ ] **Light Mode** - Verify all elements visible
- [ ] **Dark Mode** - Verify all elements visible
- [ ] **Toggle Button** - Test sun/moon icon
- [ ] **System Preference** - Test auto-detection

### **4. Functionality Testing**
- [ ] **Scan Button** - Test with valid FID (e.g., "3")
- [ ] **Error Handling** - Test with invalid FID
- [ ] **Loading States** - Verify "Scanning..." appears
- [ ] **Results Display** - Verify statistics show correctly
- [ ] **Unfollow Buttons** - Test individual unfollow
- [ ] **Real-time Updates** - Verify results update after unfollow

### **5. Responsive Design Testing**
- [ ] **Desktop (1920x1080)** - Full layout
- [ ] **Laptop (1366x768)** - Medium layout
- [ ] **Tablet (768x1024)** - Single column layout
- [ ] **Mobile (375x667)** - Mobile-optimized layout

### **6. API Testing**
- [ ] **Scan API** - Test with FID "3"
- [ ] **Unfollow API** - Test with target FID
- [ ] **Error Responses** - Test invalid requests
- [ ] **Loading States** - Test API delays

## 🚀 **Quick Test Commands**

### **API Testing:**
```bash
# Test scan functionality
curl -X POST "http://localhost:3000/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"fid": "3"}' | jq .

# Test unfollow functionality  
curl -X POST "http://localhost:3000/api/unfollow" \
  -H "Content-Type: application/json" \
  -d '{"targetFid": "123"}' | jq .
```

### **Browser Testing:**
1. Open `http://localhost:3000`
2. Test dark mode toggle (top-right button)
3. Enter FID "3" and click "Start Scan"
4. Test unfollow buttons
5. Test on different screen sizes

## 📱 **Mobile Testing Tips**

### **Chrome DevTools:**
1. Open DevTools (F12)
2. Click device toggle (📱 icon)
3. Test different device sizes:
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)
   - Galaxy S20 (360x800)

### **Real Device Testing:**
1. Find your computer's IP address
2. Connect phone to same WiFi
3. Visit `http://[YOUR_IP]:3000`

## 🌙 **Dark Mode Testing**

### **Manual Testing:**
1. Click the moon/sun button (top-right)
2. Verify all text is readable
3. Check cards, buttons, and borders
4. Test in both light and dark modes

### **System Preference:**
1. Change system dark mode setting
2. Refresh the page
3. Verify auto-detection works

## ✅ **Expected Results**

### **Scan Results (FID "3"):**
- Total Follows: 5
- Inactive Users: 2  
- Spam Accounts: 1
- 3 recommendations shown

### **Unfollow Testing:**
- Button shows "Unfollowing..." during action
- User disappears from list after unfollow
- Total count decreases by 1

## 🐛 **Common Issues to Check**

- [ ] **Mobile Layout** - Cards stack properly
- [ ] **Button States** - Loading states work
- [ ] **Error Messages** - Display correctly
- [ ] **Dark Mode** - All text readable
- [ ] **API Errors** - Graceful error handling
- [ ] **Responsive** - No horizontal scroll

## 🚀 **Ready for Deployment**

Once all tests pass, the app is ready for production deployment! 