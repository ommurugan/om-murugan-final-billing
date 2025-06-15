
import { useEffect, useState } from 'react';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const { isNative, setStatusBarColor } = useMobileFeatures();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set status bar to match splash screen background
    if (isNative) {
      setStatusBarColor('#1d4ed8', false);
    }

    // Start the splash screen sequence
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade out animation to complete before calling onComplete
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, [isNative, setStatusBarColor, onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-blue-600 flex items-center justify-center animate-fade-out z-50">
        <div className="text-center">
          <div className="mb-8 animate-pulse">
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
        <div className="mb-8">
          <img 
            src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
            alt="OM MURUGAN AUTO WORKS" 
            className="w-32 h-32 mx-auto rounded-full shadow-2xl animate-pulse"
            style={{
              animation: 'pulse 1.5s ease-in-out infinite alternate'
            }}
          />
        </div>
        <h1 className="text-white text-2xl font-bold mb-2 animate-fade-in">
          OM MURUGAN AUTO WORKS
        </h1>
        <p className="text-blue-100 text-sm animate-fade-in">
          Professional Auto Services
        </p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
