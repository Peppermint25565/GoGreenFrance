
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Euro, TrendingUp, Calendar, Clock, Award } from "lucide-react";
import { Request } from "@/types/requests";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth, UserProvider } from "@/contexts/AuthContext";
import { UserProfile } from "firebase/auth";
import React from "react";

const EarningsTracker = ({ setLoading }: {setLoading : React.Dispatch<React.SetStateAction<boolean>>}) => {
  const { u } = useAuth();
  const user: UserProvider = u as UserProvider;
  const [recentEarnings, setRecentEarnings] = useState<Request[]>([]);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [countRequests, setCountRequests] = useState<number>(0);
  const [avgEarn, setAvgEarning] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    const func = async () => {
      const q = query(
        collection(db, "requests"),
        where("providerId", "==", user.id),
        where("status", "==", "completed"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const array = snap.docs.map((d) => ({ id: d.id, ...d.data() as Request}));
      setRecentEarnings(array);
      setCountRequests(array.length)
      let total = 0;
      array.forEach(req => {
        total += req.priceFinal ? req.priceFinal : req.priceOriginal
      });
      setTotalEarned(total)
      setAvgEarning(total / array.length)
      setLoading(false);
    }
    func()
  }, [])

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
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Total gagné</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{totalEarned} €</div>
            <p className="text-xs text-gray-500">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">Missions</span>
            </div>
            <div className="text-2xl font-bold">{countRequests}</div>
            <p className="text-xs text-gray-500">Complétées ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-gray-600">Revenu Moyen</span>
            </div>
            <div className="text-2xl text-yellow-600 font-bold">{avgEarn} €</div>
            <p className="text-xs text-gray-500">Par missions</p>
          </CardContent>
        </Card>
      </div>

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
                    <h4 className="font-medium">{earning.title}</h4>
                    <p className="text-sm text-gray-600">
                      {earning.clientName} • {earning.createdAt.toDate().toDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600 mb-2">
                      {earning.priceFinal ? earning.priceFinal : earning.priceOriginal}€
                    </div>
                    {getStatusBadge(earning.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsTracker;
