
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { Keyboard } from '@capacitor/keyboard';

export const useMobileFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const initializeMobile = async () => {
      if (Capacitor.isNativePlatform()) {
        setIsNative(true);
        
        // Hide splash screen after app loads
        await SplashScreen.hide();
        
        // Set status bar style for auto garage theme
        await StatusBar.setStyle({ style: StatusBarStyle.Default });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
        
        // Get device info
        const info = await Device.getInfo();
        setDeviceInfo(info);
        
        // Monitor network status
        const status = await Network.getStatus();
        setIsOnline(status.connected);
        
        Network.addListener('networkStatusChange', (status) => {
          setIsOnline(status.connected);
        });

        // Monitor keyboard events
        Keyboard.addListener('keyboardWillShow', (info) => {
          setKeyboardHeight(info.keyboardHeight);
          setIsKeyboardOpen(true);
        });

        Keyboard.addListener('keyboardWillHide', () => {
          setKeyboardHeight(0);
          setIsKeyboardOpen(false);
        });
      }
    };

    initializeMobile();
  }, []);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
  };

  const setStatusBarColor = async (color: string, dark = false) => {
    if (isNative) {
      try {
        await StatusBar.setBackgroundColor({ color });
        await StatusBar.setStyle({ 
          style: dark ? StatusBarStyle.Dark : StatusBarStyle.Light 
        });
      } catch (error) {
        console.log('Status bar customization not available');
      }
    }
  };

  const hideKeyboard = async () => {
    if (isNative) {
      try {
        await Keyboard.hide();
      } catch (error) {
        console.log('Keyboard hide not available');
      }
    }
  };

  return {
    isNative,
    deviceInfo,
    isOnline,
    keyboardHeight,
    isKeyboardOpen,
    triggerHaptic,
    setStatusBarColor,
    hideKeyboard
  };
};
