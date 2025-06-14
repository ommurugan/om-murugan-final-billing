
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6016dc4811d44274b87fa9aafcd34d7d',
  appName: 'mechanic-billing-63',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://6016dc48-11d4-4274-b87f-a9aafcd34d7d.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff'
    }
  }
};

export default config;
