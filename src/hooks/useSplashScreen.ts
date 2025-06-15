
import { useState, useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { useMobileFeatures } from './useMobileFeatures';

export const useSplashScreen = () => {
  const [isNativeSplashVisible, setIsNativeSplashVisible] = useState(true);
  const { isNative } = useMobileFeatures();

  useEffect(() => {
    const hideSplash = async () => {
      if (isNative) {
        // Hide the native splash screen after our custom splash is ready
        setTimeout(async () => {
          try {
            await SplashScreen.hide();
            setIsNativeSplashVisible(false);
          } catch (error) {
            console.log('Native splash screen already hidden');
            setIsNativeSplashVisible(false);
          }
        }, 100);
      } else {
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
