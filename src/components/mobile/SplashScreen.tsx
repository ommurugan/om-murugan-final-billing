
import { useEffect, useState } from 'react';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const { isNative, setStatusBarColor } = useMobileFeatures();
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    // Set status bar to match splash screen background (mobile only)
    if (isNative) {
      setStatusBarColor('#1d4ed8', false);
    }

    // Start blinking animation after initial display
    const blinkInterval = setInterval(() => {
      setShowContent(prev => !prev);
    }, 500); // Blink every 500ms

    // Stop blinking and start fade out after 3 seconds
    const fadeTimer = setTimeout(() => {
      clearInterval(blinkInterval);
      setShowContent(true); // Ensure content is visible before fade out
      
      // Start fade out
      setTimeout(() => {
        setIsVisible(false);
        // Wait for fade out animation to complete before calling onComplete
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 100);
    }, 3000);

    return () => {
      clearInterval(blinkInterval);
      clearTimeout(fadeTimer);
    };
  }, [isNative, setStatusBarColor, onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-blue-600 flex items-center justify-center animate-fade-out z-50">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
              alt="OM MURUGAN AUTO WORKS" 
              className="w-32 h-32 mx-auto rounded-full shadow-2xl"
            />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">
            OM MURUGAN AUTO WORKS
          </h1>
          <p className="text-blue-100 text-sm">
            Professional Auto Services
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-blue-600 flex items-center justify-center animate-fade-in z-50">
      <div className="text-center">
        <div className={`mb-8 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-30'}`}>
          <img 
            src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
            alt="OM MURUGAN AUTO WORKS" 
            className="w-32 h-32 mx-auto rounded-full shadow-2xl"
          />
        </div>
        <div className={`transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-30'}`}>
          <h1 className="text-white text-2xl font-bold mb-2">
            OM MURUGAN AUTO WORKS
          </h1>
          <p className="text-blue-100 text-sm">
            Professional Auto Services
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white opacity-60"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
