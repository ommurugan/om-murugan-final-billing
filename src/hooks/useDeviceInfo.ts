
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  platform: string;
  userAgent: string;
}

export const useDeviceInfo = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    platform: 'unknown',
    userAgent: ''
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent) || 
                     (window.innerWidth >= 768 && window.innerWidth <= 1024 && isMobile);
    
    let platform = 'web';
    if (/iPhone|iPod/i.test(userAgent)) platform = 'ios';
    else if (/iPad/i.test(userAgent)) platform = 'ios-tablet';
    else if (/Android/i.test(userAgent)) platform = 'android';
    else if (/Windows/i.test(userAgent)) platform = 'windows';
    else if (/Mac/i.test(userAgent)) platform = 'mac';

    setDeviceInfo({
      isMobile: isMobile && !isTablet,
      isTablet,
      isDesktop: !isMobile,
      platform,
      userAgent
    });
  }, []);

  return deviceInfo;
};
