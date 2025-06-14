
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building mobile app...');

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build the web app
  console.log('📦 Building web application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if Capacitor is initialized
  if (!fs.existsSync('capacitor.config.ts')) {
    console.log('⚡ Initializing Capacitor...');
    execSync('npx cap init', { stdio: 'inherit' });
  }

  // Copy web assets to native platforms
  console.log('📱 Syncing to native platforms...');
  execSync('npx cap copy', { stdio: 'inherit' });

  console.log('✅ Mobile app build complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run "npx cap add ios" to add iOS platform');
  console.log('2. Run "npx cap add android" to add Android platform');
  console.log('3. Run "npx cap open ios" or "npx cap open android" to open in native IDEs');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
