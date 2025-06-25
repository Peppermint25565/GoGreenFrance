
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Euro, TrendingUp, Calendar, Clock, Award } from "lucide-react";

interface Earning {
  id: string;
  missionTitle: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "processing";
  client: string;
  duration: string;
}

interface Performance {
  period: string;
  totalEarnings: number;
  missionsCompleted: number;
  averageRating: number;
  efficiency: number;
}

const EarningsTracker = () => {
  const recentEarnings: Earning[] = [
    {
      id: "1",
      missionTitle: "Tonte de pelouse",
      date: "2024-01-18",
      amount: 65,
      status: "paid",
      client: "Marie D.",
      duration: "2h30"
    },
    {
      id: "2",
      missionTitle: "Élagage arbres",
      date: "2024-01-17",
      amount: 120,
      status: "pending",
      client: "Jean L.",
      duration: "4h00"
    },
    {
      id: "3",
      missionTitle: "Ramassage déchets",
      date: "2024-01-16",
      amount: 45,
      status: "paid",
      client: "Paul R.",
      duration: "1h30"
    }
  ];

  const performances: Performance[] = [
    {
      period: "Cette semaine",
      totalEarnings: 340,
      missionsCompleted: 5,
      averageRating: 4.8,
      efficiency: 92
    },
    {
      period: "Ce mois",
      totalEarnings: 1250,
      missionsCompleted: 18,
      averageRating: 4.7,
      efficiency: 89
    },
    {
      period: "Cette année",
      totalEarnings: 12400,
      missionsCompleted: 156,
      averageRating: 4.6,
      efficiency: 87
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Payé</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "processing":
        return <Badge variant="outline">En traitement</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Total gagné</span>
            </div>
            <div className="text-2xl font-bold text-green-600">1,250€</div>
            <p className="text-xs text-gray-500">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">Missions</span>
            </div>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-gray-500">Complétées ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-gray-600">Note moyenne</span>
            </div>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-gray-500">⭐⭐⭐⭐⭐</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Efficacité</span>
            </div>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-gray-500">Taux de réussite</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earnings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="earnings">Revenus récents</TabsTrigger>
          <TabsTrigger value="performance">Performances</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Revenus récents</CardTitle>
              <CardDescription>
                Historique de vos derniers paiements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEarnings.map((earning) => (
                  <div key={earning.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{earning.missionTitle}</h4>
                        <p className="text-sm text-gray-600">
                          {earning.client} • {earning.date}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Durée : {earning.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600 mb-2">
                          {earning.amount}€
                        </div>
                        {getStatusBadge(earning.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-4">
            {performances.map((perf, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{perf.period}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {perf.totalEarnings}€
                      </div>
                      <p className="text-sm text-gray-600">Revenus totaux</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {perf.missionsCompleted}
                      </div>
                      <p className="text-sm text-gray-600">Missions complétées</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {perf.averageRating}/5
                      </div>
                      <p className="text-sm text-gray-600">Note moyenne</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {perf.efficiency}%
                      </div>
                      <p className="text-sm text-gray-600">Efficacité</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques détaillées</CardTitle>
              <CardDescription>
                Analyse de votre activité et performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Répartition par type de service</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Jardinage</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Bricolage</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">35%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Évolution mensuelle</h4>
                  <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                    <p className="text-gray-500">Graphique des revenus mensuels</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EarningsTracker;
