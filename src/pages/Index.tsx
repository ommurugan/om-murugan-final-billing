
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';
import SplashScreen from '@/components/mobile/SplashScreen';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isNative } = useMobileFeatures();
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);

  // Check if splash screen has been shown in this session
  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setShowSplashScreen(false);
      setHasShownSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplashScreen(false);
    setHasShownSplash(true);
    sessionStorage.setItem('splashShown', 'true');
  };

  useEffect(() => {
    if (!loading && hasShownSplash) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    }
  }, [user, loading, navigate, hasShownSplash]);

  // Show splash screen on first load for both web and mobile
  if (showSplashScreen && !hasShownSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null;
};

export default Index;
