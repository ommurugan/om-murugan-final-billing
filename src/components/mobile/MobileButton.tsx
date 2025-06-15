
import { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';
import { ImpactStyle } from '@capacitor/haptics';

interface MobileButtonProps extends ButtonProps {
  hapticStyle?: ImpactStyle;
  disableHaptic?: boolean;
}

const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ onClick, hapticStyle = ImpactStyle.Light, disableHaptic = false, ...props }, ref) => {
    const { triggerHaptic, isNative } = useMobileFeatures();

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isNative && !disableHaptic) {
        await triggerHaptic(hapticStyle);
      }
      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

MobileButton.displayName = 'MobileButton';

export default MobileButton;
