
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const mobileUtils = {
  // Check if running on mobile device
  isMobile: () => Capacitor.isNativePlatform(),

  // Share functionality for invoices/reports
  share: async (title: string, text: string, url?: string) => {
    if (!Capacitor.isNativePlatform()) {
      // Fallback for web
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        // Copy to clipboard as fallback
        await navigator.clipboard.writeText(text);
        alert('Content copied to clipboard');
      }
      return;
    }

    try {
      await Share.share({
        title,
        text,
        url,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  },

  // Haptic feedback for button presses
  vibrate: async (style: ImpactStyle = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
  },

  // Save data to device storage
  saveToDevice: async (filename: string, data: string) => {
    if (!Capacitor.isNativePlatform()) {
      // Web fallback - download file
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    try {
      await Filesystem.writeFile({
        path: filename,
        data: data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      return true;
    } catch (error) {
      console.error('Save to device failed:', error);
      return false;
    }
  },

  // Get platform-specific styling
  getPlatformStyles: () => {
    if (!Capacitor.isNativePlatform()) return {};
    
    const info = Capacitor.getPlatform();
    return {
      ios: info === 'ios',
      android: info === 'android',
      isNative: true,
    };
  }
};
