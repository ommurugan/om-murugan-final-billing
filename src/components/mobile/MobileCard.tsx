
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMobileFeatures } from "@/hooks/useMobileFeatures";
import { ImpactStyle } from "@capacitor/haptics";

interface MobileCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  withHaptic?: boolean;
  hapticStyle?: ImpactStyle;
}

const MobileCard = ({ 
  title, 
  children, 
  className, 
  onClick,
  withHaptic = false,
  hapticStyle = ImpactStyle.Light
}: MobileCardProps) => {
  const { triggerHaptic } = useMobileFeatures();

  const handleClick = async () => {
    if (withHaptic) {
      await triggerHaptic(hapticStyle);
    }
    onClick?.();
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        onClick && "cursor-pointer active:scale-[0.98] touch-manipulation",
        className
      )}
      onClick={handleClick}
    >
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? "pt-0" : ""}>
        {children}
      </CardContent>
    </Card>
  );
};

export default MobileCard;
