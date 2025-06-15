
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';

export const useMobileFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const initializeMobile = async () => {
      if (Capacitor.isNativePlatform()) {
        setIsNative(true);
        
        // Hide splash screen after app loads
        await SplashScreen.hide();
        
        // Set status bar style
        await StatusBar.setStyle({ style: StatusBarStyle.Default });
        
        // Get device info
        const info = await Device.getInfo();
        setDeviceInfo(info);
        
        // Monitor network status
        const status = await Network.getStatus();
        setIsOnline(status.connected);
        
        Network.addListener('networkStatusChange', (status) => {
          setIsOnline(status.connected);
        });
      }
    };

    initializeMobile();
  }, []);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      await Haptics.impact({ style });
    }
  };

  const setStatusBarColor = async (color: string, dark = false) => {
    if (isNative) {
      await StatusBar.setBackgroundColor({ color });
      await StatusBar.setStyle({ 
        style: dark ? StatusBarStyle.Dark : StatusBarStyle.Light 
      });
    }
  };

  return {
    isNative,
    deviceInfo,
    isOnline,
    triggerHaptic,
    setStatusBarColor
  };
};
