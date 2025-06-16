
import { useEffect, useState } from 'react';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

interface InitialSplashScreenProps {
  onComplete: () => void;
}

const InitialSplashScreen = ({ onComplete }: InitialSplashScreenProps) => {
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

    // Stop blinking and start fade out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      clearInterval(blinkInterval);
      setShowContent(true); // Ensure content is visible before fade out
      
      // Start fade out
      setTimeout(() => {
        setIsVisible(false);
        // Wait for fade out animation to complete before calling onComplete
        setTimeout(() => {
          onComplete();
        }, 300);
      }, 100);
    }, 2500);

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
              src="/lovable-uploads/73f3aed2-5b00-4709-9094-18858bd49b6c.png" 
              alt="OM MURUGAN AUTO WORKS" 
              className="w-40 h-40 mx-auto rounded-2xl shadow-2xl object-contain"
            />
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">
            OM MURUGAN AUTO WORKS
          </h1>
          <p className="text-blue-100 text-lg">
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
            src="/lovable-uploads/73f3aed2-5b00-4709-9094-18858bd49b6c.png" 
            alt="OM MURUGAN AUTO WORKS" 
            className="w-40 h-40 mx-auto rounded-2xl shadow-2xl object-contain"
          />
        </div>
        <div className={`transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-30'}`}>
          <h1 className="text-white text-3xl font-bold mb-2">
            OM MURUGAN AUTO WORKS
          </h1>
          <p className="text-blue-100 text-lg">
            Professional Auto Services
          </p>
        </div>
      </div>
    </div>
  );
};

export default InitialSplashScreen;
