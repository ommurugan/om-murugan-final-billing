
import { useState, useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { useMobileFeatures } from './useMobileFeatures';

export const useSplashScreen = () => {
  const [isNativeSplashVisible, setIsNativeSplashVisible] = useState(true);
  const { isNative } = useMobileFeatures();

  useEffect(() => {
    const hideSplash = async () => {
      if (isNative) {
        // Give a short delay to ensure our custom splash screen is ready
        setTimeout(async () => {
          try {
            await SplashScreen.hide();
            setIsNativeSplashVisible(false);
            console.log('Native splash screen hidden successfully');
          } catch (error) {
            console.log('Native splash screen already hidden or not available');
            setIsNativeSplashVisible(false);
          }
        }, 200);
      } else {
        // For web, immediately mark as not visible
        setIsNativeSplashVisible(false);
      }
    };

    hideSplash();
  }, [isNative]);

  return {
    isNativeSplashVisible,
    isNative
  };
};
