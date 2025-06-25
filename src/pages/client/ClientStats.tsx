
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft, TrendingUp, Calendar, Euro, Star, BarChart3, PieChart } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from "recharts";

const ClientStats = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const monthlyData = [
    { month: "Jan", demandes: 2, depenses: 150 },
    { month: "Fév", demandes: 3, depenses: 220 },
    { month: "Mar", demandes: 1, depenses: 85 },
    { month: "Avr", demandes: 4, depenses: 340 },
    { month: "Mai", demandes: 2, depenses: 180 },
    { month: "Juin", demandes: 3, depenses: 295 }
  ];

  const serviceData = [
    { name: "Jardinage", value: 65, color: "#22c55e" },
    { name: "Bricolage", value: 35, color: "#3b82f6" }
  ];

  const chartConfig = {
    demandes: {
      label: "Demandes",
      color: "#22c55e"
    },
    depenses: {
      label: "Dépenses (€)",
      color: "#3b82f6"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <span className="text-xl sm:text-2xl font-bold text-foreground">ServicePro</span>
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <span className="text-sm sm:text-base text-muted-foreground">Bonjour, {user.name}</span>
              <Button variant="outline" onClick={logout} size="sm">
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Link to="/client/dashboard">
            <Button variant="outline" className="mb-4" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au dashboard
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Statistiques détaillées
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Analyse complète de votre activité sur ServicePro
          </p>
        </div>

        {/* KPI Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des demandes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+20%</span> vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépenses totales</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,270€</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">+15%</span> vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground">
                Basé sur 12 évaluations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Économies</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">320€</div>
              <p className="text-xs text-muted-foreground">
                vs tarifs moyens marché
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Monthly Evolution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Évolution mensuelle</CardTitle>
              <CardDescription className="text-sm">
                Nombre de demandes et dépenses par mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        fontSize={12}
                        tickMargin={5}
                      />
                      <YAxis 
                        fontSize={12}
                        tickMargin={5}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="demandes" fill="#22c55e" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="depenses" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Service Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Répartition des services</CardTitle>
              <CardDescription className="text-sm">
                Distribution de vos demandes par type de service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <RechartsPieChart data={serviceData}>
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4">
                {serviceData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs sm:text-sm">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Performance récente</CardTitle>
              <CardDescription className="text-sm">
                Vos dernières interactions et évaluations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm">Délai moyen de réponse</span>
                  <Badge variant="outline" className="self-start sm:self-auto">2.5h</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm">Taux de satisfaction</span>
                  <Badge className="bg-green-100 text-green-800 self-start sm:self-auto">96%</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm">Demandes répétées</span>
                  <Badge variant="outline" className="self-start sm:self-auto">8/15</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm">Prestataires favoris</span>
                  <Badge variant="outline" className="self-start sm:self-auto">3</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Savings Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Détail des économies</CardTitle>
              <CardDescription className="text-sm">
                Comparaison avec les tarifs du marché
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm">Jardinage</span>
                  <span className="text-green-600 font-medium text-xs sm:text-sm">-15% (180€)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm">Bricolage</span>
                  <span className="text-green-600 font-medium text-xs sm:text-sm">-12% (140€)</span>
                </div>
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 font-semibold">
                    <span className="text-xs sm:text-sm">Total économisé</span>
                    <span className="text-green-600 text-sm sm:text-base">320€</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientStats;
