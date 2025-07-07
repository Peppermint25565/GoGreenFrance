
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Users, FileCheck, Euro, Activity, CheckCircle, XCircle, Clock, Settings, Truck, BarChart3 } from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import MissionTracking from "@/components/admin/MissionTracking";
import WasteManagement from "@/components/admin/WasteManagement";
import ContentManagement from "@/components/admin/ContentManagement";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');


  // useEffect(()=>{
  //   if (!user) {
  //     navigate("/login");
  //     return null;
  //   }
  //   if (user.role === 0) {
  //     navigate("/client/dashboard");
  //   } else if (user.role === 1) {
  //     navigate("/provider/dashboard")
  //   } else {
  //     navigate("/admin/dashboard")
  //   }
  // }, [])

  const pendingProviders = [
    {
      id: 1,
      name: "Marc Dubois",
      email: "marc.dubois@email.com",
      specializations: ["Jardinage"],
      zone: "Lyon",
      submittedAt: "2024-01-18",
      documents: ["CNI", "Assurance"]
    },
    {
      id: 2,
      name: "Julie Martin",
      email: "julie.martin@email.com",
      specializations: ["Bricolage", "Jardinage"],
      zone: "Marseille",
      submittedAt: "2024-01-17",
      documents: ["CNI", "Assurance", "Diplôme"]
    }
  ];

  const recentRequests = [
    {
      id: 1,
      service: "Tonte de pelouse",
      client: "Jean D.",
      provider: "Pierre M.",
      amount: 65,
      commission: 6.5,
      status: "Terminé",
      date: "2024-01-15"
    },
    {
      id: 2,
      service: "Montage meuble",
      client: "Marie L.",
      provider: "Sophie D.",
      amount: 45,
      commission: 4.5,
      status: "En cours",
      date: "2024-01-14"
    }
  ];

  const handleProviderAction = (providerId: number, action: 'approve' | 'reject') => {
    console.log(`${action} provider ${providerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/logo.png" 
                  alt="GreenGo France" 
                  className="h-28 w-auto" 
                />
              </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm sm:text-base text-gray-600">Admin: {user.name}</span>
              <Button variant="outline" onClick={() => {logout(); navigate('/')}} size="sm">
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord administrateur
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Supervision complète de la plateforme et gestion des opérations
              </p>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Prestataires actifs</p>
                      <p className="text-xl sm:text-2xl font-bold">127</p>
                      <p className="text-xs text-green-600">+8 ce mois</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <FileCheck className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">En validation</p>
                      <p className="text-xl sm:text-2xl font-bold">{pendingProviders.length}</p>
                      <p className="text-xs text-orange-600">Action requise</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Missions actives</p>
                      <p className="text-xl sm:text-2xl font-bold">34</p>
                      <p className="text-xs text-blue-600">2 en urgence</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Euro className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">CA ce mois</p>
                      <p className="text-xl sm:text-2xl font-bold">15,240€</p>
                      <p className="text-xs text-green-600">+12% vs N-1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Navigation Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex flex-wrap gap-2 sm:gap-4">
                  {[
                    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                    { id: 'users', label: 'Comptes utilisateurs', icon: Users },
                    { id: 'missions', label: 'Missions temps réel', icon: Activity },
                    { id: 'waste', label: 'Tournées déchets', icon: Truck },
                    { id: 'content', label: 'Contenu & tarifs', icon: Settings },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-2 px-3 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Zones actives */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Zones les plus actives</CardTitle>
                    <CardDescription>
                      Répartition géographique des missions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { zone: "Lyon", missions: 45, ca: "3,240€", growth: "+15%" },
                        { zone: "Marseille", missions: 38, ca: "2,890€", growth: "+8%" },
                        { zone: "Paris", missions: 52, ca: "4,120€", growth: "+22%" },
                        { zone: "Toulouse", missions: 29, ca: "2,100€", growth: "+5%" },
                      ].map((zone) => (
                        <div key={zone.zone} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{zone.zone}</div>
                            <div className="text-sm text-gray-500">{zone.missions} missions</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{zone.ca}</div>
                            <div className="text-sm text-green-600">{zone.growth}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Providers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Prestataires en attente de validation</CardTitle>
                    <CardDescription className="text-sm">
                      Vérifiez les documents et validez les nouveaux prestataires
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingProviders.map((provider) => (
                        <div key={provider.id} className="border rounded-lg p-4">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base sm:text-lg mb-2">{provider.name}</h3>
                              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                                <p>Email: {provider.email}</p>
                                <p>Zone: {provider.zone}</p>
                                <p>Soumis le: {provider.submittedAt}</p>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {provider.specializations.map((spec) => (
                                  <Badge key={spec} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {provider.documents.map((doc) => (
                                  <Badge key={doc} variant="outline" className="text-xs">
                                    {doc}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() => handleProviderAction(provider.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Refuser
                              </Button>
                              <Button
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() => handleProviderAction(provider.id, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Valider
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'missions' && <MissionTracking />}
            {activeTab === 'waste' && <WasteManagement />}
            {activeTab === 'content' && <ContentManagement />}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Revenue Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Revenus & Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Aujourd'hui</span>
                  <span className="font-semibold">234€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cette semaine</span>
                  <span className="font-semibold">1,580€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ce mois</span>
                  <span className="font-semibold text-green-600">15,240€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taux commission</span>
                  <span className="font-semibold">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Satisfaction client</span>
                  <span className="font-semibold text-blue-600">4.7/5</span>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Activité récente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Prestataire validé: Marie D.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Mission urgente créée - Lyon</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Paiement traité: 65€</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Tournée déchets démarrée</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">3 nouveaux clients inscrits</span>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Validation prestataires
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Missions en urgence
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Truck className="h-4 w-4 mr-2" />
                  Planifier tournée
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Euro className="h-4 w-4 mr-2" />
                  Rapports financiers
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres système
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">État du système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Service</span>
                  <Badge variant="default">Opérationnel</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Base de données</span>
                  <Badge variant="default">Opérationnel</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Paiements</span>
                  <Badge variant="default">Opérationnel</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notifications</span>
                  <Badge variant="secondary">Maintenance</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
