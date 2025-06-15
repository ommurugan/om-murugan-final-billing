
import { ReactNode, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useMobileFeatures } from "@/hooks/useMobileFeatures";
import { ImpactStyle } from "@capacitor/haptics";

interface MobileActionSheetProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  onClose?: () => void;
}

const MobileActionSheet = ({ trigger, title, children, onClose }: MobileActionSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { triggerHaptic } = useMobileFeatures();

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      await triggerHaptic(ImpactStyle.Light);
    }
    setIsOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl border-t-0 max-h-[90vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left text-xl">{title}</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default MobileActionSheet;
