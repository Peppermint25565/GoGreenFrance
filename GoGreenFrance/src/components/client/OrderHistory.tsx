
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Eye, Search, Star, Euro, Clock } from "lucide-react";

interface Order {
  id: string;
  service: string;
  provider: string;
  date: string;
  amount: number;
  status: "completed" | "cancelled" | "in_progress";
  rating?: number;
  invoiceUrl?: string;
}

interface OrderHistoryProps {
  onViewDetails: (orderId: string) => void;
  onDownloadInvoice: (orderId: string) => void;
  onRateProvider: (orderId: string) => void;
}

const OrderHistory = ({ onViewDetails, onDownloadInvoice, onRateProvider }: OrderHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const orders: Order[] = [
    {
      id: "CMD-001",
      service: "Tonte de pelouse",
      provider: "Pierre Martin",
      date: "2024-01-15",
      amount: 65,
      status: "completed",
      rating: 5,
      invoiceUrl: "#"
    },
    {
      id: "CMD-002",
      service: "Montage meuble IKEA",
      provider: "Sophie Durand",
      date: "2024-01-10",
      amount: 45,
      status: "completed",
      rating: 4,
      invoiceUrl: "#"
    },
    {
      id: "CMD-003",
      service: "Taille de haies",
      provider: "Marc Dubois",
      date: "2024-01-08",
      amount: 120,
      status: "completed",
      invoiceUrl: "#"
    },
    {
      id: "CMD-004",
      service: "Réparation robinet",
      provider: "Julie Moreau",
      date: "2024-01-05",
      amount: 80,
      status: "in_progress"
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    const matchesDate = dateFilter === "all" || (() => {
      const orderDate = new Date(order.date);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case "week": return daysDiff <= 7;
        case "month": return daysDiff <= 30;
        case "year": return daysDiff <= 365;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const totalSpent = filteredOrders
    .filter(order => order.status === "completed")
    .reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total dépensé</p>
                <p className="text-2xl font-bold text-green-600">{totalSpent}€</p>
              </div>
              <Euro className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Missions terminées</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === "completed").length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note moyenne</p>
                <p className="text-2xl font-bold">4.7/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Liste des commandes */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{order.service}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <span>Réf: {order.id}</span>
                      <span>Prestataire: {order.provider}</span>
                      <span>Date: {formatDate(order.date)}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-semibold text-green-600">{order.amount}€</span>
                      {order.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{order.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(order.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                    
                    {order.invoiceUrl && (
                      <Button variant="outline" size="sm" onClick={() => onDownloadInvoice(order.id)}>
                        <Download className="h-4 w-4 mr-1" />
                        Facture
                      </Button>
                    )}
                    
                    {order.status === "completed" && !order.rating && (
                      <Button size="sm" onClick={() => onRateProvider(order.id)}>
                        <Star className="h-4 w-4 mr-1" />
                        Noter
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune commande trouvée avec ces critères
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;
