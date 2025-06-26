import { useEffect, useState } from "react";
import { rejectAdjustment } from "@/services/requests";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Plus, MessageSquare, MapPin, Calendar, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PriceAdjustmentNotification from "@/components/client/PriceAdjustmentNotification";
import { useToast } from "@/hooks/use-toast";


interface PriceAdjustment {
  id: string;
  missionId: string;
  providerName: string;
  serviceName: string;
  originalPrice: number;
  newPrice: number;
  justification: string;
  photos: string[];
  videos: string[];
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(()=>{
    if (!user) {
      navigate("/login");
      return null;
    }
    if (user.role === 0) {
      navigate("/client/dashboard");
    } else if (user.role === 1) {
      navigate("/provider/dashboard")
    } else {
      navigate("/admin/dashboard")
    }
  }, [])
  
  // Mock data pour les ajustements tarifaires
  const [priceAdjustments, setPriceAdjustments] = useState<PriceAdjustment[]>([ // Fetch from database
    {
      id: "adj-1",
      missionId: "mission-123",
      providerName: "Pierre Martin",
      serviceName: "Tonte de pelouse",
      originalPrice: 65,
      newPrice: 85,
      justification: "Terrain en forte pente nécessitant un équipement spécialisé et plus de temps. La surface est également plus importante que prévu avec plusieurs obstacles (arbres, massifs).",
      photos: ["photo1.jpg", "photo2.jpg"],
      videos: ["video1.mp4"],
      timestamp: new Date(Date.now() - 3600000), // 1h ago
      status: 'pending'
    },
    {
      id: "adj-2", 
      missionId: "mission-124",
      providerName: "Sophie Durand",
      serviceName: "Montage de meuble",
      originalPrice: 45,
      newPrice: 60,
      justification: "Meuble plus complexe que prévu avec de nombreuses pièces. Nécessite un outillage spécialisé pour les fixations murales.",
      photos: ["photo3.jpg"],
      videos: [],
      timestamp: new Date(Date.now() - 7200000), // 2h ago
      status: 'accepted'
    }
  ]);

  const handleAcceptAdjustment = async (adjustmentId: string, feedback?: string) => {
    setPriceAdjustments(prev =>
      prev.map(adj =>
        adj.id === adjustmentId
          ? { ...adj, status: 'accepted' as const }
          : adj
      )
    );
    console.log('Adjustment accepted:', adjustmentId, 'Feedback:', feedback);
  };

  const handleRejectAdjustment = async (adjustmentId: string, reason: string) => {
    setPriceAdjustments(prev =>
      prev.map(adj =>
        adj.id === adjustmentId
          ? { ...adj, status: 'rejected' as const }
          : adj
      )
    );
    try {
      await rejectAdjustment(adjustmentId, reason);
      toast.success("Ajustement refusé.");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const pendingAdjustments = priceAdjustments.filter(adj => adj.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/93345a67-4688-418b-8793-ad045f122f8d.png" 
                alt="GreenGo France" 
                className="h-28 w-auto" 
              />
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Bonjour, {user.name}</span>
                {pendingAdjustments.length > 0 && (
                  <div className="relative">
                    <Bell className="h-5 w-5 text-orange-500" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {pendingAdjustments.length}
                    </Badge>
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={() => {logout(); navigate('/')}}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de bord client
            </h1>
            <p className="text-gray-600">
              Gérez vos demandes de services et suivez vos interventions
            </p>
          </div>

          {/* Notifications d'ajustement tarifaire */}
          <PriceAdjustmentNotification
            adjustments={priceAdjustments}
            onAcceptAdjustment={handleAcceptAdjustment}
            onRejectAdjustment={handleRejectAdjustment}
          />

          {/* Actions rapides */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/client/create-request">
                <CardContent className="p-6 text-center">
                  <Plus className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium">Nouvelle demande</h3>
                  <p className="text-sm text-gray-600">Créer une demande</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/client/my-requests">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium">Mes demandes</h3>
                  <p className="text-sm text-gray-600">Suivre mes demandes</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/chat">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium">Messages</h3>
                  <p className="text-sm text-gray-600">Chat avec prestataires</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/client/order-history">
                <CardContent className="p-6 text-center">
                  <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h3 className="font-medium">Historique</h3>
                  <p className="text-sm text-gray-600">Mes anciennes demandes</p>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Statistiques */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demandes actives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">3</div>
                <p className="text-sm text-gray-600">En cours de traitement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Services terminés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                <p className="text-sm text-gray-600">Ce mois-ci</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Note moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">4.8/5</div>
                <p className="text-sm text-gray-600">Satisfaction prestataires</p>
              </CardContent>
            </Card>
          </div>

          {/* Demandes récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Demandes récentes</CardTitle>
              <CardDescription>
                Aperçu de vos dernières demandes de services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    service: "Tonte de pelouse",
                    provider: "Pierre Martin",
                    status: "En cours",
                    location: "Lyon 3e",
                    date: "Aujourd'hui 14h"
                  },
                  {
                    id: 2,
                    service: "Montage de meuble",
                    provider: "Sophie Durand", 
                    status: "Acceptée",
                    location: "Lyon 6e",
                    date: "18 Jan 16h"
                  },
                  {
                    id: 3,
                    service: "Jardinage",
                    provider: "En attente",
                    status: "Recherche",
                    location: "Villeurbanne",
                    date: "20 Jan 10h"
                  }
                ].map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{request.service}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{request.provider}</span>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{request.location}</span>
                          <span>•</span>
                          <span>{request.date}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        request.status === "En cours" ? "default" :
                        request.status === "Acceptée" ? "secondary" : "outline"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
