
import { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <img 
          src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
          alt="OM MURUGAN AUTO WORKS" 
          className="h-24 w-24 animate-pulse" 
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">OM MURUGAN</h1>
          <p className="text-lg text-gray-600">AUTO WORKS</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
