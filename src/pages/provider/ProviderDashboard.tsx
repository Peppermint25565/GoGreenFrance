import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Leaf, User, CheckCircle, Clock, Euro, Settings, BarChart3, 
  BookOpen, FileCheck, MapPin, Navigation, Phone, MessageSquare,
  Award, TrendingUp
} from "lucide-react";
import KYCVerification from "@/components/provider/KYCVerification";
import MissionDetail from "@/components/provider/MissionDetail";
import EarningsTracker from "@/components/provider/EarningsTracker";

const ProviderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedMission, setSelectedMission] = useState<string | null>(null);

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

  const availableRequests = [
    {
      id: "1",
      title: "Taille de haies",
      description: "Taille de haies de laurier sur 20 mètres, hauteur 2m",
      client: {
        name: "Marie Dubois",
        avatar: "",
        phone: "06 12 34 56 78",
        rating: 4.8
      },
      location: {
        address: "15 Rue de la Paix, 13008 Marseille",
        distance: "2.3 km",
        coordinates: { lat: 43.2965, lng: 5.3698 }
      },
      schedule: {
        date: "2024-01-20",
        timeSlot: "14h00 - 17h00",
        estimatedDuration: "3h00"
      },
      payment: {
        amount: 80,
        currency: "EUR",
        paymentMethod: "Paiement automatique",
        minPrice: 60,
        maxPrice: 120
      },
      requirements: [
        "Évacuation des déchets verts incluse",
        "Taille selon les règles de l'art",
        "Nettoyage du site après intervention"
      ],
      tools: ["Taille-haie", "Sécateur", "Bâche", "Sacs déchets verts"],
      status: "available" as const,
      acceptDeadline: "19/01/2024 à 18h00",
      urgency: "normal" as const,
      category: "jardinage"
    },
    {
      id: "2",
      title: "Montage meuble IKEA",
      description: "Montage d'une armoire PAX 3 portes avec aménagement intérieur",
      client: {
        name: "Pierre Martin",
        avatar: "",
        phone: "06 98 76 54 32",
        rating: 4.5
      },
      location: {
        address: "42 Avenue Victor Hugo, 69003 Lyon",
        distance: "5.1 km",
        coordinates: { lat: 45.7640, lng: 4.8357 }
      },
      schedule: {
        date: "2024-01-21",
        timeSlot: "09h00 - 12h00",
        estimatedDuration: "3h00"
      },
      payment: {
        amount: 85,
        currency: "EUR",
        paymentMethod: "Paiement automatique",
        minPrice: 65,
        maxPrice: 130
      },
      requirements: [
        "Outils fournis par le prestataire",
        "Montage selon les instructions IKEA",
        "Test de fonctionnement final"
      ],
      tools: ["Perceuse", "Visseuse", "Niveau", "Mètre"],
      status: "available" as const,
      acceptDeadline: "20/01/2024 à 20h00",
      urgency: "high" as const,
      category: "bricolage"
    }
  ];

  const myJobs = [
    {
      id: "3",
      title: "Tonte de pelouse",
      description: "Tonte pelouse 200m² avec ramassage",
      client: {
        name: "Sophie L.",
        avatar: "",
        phone: "06 11 22 33 44",
        rating: 4.9
      },
      location: {
        address: "8 Impasse des Roses, 75015 Paris",
        distance: "1.2 km",
        coordinates: { lat: 48.8566, lng: 2.3522 }
      },
      schedule: {
        date: "2024-01-18",
        timeSlot: "14h00 - 16h00",
        estimatedDuration: "2h00"
      },
      payment: {
        amount: 65,
        currency: "EUR",
        paymentMethod: "Paiement automatique",
        minPrice: 45,
        maxPrice: 95
      },
      requirements: [
        "Ramassage obligatoire",
        "Respect des bordures"
      ],
      tools: ["Tondeuse", "Débroussailleuse", "Râteau"],
      status: "in_progress" as const,
      acceptDeadline: "",
      urgency: "normal" as const,
      category: "jardinage"
    }
  ];

  const handleAcceptMission = (missionId: string) => {
    console.log("Mission acceptée:", missionId);
    // Logic pour accepter la mission
  };

  const handleDeclineMission = (missionId: string) => {
    console.log("Mission refusée:", missionId);
    // Logic pour refuser la mission
  };

  const handleUpdateMissionStatus = (missionId: string, status: string) => {
    console.log("Statut mission mis à jour:", missionId, status);
    // Logic pour mettre à jour le statut
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Prioritaire</Badge>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "jardinage":
        return "🌱";
      case "bricolage":
        return "🔧";
      default:
        return "📋";
    }
  };

  // Si une mission est sélectionnée, afficher le détail
  if (selectedMission) {
    const mission = [...availableRequests, ...myJobs].find(m => m.id === selectedMission);
    if (mission) {
      return (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <img 
                      src="/lovable-uploads/logo.png" 
                      alt="GreenGo France" 
                      className="h-28 w-auto" 
                    />
                  </Link>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={() => setSelectedMission(null)}>
                    ← Retour
                  </Button>
                  <span className="text-gray-600">Bonjour, {user.name}</span>
                  <Button variant="outline" onClick={() => {logout(); navigate('/')}}>
                    Déconnexion
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <MissionDetail
              mission={mission}
              onAccept={handleAcceptMission}
              onDecline={handleDeclineMission}
              onUpdateStatus={handleUpdateMissionStatus}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/logo.png" 
                alt="GreenGo France" 
                className="h-28 w-auto" 
              />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Bonjour, {user.name}</span>
              <Link to="/provider/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
              </Link>
              <Button variant="outline" onClick={() => {logout(); navigate('/')}}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord prestataire
          </h1>
          <p className="text-gray-600">
            Gérez vos missions et développez votre activité
          </p>
        </div>

        <Tabs defaultValue="missions" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="kyc">Vérification</TabsTrigger>
            <TabsTrigger value="earnings">Revenus</TabsTrigger>
            <TabsTrigger value="performance">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="missions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Available Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle>Missions disponibles</CardTitle>
                    <CardDescription>
                      Nouvelles opportunités dans votre zone d'intervention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {availableRequests.map((request) => (
                        <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg">{getCategoryIcon(request.category)}</span>
                                <h3 className="font-semibold text-lg">{request.title}</h3>
                                <Badge variant="outline">
                                  {request.category}
                                </Badge>
                                {getUrgencyBadge(request.urgency)}
                              </div>
                              <p className="text-gray-600 mb-2">{request.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {request.location.distance}
                                </span>
                                <span>{request.schedule.date}</span>
                                <span>{request.schedule.timeSlot}</span>
                              </div>
                              <div className="mt-2 text-xs text-orange-600">
                                <Clock className="h-3 w-3 inline mr-1" />
                                Accepter avant: {request.acceptDeadline}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 mb-2">{request.payment.amount}€</div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedMission(request.id)}
                                >
                                  Voir détails
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleAcceptMission(request.id)}
                                >
                                  Accepter
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* My Jobs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mes missions en cours</CardTitle>
                    <CardDescription>
                      Missions acceptées et en cours de réalisation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {myJobs.map((job) => (
                        <div key={job.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg">{getCategoryIcon(job.category)}</span>
                                <h3 className="font-semibold">{job.title}</h3>
                                <Badge variant="default">
                                  <Clock className="h-3 w-3 mr-1" />
                                  En cours
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-2">
                                {job.client.name} • {job.location.address.split(',')[0]} • {job.schedule.date}
                              </p>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Phone className="h-4 w-4 mr-1" />
                                  Appeler
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Chat
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Navigation className="h-4 w-4 mr-1" />
                                  GPS
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-600 mb-2">{job.payment.amount}€</div>
                              <Button 
                                size="sm"
                                onClick={() => setSelectedMission(job.id)}
                              >
                                Gérer mission
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statut du profil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-600">Profil vérifié</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Spécialités</span>
                        <span className="font-medium">Jardinage, Bricolage</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zone</span>
                        <span className="font-medium">Paris et banlieue</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Note moyenne</span>
                        <span className="font-medium">4.9/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Missions réalisées</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">En cours</span>
                      <span className="font-semibold text-blue-600">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenus ce mois</span>
                      <span className="font-semibold text-green-600">1,250€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taux d'acceptation</span>
                      <span className="font-semibold">85%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link to="/provider/profile">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Modifier profil
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start">
                      <FileCheck className="h-4 w-4 mr-2" />
                      Documents KYC
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Formation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Euro className="h-4 w-4 mr-2" />
                      Revenus
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kyc">
            <KYCVerification />
          </TabsContent>

          <TabsContent value="earnings">
            <EarningsTracker />
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid gap-6">
              {/* Performance Overview */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-600">Taux de réussite</span>
                    </div>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-xs text-gray-500">+2% ce mois</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Ponctualité</span>
                    </div>
                    <div className="text-2xl font-bold">98%</div>
                    <p className="text-xs text-gray-500">Excellent</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm text-gray-600">Satisfaction</span>
                    </div>
                    <div className="text-2xl font-bold">4.8/5</div>
                    <p className="text-xs text-gray-500">156 avis</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <span className="text-sm text-gray-600">Croissance</span>
                    </div>
                    <div className="text-2xl font-bold">+15%</div>
                    <p className="text-xs text-gray-500">Revenus mensuels</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des performances</CardTitle>
                  <CardDescription>
                    Évolution de vos indicateurs clés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Évolution des revenus (6 derniers mois)</h4>
                      <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                        <p className="text-gray-500">Graphique des revenus mensuels</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Répartition par type de mission</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">🌱 Jardinage</span>
                            <span className="text-sm font-medium">65% (156 missions)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">🔧 Bricolage</span>
                            <span className="text-sm font-medium">35% (84 missions)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderDashboard;
