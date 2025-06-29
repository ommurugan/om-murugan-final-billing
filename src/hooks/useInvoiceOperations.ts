
import { useState } from "react";
import { InvoiceItem, Service, Part } from "@/types/billing";

export const useInvoiceOperations = () => {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  const addService = (service: Service) => {
    if (!invoiceItems.find(item => item.itemId === service.id && item.type === 'service')) {
      console.log("Adding service with HSN code:", service.hsnCode || '998314');
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        type: 'service',
        itemId: service.id,
        name: service.name,
        quantity: 1,
        unitPrice: service.basePrice,
        discount: 0,
        total: service.basePrice,
        hsnCode: service.hsnCode || '998314', // Use the actual HSN code from the service
        hsn_code: service.hsnCode || '998314' // Also set hsn_code for compatibility
      };
      setInvoiceItems(prev => [...prev, newItem]);
    }
  };

  const addPart = (part: Part) => {
    if (!invoiceItems.find(item => item.itemId === part.id && item.type === 'part')) {
      console.log("Adding part with HSN code:", part.hsnCode || '998313');
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        type: 'part',
        itemId: part.id,
        name: part.name,
        quantity: 1,
        unitPrice: part.price,
        discount: 0,
        total: part.price,
        hsnCode: part.hsnCode || '998313', // Use the actual HSN code from the part
        hsn_code: part.hsnCode || '998313' // Also set hsn_code for compatibility
      };
      setInvoiceItems(prev => [...prev, newItem]);
    }
  };

  const removeItem = (itemId: string) => {
    setInvoiceItems(items => items.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setInvoiceItems(items => items.map(item => 
      item.id === itemId 
        ? { ...item, quantity, total: (item.unitPrice - item.discount) * quantity }
        : item
    ));
  };

  const updateItemDiscount = (itemId: string, discount: number) => {
    setInvoiceItems(items => items.map(item => 
      item.id === itemId 
        ? { ...item, discount, total: (item.unitPrice - discount) * item.quantity }
        : item
    ));
  };

  return {
    invoiceItems,
    setInvoiceItems,
    addService,
    addPart,
    removeItem,
    updateItemQuantity,
    updateItemDiscount
  };
};
