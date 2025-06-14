
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Search,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { Invoice, Customer, Vehicle } from "@/types/billing";

interface MobileInvoiceTableProps {
  invoices: Invoice[];
  customers: Customer[];
  vehicles: Vehicle[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onEmail: (invoice: Invoice) => void;
}

const MobileInvoiceTable = ({
  invoices,
  customers,
  vehicles,
  onEdit,
  onDelete,
  onEmail
}: MobileInvoiceTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || "Unknown Customer";
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown Vehicle";
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredAndSortedInvoices = invoices
    .filter(invoice => {
      const customerName = getCustomerName(invoice.customerId).toLowerCase();
      const vehicleInfo = getVehicleInfo(invoice.vehicleId).toLowerCase();
      const invoiceNumber = invoice.invoiceNumber.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      return customerName.includes(search) || 
             vehicleInfo.includes(search) || 
             invoiceNumber.includes(search);
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'amount':
          comparison = a.total - b.total;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: 'date' | 'amount' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile Search and Filter Header */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-blue-500"
          />
        </div>
        
        {/* Sort Options */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={sortBy === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('date')}
            className="flex items-center gap-2 whitespace-nowrap h-10 px-4"
          >
            Date
            {sortBy === 'date' && (
              sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant={sortBy === 'amount' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('amount')}
            className="flex items-center gap-2 whitespace-nowrap h-10 px-4"
          >
            Amount
            {sortBy === 'amount' && (
              sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant={sortBy === 'status' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('status')}
            className="flex items-center gap-2 whitespace-nowrap h-10 px-4"
          >
            Status
            {sortBy === 'status' && (
              sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Invoice Cards */}
      <div className="space-y-3">
        {filteredAndSortedInvoices.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              {searchTerm ? "No invoices match your search" : "No invoices found"}
            </div>
          </Card>
        ) : (
          filteredAndSortedInvoices.map(invoice => (
            <Card key={invoice.id} className="p-4 touch-manipulation">
              <CardContent className="p-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                      {invoice.invoiceNumber}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      {getCustomerName(invoice.customerId)}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {getVehicleInfo(invoice.vehicleId)}
                    </p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="font-bold text-lg text-gray-900 mb-1">
                      ₹{invoice.total.toLocaleString()}
                    </p>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="capitalize">{invoice.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <span>Created: {new Date(invoice.createdAt).toLocaleDateString()}</span>
                  {invoice.status === 'overdue' && (
                    <span className="text-red-500 font-medium">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Action Buttons - Optimized for Touch */}
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEdit(invoice)} 
                    className="h-12 flex flex-col gap-1 touch-manipulation"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">View</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEdit(invoice)} 
                    className="h-12 flex flex-col gap-1 touch-manipulation"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="text-xs">Edit</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onDelete(invoice.id)}
                    className="h-12 flex flex-col gap-1 text-red-500 hover:text-red-700 touch-manipulation"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-xs">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MobileInvoiceTable;
