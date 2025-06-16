
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import InitialSplashScreen from '@/components/InitialSplashScreen';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (!loading && !showSplash) {
      console.log('Redirecting user:', user ? 'to dashboard' : 'to auth');
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    }
  }, [user, loading, navigate, showSplash]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showSplash) {
    return <InitialSplashScreen onComplete={handleSplashComplete} />;
  }

  return null;
};

export default Index;
