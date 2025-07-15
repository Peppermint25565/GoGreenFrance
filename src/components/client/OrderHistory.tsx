
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Eye, Search, Star, Euro, Clock } from "lucide-react";
import { db } from "@/firebaseConfig";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { Interface } from "readline";
import { Request } from "@/types/requests";

interface OrderHistoryProps {
  onViewDetails: (orderId: string) => void;
  onDownloadInvoice: (orderId: string) => void;
  onRateProvider: (orderId: string) => void;
}

function useOrders() {
  const [orders, setOrders] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const parsed = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Request, "id">) }));
        setOrders(parsed);
      } catch (err) {
        console.error("Erreur lors du chargement des commandes", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { orders, loading };
}

const OrderHistory = ({ onViewDetails, onDownloadInvoice, onRateProvider }: OrderHistoryProps) => {
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

    const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      const matchesDate =
        dateFilter === "all" ||
        (() => {
          const orderDate = order.createdAt.toDate();
          const now = new Date();
          const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

          switch (dateFilter) {
            case "week":
              return daysDiff <= 7;
            case "month":
              return daysDiff <= 30;
            case "year":
              return daysDiff <= 365;
            default:
              return true;
          }
        })();

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status === "completed");
    const totalSpent = completed.reduce((sum, o) => sum + (o.priceFinal ? o.priceFinal : o.priceOriginal), 0);
    const rated = completed.filter((o) => o.rating !== undefined);
    const avgRating =
      rated.length === 0 ? null : rated.reduce((s, o) => s + (o.rating ?? 0), 0) / rated.length;

    return {
      totalSpent,
      completedCount: completed.length,
      avgRating,
    };
  }, [orders]);

  const getStatusBadge = (status: Request["status"]) => {
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

  const formatDate = (ts: Timestamp) => {
    return ts.toDate().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total dépensé</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalSpent}€</p>
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
                <p className="text-2xl font-bold">{stats.completedCount}</p>
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
                <p className="text-2xl font-bold">{stats.avgRating ? stats.avgRating : "-"} / 5</p>
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
                      <h3 className="font-medium">{order.category}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <span>Réf: {order.id}</span>
                      {order.providerName && (<span>Prestataire: {order.providerName}</span>)}
                      <span>Date: {order.createdAt.toDate().toDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-semibold text-green-600">{order.priceFinal ? order.priceFinal : order.priceOriginal}€</span>
                      {order.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{order.rating}/5</span>
                        </div>
                      )}
                    </div>
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
