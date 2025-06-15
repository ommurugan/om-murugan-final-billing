
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

const NetworkStatus = () => {
  const { isOnline, isNative } = useMobileFeatures();

  // Only show on mobile and when offline
  if (!isNative || isOnline) return null;

  return (
    <Alert className="mx-4 mb-4 border-orange-200 bg-orange-50">
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        You're currently offline. Some features may not work properly.
      </AlertDescription>
    </Alert>
  );
};

export default NetworkStatus;
