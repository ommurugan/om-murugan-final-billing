
import { useEffect, useState } from 'react';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

interface InitialSplashScreenProps {
  onComplete: () => void;
}

const InitialSplashScreen = ({ onComplete }: InitialSplashScreenProps) => {
  const { isNative, setStatusBarColor } = useMobileFeatures();
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const [blinkCount, setBlinkCount] = useState(0);

  useEffect(() => {
    // Set status bar to match splash screen background (mobile only)
    if (isNative) {
      setStatusBarColor('#ffffff', true);
    }

    // Start blinking animation - exactly 4 blinks
    const blinkInterval = setInterval(() => {
      setShowContent(prev => !prev);
      setBlinkCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 8) { // 8 state changes = 4 complete blinks
          clearInterval(blinkInterval);
          // Start fade out immediately after 4 blinks
          setTimeout(() => {
            setIsVisible(false);
            // Wait for fade out animation to complete before calling onComplete
            setTimeout(() => {
              onComplete();
            }, 300);
          }, 100);
        }
        return newCount;
      });
    }, 250); // 250ms per state change = 500ms per complete blink

    return () => {
      clearInterval(blinkInterval);
    };
  }, [isNative, setStatusBarColor, onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center animate-fade-out z-50">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <img 
              src="/lovable-uploads/8ffc0c8a-e3aa-4cf5-864c-ca3b24b0b31b.png" 
              alt="OM MURUGAN AUTO WORKS" 
              className="w-48 h-48 object-contain"
            />
          </div>
          <h1 className="text-gray-900 text-3xl font-bold mb-2">
            OM MURUGAN AUTO WORKS
          </h1>
          <p className="text-gray-600 text-lg">
            Professional Auto Services
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center animate-fade-in z-50">
      <div className="text-center">
        <div className={`mb-8 flex justify-center transition-opacity duration-150 ${showContent ? 'opacity-100' : 'opacity-30'}`}>
          <img 
            src="/lovable-uploads/8ffc0c8a-e3aa-4cf5-864c-ca3b24b0b31b.png" 
            alt="OM MURUGAN AUTO WORKS" 
            className="w-48 h-48 object-contain"
          />
        </div>
        <div className={`transition-opacity duration-150 ${showContent ? 'opacity-100' : 'opacity-30'}`}>
          <h1 className="text-gray-900 text-3xl font-bold mb-2">
            OM MURUGAN AUTO WORKS
          </h1>
          <p className="text-gray-600 text-lg">
            Professional Auto Services
          </p>
        </div>
      </div>
    </div>
  );
};

export default InitialSplashScreen;
