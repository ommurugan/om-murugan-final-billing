
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";

interface InvoiceItem {
  id: string;
  type: 'service' | 'part';
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  hsnCode?: string;
  hsn_code?: string;
  gstRate?: number;
}

interface GSTServicesPartsSectionProps {
  invoiceItems: InvoiceItem[];
  services: any[];
  parts: any[];
  onAddService: (serviceId: string) => void;
  onAddPart: (partId: string) => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateDiscount: (id: string, discount: number) => void;
  onItemSelect: (itemId: string, value: string) => void;
  onUnitPriceChange: (itemId: string, price: number) => void;
  onItemGstRateChange?: (itemId: string, rate: number) => void;
  gstRate: number;
  onGstRateChange: (rate: number) => void;
}

const GSTServicesPartsSection = ({
  invoiceItems,
  services,
  parts,
  onAddService,
  onAddPart,
  onRemoveItem,
  onUpdateQuantity,
  onUpdateDiscount,
  onItemSelect,
  onUnitPriceChange,
  onItemGstRateChange,
  gstRate,
  onGstRateChange
}: GSTServicesPartsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Services & Parts</span>
          <div className="flex items-center gap-2">
            <Label htmlFor="gst-rate" className="text-sm font-medium">Default GST Rate:</Label>
            <Select value={gstRate.toString()} onValueChange={(value) => onGstRateChange(Number(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="parts">Parts</TabsTrigger>
            <TabsTrigger value="selected">Selected Items ({invoiceItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            {services.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No services available. Please add services first.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(service => (
                  <div key={service.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.category}</p>
                        <p className="text-lg font-semibold text-blue-600">₹{service.base_price}</p>
                        {service.labor_charges > 0 && (
                          <p className="text-sm text-green-600">Labor: ₹{service.labor_charges}</p>
                        )}
                        {service.hsn_code && (
                          <p className="text-xs text-gray-500 font-medium">SAC: {service.hsn_code}</p>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => onAddService(service.id)}
                        className="ml-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="parts" className="space-y-4">
            {parts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No parts available. Please add parts first.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parts.map(part => (
                  <div key={part.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{part.name}</h4>
                        <p className="text-sm text-gray-600">{part.category}</p>
                        <p className="text-lg font-semibold text-green-600">₹{part.price}</p>
                        <p className="text-xs text-gray-500">Stock: {part.stock_quantity}</p>
                        {part.hsn_code && (
                          <p className="text-xs text-gray-500 font-medium">HSN: {part.hsn_code}</p>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => onAddPart(part.id)}
                        className="ml-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="selected" className="space-y-4">
            {invoiceItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items selected</p>
            ) : (
              <div className="space-y-3">
                {invoiceItems.map(item => (
                  <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                        {(item.hsnCode || item.hsn_code) && (
                          <p className="text-xs text-gray-500 font-medium">
                            {item.type === 'service' ? 'SAC' : 'HSN'}: {item.hsnCode || item.hsn_code}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <p className="text-xs text-gray-500">Qty</p>
                        </div>
                        <div className="text-right">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => onUnitPriceChange(item.id, parseFloat(e.target.value) || 0)}
                            className="w-20 text-center"
                            min="0"
                            step="0.01"
                          />
                          <p className="text-xs text-gray-500">Price</p>
                        </div>
                        <div className="text-right">
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => onUpdateDiscount(item.id, parseFloat(e.target.value) || 0)}
                            className="w-20 text-center"
                            min="0"
                            step="0.01"
                          />
                          <p className="text-xs text-gray-500">Discount</p>
                        </div>
                        {onItemGstRateChange && (
                          <div className="text-right">
                            <Select
                              value={(item.gstRate || gstRate).toString()}
                              onValueChange={(value) => onItemGstRateChange(item.id, Number(value))}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="18">18%</SelectItem>
                                <SelectItem value="28">28%</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">GST%</p>
                          </div>
                        )}
                        <div className="text-right min-w-[80px]">
                          <p className="font-semibold">₹{item.total.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => onRemoveItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GSTServicesPartsSection;
