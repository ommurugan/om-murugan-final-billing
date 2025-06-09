
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Car,
  Edit,
  Trash2,
  Eye,
  User
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const Customers = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    vehicleModel: "",
    vehicleNumber: ""
  });

  const customers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@email.com",
      address: "123 Main Street, Chennai",
      vehicles: [
        { model: "Honda City", number: "TN 01 AB 1234", lastService: "2024-01-15" }
      ],
      totalBills: 5,
      totalAmount: 12500,
      status: "Active"
    },
    {
      id: 2,
      name: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "priya.sharma@email.com",
      address: "456 Oak Avenue, Bangalore",
      vehicles: [
        { model: "Yamaha R15", number: "KA 02 CD 5678", lastService: "2024-01-10" }
      ],
      totalBills: 3,
      totalAmount: 4800,
      status: "Active"
    },
    {
      id: 3,
      name: "Anand Patel",
      phone: "+91 76543 21098",
      email: "anand.patel@email.com",
      address: "789 Pine Road, Mumbai",
      vehicles: [
        { model: "Maruti Swift", number: "MH 03 EF 9012", lastService: "2024-01-05" },
        { model: "Honda Activa", number: "MH 03 GH 3456", lastService: "2023-12-20" }
      ],
      totalBills: 8,
      totalAmount: 18200,
      status: "Active"
    },
    {
      id: 4,
      name: "Meera Reddy",
      phone: "+91 65432 10987",
      email: "meera.reddy@email.com",
      address: "321 Cedar Lane, Hyderabad",
      vehicles: [
        { model: "Royal Enfield Classic", number: "TS 04 IJ 7890", lastService: "2023-12-15" }
      ],
      totalBills: 2,
      totalAmount: 6500,
      status: "Inactive"
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.vehicles.some(vehicle => 
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.number.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Please fill in required fields");
      return;
    }
    
    toast.success("Customer added successfully!");
    setShowAddForm(false);
    setNewCustomer({
      name: "",
      phone: "",
      email: "",
      address: "",
      vehicleModel: "",
      vehicleNumber: ""
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Enter customer details to create a new record
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
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
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                      placeholder="Enter address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleModel">Vehicle Model</Label>
                    <Input 
                      id="vehicleModel"
                      value={newCustomer.vehicleModel}
                      onChange={(e) => setNewCustomer({...newCustomer, vehicleModel: e.target.value})}
                      placeholder="e.g., Honda City, Yamaha R15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                    <Input 
                      id="vehicleNumber"
                      value={newCustomer.vehicleNumber}
                      onChange={(e) => setNewCustomer({...newCustomer, vehicleNumber: e.target.value})}
                      placeholder="e.g., TN 01 AB 1234"
                    />
                  </div>
                  <Button onClick={handleAddCustomer} className="w-full bg-blue-600 hover:bg-blue-700">
                    Add Customer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-6">
          {/* Search and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search customers by name, phone, or vehicle..." 
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

          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.status === 'Active').length}</p>
                  <p className="text-sm text-gray-600">Active Customers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{customers.reduce((sum, c) => sum + c.totalBills, 0)}</p>
                  <p className="text-sm text-gray-600">Total Services</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">₹{customers.reduce((sum, c) => sum + c.totalAmount, 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customers List */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>Manage your customer information and service history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
                            <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                              {customer.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{customer.address}</span>
                            </div>
                          </div>
                          
                          {/* Vehicle Information */}
                          <div className="mt-3">
                            <h4 className="font-medium text-gray-900 mb-2">Vehicles:</h4>
                            <div className="space-y-2">
                              {customer.vehicles.map((vehicle, index) => (
                                <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded text-sm">
                                  <Car className="h-4 w-4 text-gray-600" />
                                  <span className="font-medium">{vehicle.model}</span>
                                  <span className="text-gray-600">•</span>
                                  <span>{vehicle.number}</span>
                                  <span className="text-gray-600">•</span>
                                  <span className="text-gray-500">Last service: {vehicle.lastService}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right text-sm">
                          <p className="font-semibold">{customer.totalBills} Services</p>
                          <p className="text-gray-600">₹{customer.totalAmount.toLocaleString()} Total</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No customers found matching your search.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Customers;
