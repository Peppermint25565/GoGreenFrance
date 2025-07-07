
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft, TrendingUp, Calendar, Euro, Star, BarChart3, Users, User } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const ProviderStats = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const monthlyEarnings = [
    { month: "Jan", revenus: 850, missions: 5 },
    { month: "Fév", revenus: 1200, missions: 7 },
    { month: "Mar", revenus: 950, missions: 6 },
    { month: "Avr", revenus: 1450, missions: 9 },
    { month: "Mai", revenus: 1100, missions: 7 },
    { month: "Juin", revenus: 1380, missions: 8 }
  ];

  const chartConfig = {
    revenus: {
      label: "Revenus (€)",
      color: "#22c55e"
    },
    missions: {
      label: "Missions",
      color: "#3b82f6"
    }
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
              <span className="text-sm sm:text-base text-gray-600">Bonjour, {user.name}</span>
              <Link to="/client/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
              </Link>
              <Button variant="outline" onClick={() => {logout(); navigate('/')}} size="sm">
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <Link to="/provider/dashboard">
            <Button variant="outline" className="mb-4" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au dashboard
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">
            Statistiques prestataire
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            Analyse détaillée de votre activité et performances
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Revenus totaux</CardTitle>
              <Euro className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6">
              <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">6,930€</div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                <span className="text-green-600 font-medium">+18%</span> vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Missions réalisées</CardTitle>
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6">
              <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">42</div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                <span className="text-blue-600 font-medium">+25%</span> vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Note moyenne</CardTitle>
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6">
              <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">4.9/5</div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Basé sur 38 évaluations
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Clients fidèles</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6">
              <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">15</div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Clients récurrents
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Details */}
        <div className="space-y-4 sm:space-y-6">
          {/* Monthly Earnings Chart - Full width on mobile, responsive grid on larger screens */}
          <Card className="w-full">
            <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold">Évolution des revenus</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-600">
                Revenus et nombre de missions par mois
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6">
              <div className="w-full overflow-hidden">
                <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] lg:h-[300px] xl:h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={monthlyEarnings} 
                      margin={{ 
                        top: 10, 
                        right: 10, 
                        left: 0, 
                        bottom: 10 
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="month" 
                        fontSize={10}
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        interval={0}
                      />
                      <YAxis 
                        fontSize={10}
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        width={40}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenus" fill="#22c55e" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="missions" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Two column layout for larger screens, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold">Indicateurs de performance</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600">
                  Vos performances comparées aux autres prestataires
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Taux d'acceptation</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                      <div className="bg-green-600 h-2 sm:h-2.5 rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Ponctualité</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">96%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                      <div className="bg-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-500" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Qualité du travail</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">4.9/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                      <div className="bg-purple-600 h-2 sm:h-2.5 rounded-full transition-all duration-500" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Communication</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">4.8/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                      <div className="bg-orange-600 h-2 sm:h-2.5 rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Distribution */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold">Répartition des services</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600">
                  Vos spécialités et leur rentabilité
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-100 gap-2 sm:gap-3">
                    <div className="flex-1">
                      <span className="font-semibold text-sm sm:text-base text-gray-900">Jardinage</span>
                      <p className="text-xs sm:text-sm text-gray-600">28 missions réalisées</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="font-bold text-green-600 text-sm sm:text-base lg:text-lg">4,200€</span>
                      <p className="text-xs sm:text-sm text-gray-600">150€/mission</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100 gap-2 sm:gap-3">
                    <div className="flex-1">
                      <span className="font-semibold text-sm sm:text-base text-gray-900">Bricolage</span>
                      <p className="text-xs sm:text-sm text-gray-600">14 missions réalisées</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="font-bold text-blue-600 text-sm sm:text-base lg:text-lg">2,730€</span>
                      <p className="text-xs sm:text-sm text-gray-600">195€/mission</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reviews - Full width */}
          <Card>
            <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold">Derniers avis clients</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-600">
                Retours récents de vos clients
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-900 font-medium mb-1">
                    "Excellent travail, très professionnel!"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Marie L. - Tonte de pelouse</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-900 font-medium mb-1">
                    "Ponctuel et efficace, je recommande!"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Pierre M. - Montage meuble</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderStats;
