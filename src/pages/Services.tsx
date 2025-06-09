
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
  Settings,
  Package
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const Services = () => {
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [showAddPartForm, setShowAddPartForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: ""
  });

  const [newPart, setNewPart] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: ""
  });

  const services = [
    {
      id: 1,
      name: "Full Service",
      description: "Complete vehicle maintenance including oil change, filter replacement, and inspection",
      price: 2500,
      duration: "2-3 hours",
      category: "Maintenance",
      popularity: "High"
    },
    {
      id: 2,
      name: "Oil Change",
      description: "Engine oil and filter replacement with quality check",
      price: 800,
      duration: "30 minutes",
      category: "Maintenance",
      popularity: "High"
    },
    {
      id: 3,
      name: "Brake Service",
      description: "Brake pad inspection, replacement, and brake fluid check",
      price: 1200,
      duration: "1-2 hours",
      category: "Safety",
      popularity: "Medium"
    },
    {
      id: 4,
      name: "Engine Repair",
      description: "Comprehensive engine diagnosis and repair services",
      price: 3500,
      duration: "4-6 hours",
      category: "Repair",
      popularity: "Medium"
    },
    {
      id: 5,
      name: "Tire Rotation",
      description: "Tire rotation and alignment for even wear",
      price: 500,
      duration: "45 minutes",
      category: "Maintenance",
      popularity: "Medium"
    },
    {
      id: 6,
      name: "Battery Check",
      description: "Battery health check and terminal cleaning",
      price: 300,
      duration: "20 minutes",
      category: "Electrical",
      popularity: "Low"
    }
  ];

  const parts = [
    {
      id: 1,
      name: "Engine Oil (5W-30)",
      description: "High-quality synthetic engine oil",
      price: 450,
      stock: 25,
      category: "Fluids",
      supplier: "Castrol"
    },
    {
      id: 2,
      name: "Brake Pads",
      description: "Premium ceramic brake pads",
      price: 800,
      stock: 15,
      category: "Brake System",
      supplier: "Bosch"
    },
    {
      id: 3,
      name: "Air Filter",
      description: "High-efficiency air filter",
      price: 350,
      stock: 30,
      category: "Filters",
      supplier: "K&N"
    },
    {
      id: 4,
      name: "Spark Plugs",
      description: "Platinum tip spark plugs (set of 4)",
      price: 200,
      stock: 40,
      category: "Ignition",
      supplier: "NGK"
    },
    {
      id: 5,
      name: "Chain & Sprocket Kit",
      description: "Heavy-duty chain and sprocket set for motorcycles",
      price: 1200,
      stock: 8,
      category: "Drive Train",
      supplier: "DID"
    },
    {
      id: 6,
      name: "Clutch Plates",
      description: "OEM quality clutch friction plates",
      price: 900,
      stock: 12,
      category: "Transmission",
      supplier: "Exedy"
    }
  ];

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = () => {
    if (!newService.name || !newService.price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    toast.success("Service added successfully!");
    setShowAddServiceForm(false);
    setNewService({
      name: "",
      description: "",
      price: "",
      duration: "",
      category: ""
    });
  };

  const handleAddPart = () => {
    if (!newPart.name || !newPart.price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    toast.success("Part added successfully!");
    setShowAddPartForm(false);
    setNewPart({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: ""
    });
  };

  const getPopularityColor = (popularity) => {
    switch (popularity) {
      case 'High':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (stock) => {
    if (stock > 20) return 'bg-green-100 text-green-800';
    if (stock > 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

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
                {/* Services Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Services Catalog</h2>
                    <p className="text-gray-600">Manage your service offerings and pricing</p>
                  </div>
                  <Dialog open={showAddServiceForm} onOpenChange={setShowAddServiceForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
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
                              value={newService.price}
                              onChange={(e) => setNewService({...newService, price: e.target.value})}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="serviceDuration">Duration</Label>
                            <Input 
                              id="serviceDuration"
                              value={newService.duration}
                              onChange={(e) => setNewService({...newService, duration: e.target.value})}
                              placeholder="e.g., 2 hours"
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
                        <Button onClick={handleAddService} className="w-full bg-blue-600 hover:bg-blue-700">
                          Add Service
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Services Grid */}
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
                              <Badge className={getPopularityColor(service.popularity)}>
                                {service.popularity}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-semibold text-green-600">₹{service.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span>{service.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <Badge variant="outline">{service.category}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Parts Tab */}
            <TabsContent value="parts">
              <div className="space-y-6">
                {/* Parts Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Parts Inventory</h2>
                    <p className="text-gray-600">Manage your spare parts stock and pricing</p>
                  </div>
                  <Dialog open={showAddPartForm} onOpenChange={setShowAddPartForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
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
                        <div>
                          <Label htmlFor="partDescription">Description</Label>
                          <Textarea 
                            id="partDescription"
                            value={newPart.description}
                            onChange={(e) => setNewPart({...newPart, description: e.target.value})}
                            placeholder="Describe the part"
                            rows={3}
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
                              value={newPart.stock}
                              onChange={(e) => setNewPart({...newPart, stock: e.target.value})}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="partCategory">Category</Label>
                          <Input 
                            id="partCategory"
                            value={newPart.category}
                            onChange={(e) => setNewPart({...newPart, category: e.target.value})}
                            placeholder="e.g., Filters, Brake System"
                          />
                        </div>
                        <Button onClick={handleAddPart} className="w-full bg-green-600 hover:bg-green-700">
                          Add Part
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Parts Grid */}
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
                              <Badge className={getStockColor(part.stock)}>
                                {part.stock} in stock
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{part.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-semibold text-green-600">₹{part.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <Badge variant="outline">{part.category}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Supplier:</span>
                            <span>{part.supplier}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Services;
