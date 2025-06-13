import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Edit,
  Trash2,
  Eye,
  User,
  Save,
  X
} from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import StandardHeader from "@/components/StandardHeader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCustomers, useCreateCustomer } from "@/hooks/useCustomers";
import { useUpdateCustomer } from "@/hooks/useUpdateCustomer";
import { useDeleteCustomer } from "@/hooks/useDeleteCustomer";

const Customers = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  
  const { data: customers = [], isLoading } = useCustomers();
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();
  
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
    // Vehicle details
    vehicleMake: "",
    vehicleModel: "",
    vehicleNumber: "",
    vehicleType: "car",
    vehicleYear: new Date().getFullYear(),
    vehicleColor: "",
    engineNumber: "",
    chassisNumber: ""
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await createCustomerMutation.mutateAsync(newCustomer);
      setShowAddForm(false);
      setNewCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
        gstNumber: "",
        vehicleMake: "",
        vehicleModel: "",
        vehicleNumber: "",
        vehicleType: "car",
        vehicleYear: new Date().getFullYear(),
        vehicleColor: "",
        engineNumber: "",
        chassisNumber: ""
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer({...customer});
  };

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return;
    
    try {
      await updateCustomerMutation.mutateAsync(editingCustomer);
      setEditingCustomer(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomerMutation.mutateAsync(customerId);
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <StandardHeader title="Customers">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StandardHeader>
    );
  }

  return (
    <StandardHeader 
      title="Customers"
    >
      <div className="w-full">
        <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-full">
          {/* Header with Add Button */}
          <div className="flex justify-between items-center mb-6">
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Customer & Vehicle</DialogTitle>
                  <DialogDescription>
                    Enter customer and vehicle details to create a new record
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Customer Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Customer Name *</Label>
                        <Input 
                          id="name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input 
                          id="phone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gstNumber">GST Number</Label>
                        <Input 
                          id="gstNumber"
                          value={newCustomer.gstNumber}
                          onChange={(e) => setNewCustomer({...newCustomer, gstNumber: e.target.value})}
                          placeholder="Enter GST number (optional)"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address"
                          value={newCustomer.address}
                          onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                          placeholder="Enter address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                        <Input 
                          id="vehicleNumber"
                          value={newCustomer.vehicleNumber}
                          onChange={(e) => setNewCustomer({...newCustomer, vehicleNumber: e.target.value})}
                          placeholder="Enter vehicle number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                        <Select value={newCustomer.vehicleType} onValueChange={(value) => setNewCustomer({...newCustomer, vehicleType: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="bike">Bike</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="bus">Bus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="vehicleMake">Make</Label>
                        <Input 
                          id="vehicleMake"
                          value={newCustomer.vehicleMake}
                          onChange={(e) => setNewCustomer({...newCustomer, vehicleMake: e.target.value})}
                          placeholder="Enter vehicle make"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicleModel">Model</Label>
                        <Input 
                          id="vehicleModel"
                          value={newCustomer.vehicleModel}
                          onChange={(e) => setNewCustomer({...newCustomer, vehicleModel: e.target.value})}
                          placeholder="Enter vehicle model"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicleYear">Year</Label>
                        <Input 
                          id="vehicleYear"
                          type="number"
                          value={newCustomer.vehicleYear}
                          onChange={(e) => setNewCustomer({...newCustomer, vehicleYear: parseInt(e.target.value) || new Date().getFullYear()})}
                          placeholder="Enter vehicle year"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicleColor">Color</Label>
                        <Input 
                          id="vehicleColor"
                          value={newCustomer.vehicleColor}
                          onChange={(e) => setNewCustomer({...newCustomer, vehicleColor: e.target.value})}
                          placeholder="Enter vehicle color"
                        />
                      </div>
                      <div>
                        <Label htmlFor="engineNumber">Engine Number</Label>
                        <Input 
                          id="engineNumber"
                          value={newCustomer.engineNumber}
                          onChange={(e) => setNewCustomer({...newCustomer, engineNumber: e.target.value})}
                          placeholder="Enter engine number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="chassisNumber">Chassis Number</Label>
                        <Input 
                          id="chassisNumber"
                          value={newCustomer.chassisNumber}
                          onChange={(e) => setNewCustomer({...newCustomer, chassisNumber: e.target.value})}
                          placeholder="Enter chassis number"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddCustomer} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={createCustomerMutation.isPending}
                  >
                    {createCustomerMutation.isPending ? "Adding..." : "Add Customer & Vehicle"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search customers by name, phone, or email..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
                    <p className="text-sm text-gray-600">Total Customers</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Customers List */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>Manage your customer information and service history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {customers.length === 0 ? "No customers found. Add your first customer to get started." : "No customers found matching your search."}
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      {editingCustomer && editingCustomer.id === customer.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                              value={editingCustomer.name}
                              onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                              placeholder="Customer name"
                            />
                            <Input
                              value={editingCustomer.phone}
                              onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                              placeholder="Phone number"
                            />
                            <Input
                              value={editingCustomer.email || ""}
                              onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                              placeholder="Email address"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleUpdateCustomer} 
                              size="sm"
                              disabled={updateCustomerMutation.isPending}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              {updateCustomerMutation.isPending ? "Saving..." : "Save"}
                            </Button>
                            <Button onClick={() => setEditingCustomer(null)} variant="outline" size="sm">
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {getInitials(customer.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                                <Badge variant="default">Active</Badge>
                                {customer.gstNumber && (
                                  <Badge variant="secondary">GST</Badge>
                                )}
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{customer.phone}</span>
                                </div>
                                {customer.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{customer.email}</span>
                                  </div>
                                )}
                                {customer.address && (
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{customer.address}</span>
                                  </div>
                                )}
                                {customer.gstNumber && (
                                  <div className="text-xs text-gray-500">
                                    GST: {customer.gstNumber}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right text-sm">
                              <p className="text-gray-500">Joined: {new Date(customer.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleEditCustomer(customer)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteCustomer(customer.id)}
                                disabled={deleteCustomerMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BottomNavigation />
    </StandardHeader>
  );
};

export default Customers;
