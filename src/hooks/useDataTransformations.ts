
import { useMemo } from "react";
import { Vehicle, Service, Part } from "@/types/billing";

interface UseDataTransformationsProps {
  vehiclesData: any[];
  servicesData: any[];
  partsData: any[];
}

export const useDataTransformations = ({
  vehiclesData,
  servicesData,
  partsData
}: UseDataTransformationsProps) => {
  const transformedVehicles: Vehicle[] = useMemo(() => 
    vehiclesData.map(v => ({
      id: v.id,
      customerId: v.customer_id,
      make: v.make,
      model: v.model,
      year: v.year,
      vehicleNumber: v.vehicle_number,
      vehicleType: (v.vehicle_type as 'car' | 'bike' | 'scooter') || 'car',
      engineNumber: v.engine_number,
      chassisNumber: v.chassis_number,
      color: v.color,
      createdAt: v.created_at
    })), [vehiclesData]
  );

  const transformedServices: Service[] = useMemo(() =>
    servicesData.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      basePrice: Number(s.base_price),
      estimatedTime: s.estimated_time,
      description: s.description,
      isActive: s.is_active,
      hsnCode: s.hsn_code // Add HSN code mapping for services
    })), [servicesData]
  );

  const transformedParts: Part[] = useMemo(() =>
    partsData.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: Number(p.price),
      stockQuantity: p.stock_quantity,
      minStockLevel: p.min_stock_level,
      supplier: p.supplier,
      partNumber: p.part_number,
      isActive: p.is_active,
      hsnCode: p.hsn_code // Add HSN code mapping for parts
    })), [partsData]
  );

  return {
    transformedVehicles,
    transformedServices,
    transformedParts
  };
};
