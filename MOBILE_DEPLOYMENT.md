
# Mobile App Deployment Guide

## Prerequisites
- Node.js installed
- Android Studio (for Android)
- Xcode (for iOS, Mac only)

## Setup Instructions

### 1. Clone and Setup
```bash
# Clone your project from GitHub
git clone <your-repo-url>
cd <project-name>

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Add Mobile Platforms
```bash
# Add Android platform
npx cap add android

# Add iOS platform (Mac only)
npx cap add ios
```

### 3. Sync Changes
```bash
# Sync web assets to native platforms
npx cap sync
```

### 4. Open in Native IDEs

#### For Android:
```bash
npx cap open android
```
- This opens Android Studio
- Connect your Android device or start an emulator
- Click "Run" to install on device

#### For iOS (Mac only):
```bash
npx cap open ios
```
- This opens Xcode
- Connect your iOS device or start a simulator
- Click "Play" to install on device

## Development Workflow

### After Making Changes:
1. Build your project: `npm run build`
2. Sync changes: `npx cap sync`
3. Open native IDE and run

### For Live Reload (Development):
The app is configured to load from the Lovable preview URL for development. For production, you'll want to:
1. Remove the `server` configuration from `capacitor.config.ts`
2. Build and sync your project
3. The app will use local files instead

## Testing Features

### Mobile-Specific Features Implemented:
- ✅ Haptic feedback on button presses
- ✅ Native status bar styling
- ✅ Network status monitoring
- ✅ Keyboard handling
- ✅ Safe area insets
- ✅ Native sharing functionality
- ✅ Splash screen configuration

### Testing Checklist:
- [ ] App launches properly
- [ ] All pages load correctly
- [ ] Bottom navigation works
- [ ] Forms can be filled and submitted
- [ ] Haptic feedback works on supported devices
- [ ] Network status shows when offline
- [ ] Keyboard doesn't overlap content

## Troubleshooting

### Common Issues:
1. **Build Errors**: Make sure all dependencies are installed with `npm install`
2. **Sync Issues**: Clear cache with `npx cap clean` then `npx cap sync`
3. **Android Build Issues**: Check Android SDK is properly installed
4. **iOS Build Issues**: Check Xcode is up to date and provisioning profiles are set

### Logs:
- Android: Use `adb logcat` or Android Studio logcat
- iOS: Use Xcode console or device logs

## Production Deployment

### Android:
1. Generate signed APK/AAB in Android Studio
2. Upload to Google Play Console

### iOS:
1. Archive and upload to App Store Connect in Xcode
2. Submit for review

## Notes
- The app maintains all existing functionality while adding mobile enhancements
- All layouts and text sizes remain unchanged
- Mobile features gracefully degrade on web browsers
