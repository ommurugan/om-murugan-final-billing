
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { Service, Part, InvoiceItem } from "@/types/billing";

interface ServicesPartsSelectionProps {
  services: Service[];
  parts: Part[];
  invoiceItems: InvoiceItem[];
  onAddService: (serviceId: string) => void;
  onAddPart: (partId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItemQuantity: (itemId: string, quantity: number) => void;
  onUpdateItemDiscount: (itemId: string, discount: number) => void;
}

const ServicesPartsSelection = ({
  services,
  parts,
  invoiceItems,
  onAddService,
  onAddPart,
  onRemoveItem,
  onUpdateItemQuantity,
  onUpdateItemDiscount
}: ServicesPartsSelectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services & Parts</CardTitle>
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
                  <div key={service.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.category}</p>
                        <p className="text-lg font-semibold text-blue-600">₹{service.basePrice}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => onAddService(service.id)}
                        disabled={invoiceItems.some(item => item.itemId === service.id && item.type === 'service')}
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
                  <div key={part.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{part.name}</h4>
                        <p className="text-sm text-gray-600">{part.category}</p>
                        <p className="text-lg font-semibold text-green-600">₹{part.price}</p>
                        <p className="text-xs text-gray-500">Stock: {part.stockQuantity}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => onAddPart(part.id)}
                        disabled={invoiceItems.some(item => item.itemId === part.id && item.type === 'part')}
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
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => onUpdateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <p className="text-xs text-gray-500">Qty</p>
                        </div>
                        <div className="text-right">
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => onUpdateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                            className="w-20 text-center"
                            min="0"
                          />
                          <p className="text-xs text-gray-500">Discount</p>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="font-semibold">₹{item.total}</p>
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

export default ServicesPartsSelection;
