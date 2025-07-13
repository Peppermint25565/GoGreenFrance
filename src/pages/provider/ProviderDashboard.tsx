import { useEffect, useMemo, useState } from "react";
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
import { collection, doc, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export interface Mission {
  id: string;
  title: string;
  description: string;
  client: {
    name: string;
    avatar?: string;
    phone: string;
    rating: number;
  };
  location: {
    address: string;
    distance?: string;
    coordinates?: { lat: number; lng: number };
  };
  payment?: {
    amount: number;
    currency: string;
    paymentMethod: string;
  };
  requirements?: string[];
  tools?: string[];
  status: "available" | "accepted" | "in_progress" | "completed" | "cancelled";
  urgency?: "normal" | "high";
  estimatedPrice: number;
  category: string;
  providerId?: string;
  note?: number;
  createdAt: Timestamp;
}

function useProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = onSnapshot(doc(db, "profiles", uid), (snap) => {
      setProfile(snap.data() ?? null);
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  return { profile, loading };
}

function useMissions(uid: string | undefined) {
  const [available, setAvailable] = useState<Mission[]>([]);
  const [mine, setMine] = useState<Mission[]>([]);
  const [note, setNote] = useState<number>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qAvailable = query(
      collection(db, "requests"),
      where("status", "==", "pending")
    );
    const unsub1 = onSnapshot(qAvailable, (snap) => {
      setAvailable(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Mission) })));
    });

    if (uid) {
      const qMine = query(
        collection(db, "requests"),
        where("providerId", "==", uid),
        where("status", "in", ["accepted", "in_progress", "completed"])
      );
      const unsub2 = onSnapshot(qMine, (snap) => {
        setMine(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Mission) })));
        let count = 0
        mine.forEach(elm => {
          if (elm.note) {
            count++;
            if (!note) {
              setNote(elm.note)
            } else
              setNote(((note * (count - 1)) + elm.note) / count)
          }
        });
        setLoading(false);
      });
      return () => {
        unsub1();
        unsub2();
      };
    }
    return unsub1;
  }, [uid]);

  return { available, mine, loading, note };
}

const ProviderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedMission, setSelectedMission] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === 0) navigate("/client/dashboard");
    else if (user.role === 2) navigate("/admin/dashboard");
  }, [user]);

  const { profile, loading: profileLoading } = useProfile(user?.id);
  const { available, mine, loading: missionsLoading, note } = useMissions(user?.id);

  const stats = useMemo(() => {
    const completed = mine.filter((m) => m.status === "completed");
    const inProgress = mine.filter((m) => m.status === "in_progress");

    // revenus ce mois
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const revenueThisMonth = completed
      .filter((m) => {
        const d = m.createdAt.toDate();
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, m) => sum + m.payment.amount, 0);

    return {
      completedCount: completed.length,
      inProgressCount: inProgress.length,
      revenueThisMonth,
    };
  }, [mine]);

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
    const mission = [...available, ...mine].find(m => m.id === selectedMission);
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
          <TabsList className="grid grid-cols-3 w-full max-w-2xl">
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="kyc">Vérification</TabsTrigger>
            <TabsTrigger value="earnings">Revenus</TabsTrigger>
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
                      {available.map((request) => (
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
                                <span>{request.createdAt.toString()}</span>
                                <span>{request.schedule.timeSlot}</span>
                              </div>
                              <div className="mt-2 text-xs text-orange-600">
                                <Clock className="h-3 w-3 inline mr-1" />
                                Accepter avant: {request}
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
                      {mine.map((job) => (
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
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Chat
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
                        <span>Note moyenne</span>
                        <span className="font-medium">{note} / 5</span>
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
                      <span className="font-semibold">{stats.completedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">En cours</span>
                      <span className="font-semibold text-blue-600">{stats.inProgressCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenus ce mois</span>
                      <span className="font-semibold text-green-600">{stats.revenueThisMonth}€</span>
                    </div>
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
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderDashboard;
