
import { ReactNode } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

interface MobileActionSheetProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MobileActionSheet = ({
  trigger,
  title,
  children,
  open,
  onOpenChange
}: MobileActionSheetProps) => {
  const { triggerHaptic } = useMobileFeatures();

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      triggerHaptic();
    }
    onOpenChange?.(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-xl">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileActionSheet;
