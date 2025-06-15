import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Wrench,
  Package
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useServices, useCreateService, useUpdateService, useDeleteService, Service } from "@/hooks/useServices";
import { useParts, useCreatePart, useUpdatePart, useDeletePart, Part } from "@/hooks/useParts";
import { formatDuration } from "@/utils/formatDuration";

const Services = () => {
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [showAddPartForm, setShowAddPartForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    base_price: "",
    estimated_time: "",
    category: ""
  });

  const [newPart, setNewPart] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    supplier: "",
    part_number: "",
    min_stock_level: ""
  });

  // Hooks for services
  const { data: services = [], isLoading: servicesLoading, error: servicesError } = useServices();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  // Hooks for parts
  const { data: parts = [], isLoading: partsLoading, error: partsError } = useParts();
  const createPartMutation = useCreatePart();
  const updatePartMutation = useUpdatePart();
  const deletePartMutation = useDeletePart();

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = async () => {
    if (!newService.name || !newService.base_price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await createServiceMutation.mutateAsync({
        name: newService.name,
        description: newService.description || undefined,
        base_price: parseFloat(newService.base_price),
        estimated_time: parseInt(newService.estimated_time) || 60,
        category: newService.category,
        is_active: true
      });
      
      toast.success("Service added successfully!");
      setShowAddServiceForm(false);
      setNewService({
        name: "",
        description: "",
        base_price: "",
        estimated_time: "",
        category: ""
      });
    } catch (error) {
      toast.error("Failed to add service");
      console.error("Error adding service:", error);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService || !editingService.name || !editingService.base_price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await updateServiceMutation.mutateAsync({
        id: editingService.id,
        name: editingService.name,
        description: editingService.description,
        base_price: editingService.base_price,
        estimated_time: editingService.estimated_time,
        category: editingService.category
      });
      
      toast.success("Service updated successfully!");
      setEditingService(null);
    } catch (error) {
      toast.error("Failed to update service");
      console.error("Error updating service:", error);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteServiceMutation.mutateAsync(id);
      toast.success("Service deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete service");
      console.error("Error deleting service:", error);
    }
  };

  const handleAddPart = async () => {
    if (!newPart.name || !newPart.price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await createPartMutation.mutateAsync({
        name: newPart.name,
        category: newPart.category,
        price: parseFloat(newPart.price),
        stock_quantity: parseInt(newPart.stock_quantity) || 0,
        min_stock_level: parseInt(newPart.min_stock_level) || 0,
        supplier: newPart.supplier || undefined,
        part_number: newPart.part_number || undefined,
        is_active: true
      });
      
      toast.success("Part added successfully!");
      setShowAddPartForm(false);
      setNewPart({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category: "",
        supplier: "",
        part_number: "",
        min_stock_level: ""
      });
    } catch (error) {
      toast.error("Failed to add part");
      console.error("Error adding part:", error);
    }
  };

  const handleUpdatePart = async () => {
    if (!editingPart || !editingPart.name || !editingPart.price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await updatePartMutation.mutateAsync({
        id: editingPart.id,
        name: editingPart.name,
        category: editingPart.category,
        price: editingPart.price,
        stock_quantity: editingPart.stock_quantity,
        min_stock_level: editingPart.min_stock_level,
        supplier: editingPart.supplier,
        part_number: editingPart.part_number
      });
      
      toast.success("Part updated successfully!");
      setEditingPart(null);
    } catch (error) {
      toast.error("Failed to update part");
      console.error("Error updating part:", error);
    }
  };

  const handleDeletePart = async (id: string) => {
    try {
      await deletePartMutation.mutateAsync(id);
      toast.success("Part deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete part");
      console.error("Error deleting part:", error);
    }
  };

  const getStockColor = (stock: number, minLevel: number) => {
    if (stock > minLevel * 2) return 'bg-green-100 text-green-800';
    if (stock > minLevel) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (servicesError || partsError) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading data</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Services & Parts</h1>
          </div>
        </header>

        <div className="p-6">
          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search services and parts..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="services" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Services Catalog</TabsTrigger>
              <TabsTrigger value="parts">Parts Inventory</TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Services Catalog</h2>
                    <p className="text-gray-600">Manage your service offerings and pricing</p>
                  </div>
                  <Dialog open={showAddServiceForm} onOpenChange={setShowAddServiceForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700" disabled={createServiceMutation.isPending}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>
                          Create a new service offering for your catalog
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="serviceName">Service Name *</Label>
                          <Input 
                            id="serviceName"
                            value={newService.name}
                            onChange={(e) => setNewService({...newService, name: e.target.value})}
                            placeholder="Enter service name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceDescription">Description</Label>
                          <Textarea 
                            id="serviceDescription"
                            value={newService.description}
                            onChange={(e) => setNewService({...newService, description: e.target.value})}
                            placeholder="Describe the service"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="servicePrice">Price (₹) *</Label>
                            <Input 
                              id="servicePrice"
                              type="number"
                              value={newService.base_price}
                              onChange={(e) => setNewService({...newService, base_price: e.target.value})}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="serviceDuration">Duration (minutes)</Label>
                            <Input 
                              id="serviceDuration"
                              type="number"
                              value={newService.estimated_time}
                              onChange={(e) => setNewService({...newService, estimated_time: e.target.value})}
                              placeholder="60"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="serviceCategory">Category</Label>
                          <Input 
                            id="serviceCategory"
                            value={newService.category}
                            onChange={(e) => setNewService({...newService, category: e.target.value})}
                            placeholder="e.g., Maintenance, Repair"
                          />
                        </div>
                        <Button 
                          onClick={handleAddService} 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={createServiceMutation.isPending}
                        >
                          {createServiceMutation.isPending ? "Adding..." : "Add Service"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {servicesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                      <Card key={service.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Wrench className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{service.name}</CardTitle>
                                <Badge variant="outline">{service.category}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Dialog open={editingService?.id === service.id} onOpenChange={(open) => !open && setEditingService(null)}>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingService(service)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Service</DialogTitle>
                                    <DialogDescription>
                                      Update the service details
                                    </DialogDescription>
                                  </DialogHeader>
                                  {editingService && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="editServiceName">Service Name *</Label>
                                        <Input 
                                          id="editServiceName"
                                          value={editingService.name}
                                          onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                                          placeholder="Enter service name"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="editServiceDescription">Description</Label>
                                        <Textarea 
                                          id="editServiceDescription"
                                          value={editingService.description || ""}
                                          onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                                          placeholder="Describe the service"
                                          rows={3}
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label htmlFor="editServicePrice">Price (₹) *</Label>
                                          <Input 
                                            id="editServicePrice"
                                            type="number"
                                            value={editingService.base_price}
                                            onChange={(e) => setEditingService({...editingService, base_price: parseFloat(e.target.value)})}
                                            placeholder="0"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="editServiceDuration">Duration (minutes)</Label>
                                          <Input 
                                            id="editServiceDuration"
                                            type="number"
                                            value={editingService.estimated_time}
                                            onChange={(e) => setEditingService({...editingService, estimated_time: parseInt(e.target.value)})}
                                            placeholder="60"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <Label htmlFor="editServiceCategory">Category</Label>
                                        <Input 
                                          id="editServiceCategory"
                                          value={editingService.category}
                                          onChange={(e) => setEditingService({...editingService, category: e.target.value})}
                                          placeholder="e.g., Maintenance, Repair"
                                        />
                                      </div>
                                      <Button 
                                        onClick={handleUpdateService} 
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        disabled={updateServiceMutation.isPending}
                                      >
                                        {updateServiceMutation.isPending ? "Updating..." : "Update Service"}
                                      </Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-600"
                                onClick={() => handleDeleteService(service.id)}
                                disabled={deleteServiceMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {service.description && (
                            <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                          )}
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-semibold text-green-600">₹{service.base_price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span>{formatDuration(service.estimated_time)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Parts Tab */}
            <TabsContent value="parts">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Parts Inventory</h2>
                    <p className="text-gray-600">Manage your spare parts stock and pricing</p>
                  </div>
                  <Dialog open={showAddPartForm} onOpenChange={setShowAddPartForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700" disabled={createPartMutation.isPending}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Part
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Part</DialogTitle>
                        <DialogDescription>
                          Add a new spare part to your inventory
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="partName">Part Name *</Label>
                          <Input 
                            id="partName"
                            value={newPart.name}
                            onChange={(e) => setNewPart({...newPart, name: e.target.value})}
                            placeholder="Enter part name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="partPrice">Price (₹) *</Label>
                            <Input 
                              id="partPrice"
                              type="number"
                              value={newPart.price}
                              onChange={(e) => setNewPart({...newPart, price: e.target.value})}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="partStock">Stock Quantity</Label>
                            <Input 
                              id="partStock"
                              type="number"
                              value={newPart.stock_quantity}
                              onChange={(e) => setNewPart({...newPart, stock_quantity: e.target.value})}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="partCategory">Category</Label>
                            <Input 
                              id="partCategory"
                              value={newPart.category}
                              onChange={(e) => setNewPart({...newPart, category: e.target.value})}
                              placeholder="e.g., Filters, Brake System"
                            />
                          </div>
                          <div>
                            <Label htmlFor="partSupplier">Supplier</Label>
                            <Input 
                              id="partSupplier"
                              value={newPart.supplier}
                              onChange={(e) => setNewPart({...newPart, supplier: e.target.value})}
                              placeholder="Supplier name"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="partNumber">Part Number</Label>
                            <Input 
                              id="partNumber"
                              value={newPart.part_number}
                              onChange={(e) => setNewPart({...newPart, part_number: e.target.value})}
                              placeholder="Part number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="minStockLevel">Min Stock Level</Label>
                            <Input 
                              id="minStockLevel"
                              type="number"
                              value={newPart.min_stock_level}
                              onChange={(e) => setNewPart({...newPart, min_stock_level: e.target.value})}
                              placeholder="5"
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={handleAddPart} 
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={createPartMutation.isPending}
                        >
                          {createPartMutation.isPending ? "Adding..." : "Add Part"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {partsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredParts.map((part) => (
                      <Card key={part.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <Package className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{part.name}</CardTitle>
                                <Badge className={getStockColor(part.stock_quantity, part.min_stock_level)}>
                                  {part.stock_quantity} in stock
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Dialog open={editingPart?.id === part.id} onOpenChange={(open) => !open && setEditingPart(null)}>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingPart(part)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Part</DialogTitle>
                                    <DialogDescription>
                                      Update the part details
                                    </DialogDescription>
                                  </DialogHeader>
                                  {editingPart && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="editPartName">Part Name *</Label>
                                        <Input 
                                          id="editPartName"
                                          value={editingPart.name}
                                          onChange={(e) => setEditingPart({...editingPart, name: e.target.value})}
                                          placeholder="Enter part name"
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label htmlFor="editPartPrice">Price (₹) *</Label>
                                          <Input 
                                            id="editPartPrice"
                                            type="number"
                                            value={editingPart.price}
                                            onChange={(e) => setEditingPart({...editingPart, price: parseFloat(e.target.value)})}
                                            placeholder="0"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="editPartStock">Stock Quantity</Label>
                                          <Input 
                                            id="editPartStock"
                                            type="number"
                                            value={editingPart.stock_quantity}
                                            onChange={(e) => setEditingPart({...editingPart, stock_quantity: parseInt(e.target.value)})}
                                            placeholder="0"
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label htmlFor="editPartCategory">Category</Label>
                                          <Input 
                                            id="editPartCategory"
                                            value={editingPart.category}
                                            onChange={(e) => setEditingPart({...editingPart, category: e.target.value})}
                                            placeholder="e.g., Filters, Brake System"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="editPartSupplier">Supplier</Label>
                                          <Input 
                                            id="editPartSupplier"
                                            value={editingPart.supplier || ""}
                                            onChange={(e) => setEditingPart({...editingPart, supplier: e.target.value})}
                                            placeholder="Supplier name"
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label htmlFor="editPartNumber">Part Number</Label>
                                          <Input 
                                            id="editPartNumber"
                                            value={editingPart.part_number || ""}
                                            onChange={(e) => setEditingPart({...editingPart, part_number: e.target.value})}
                                            placeholder="Part number"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="editMinStockLevel">Min Stock Level</Label>
                                          <Input 
                                            id="editMinStockLevel"
                                            type="number"
                                            value={editingPart.min_stock_level}
                                            onChange={(e) => setEditingPart({...editingPart, min_stock_level: parseInt(e.target.value)})}
                                            placeholder="5"
                                          />
                                        </div>
                                      </div>
                                      <Button 
                                        onClick={handleUpdatePart} 
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        disabled={updatePartMutation.isPending}
                                      >
                                        {updatePartMutation.isPending ? "Updating..." : "Update Part"}
                                      </Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-600"
                                onClick={() => handleDeletePart(part.id)}
                                disabled={deletePartMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-semibold text-green-600">₹{part.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category:</span>
                              <Badge variant="outline">{part.category}</Badge>
                            </div>
                            {part.supplier && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Supplier:</span>
                                <span>{part.supplier}</span>
                              </div>
                            )}
                            {part.part_number && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Part #:</span>
                                <span className="font-mono text-xs">{part.part_number}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Services;
