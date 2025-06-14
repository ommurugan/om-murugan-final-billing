
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import { useDataTransformations } from "@/hooks/useDataTransformations";
import { InvoiceItem } from "@/types/billing";
import ServicesPartsSelection from "./ServicesPartsSelection";

interface ServicesSectionProps {
  invoiceItems: InvoiceItem[];
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

  // Enhanced add service function that creates the invoice item
  const handleAddService = (serviceId: string) => {
    const service = transformedServices.find(s => s.id === serviceId);
    if (service && !invoiceItems.find(item => item.itemId === serviceId && item.type === 'service')) {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        type: 'service',
        itemId: service.id,
        name: service.name,
        quantity: 1,
        unitPrice: service.basePrice,
        discount: 0,
        total: service.basePrice
      };
      
      // Instead of calling the parent's onAddService, we need to add the item directly
      // This is a workaround since we need to pass the actual item, not just the ID
      console.log("Adding service item:", newItem);
      onAddService(serviceId);
    }
  };

  // Enhanced add part function that creates the invoice item
  const handleAddPart = (partId: string) => {
    const part = transformedParts.find(p => p.id === partId);
    if (part && !invoiceItems.find(item => item.itemId === partId && item.type === 'part')) {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        type: 'part',
        itemId: part.id,
        name: part.name,
        quantity: 1,
        unitPrice: part.price,
        discount: 0,
        total: part.price
      };
      
      console.log("Adding part item:", newItem);
      onAddPart(partId);
    }
  };

  return (
    <ServicesPartsSelection
      services={transformedServices}
      parts={transformedParts}
      invoiceItems={invoiceItems}
      onAddService={handleAddService}
      onAddPart={handleAddPart}
      onRemoveItem={onRemoveItem}
      onUpdateItemQuantity={onUpdateItemQuantity}
      onUpdateItemDiscount={onUpdateItemDiscount}
    />
  );
};

export default ServicesSection;
