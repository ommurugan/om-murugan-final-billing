
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import { useDataTransformations } from "@/hooks/useDataTransformations";
import ServicesPartsSelection from "./ServicesPartsSelection";

interface ServicesSectionProps {
  invoiceItems: any[];
  onAddService: (serviceId: string) => void;
  onAddPart: (partId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItemQuantity: (itemId: string, quantity: number) => void;
  onUpdateItemDiscount: (itemId: string, discount: number) => void;
}

const ServicesSection = ({
  invoiceItems,
  onAddService,
  onAddPart,
  onRemoveItem,
  onUpdateItemQuantity,
  onUpdateItemDiscount
}: ServicesSectionProps) => {
  // Fetch services and parts
  const { data: servicesData = [] } = useServices();
  const { data: partsData = [] } = useParts();

  const { transformedServices, transformedParts } = useDataTransformations({
    vehiclesData: [],
    servicesData,
    partsData
  });

  return (
    <ServicesPartsSelection
      services={transformedServices}
      parts={transformedParts}
      invoiceItems={invoiceItems}
      onAddService={onAddService}
      onAddPart={onAddPart}
      onRemoveItem={onRemoveItem}
      onUpdateItemQuantity={onUpdateItemQuantity}
      onUpdateItemDiscount={onUpdateItemDiscount}
    />
  );
};

export default ServicesSection;
