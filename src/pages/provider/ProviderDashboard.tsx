import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, UserProvider } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Leaf, User, CheckCircle, Clock, Euro, Settings, BarChart3, 
  BookOpen, FileCheck, MapPin, Navigation, Phone, MessageSquare,
  Award, TrendingUp
} from "lucide-react";
import KYCVerification from "@/components/provider/KYCVerification";
import MissionDetail from "@/components/provider/MissionDetail";
import EarningsTracker from "@/components/provider/EarningsTracker";
import { addDoc, collection, doc, getDocs, onSnapshot, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { PriceAdjustment, Request } from "@/types/requests";
import Loader from "@/components/loader/Loader";
import { uploadKyc } from "@/supabase";

function useMissions(user: UserProvider, setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
  const [available, setAvailable] = useState<Request[]>([]);
  const [mine, setMine] = useState<Request[]>([]);
  const [note, setNote] = useState<number>(null)

  useEffect(() => {
    if (!user.verified) {
      setLoading(false)
      return;
    }
    setLoading(true);
    const qAvailable = query(
      collection(db, "requests"),
      where("status", "==", "pending")
    );
    const unsub1 = onSnapshot(qAvailable, (snap) => {
      setAvailable(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Request) })));
    });

    if (user.id) {
      const qMine = query(
        collection(db, "requests"),
        where("providerId", "==", user.id)
      );
      const unsub2 = onSnapshot(qMine, (snap) => {
        setMine(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Request) })));
        let count = 0
        mine.forEach(elm => {
          if (elm.rating) {
            count++;
            if (!note) {
              setNote(elm.rating)
            } else
              setNote(((note * (count - 1)) + elm.rating) / count)
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
  }, [user]);

  return { available, mine, note };
}

const ProviderDashboard = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const tab = Number(queryParameters.get("tab"));

  const { u, logout, updateUserData } = useAuth();
  const user: UserProvider = u as UserProvider;
  const navigate = useNavigate();
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { available, mine, note } = useMissions(user, setLoading);
  const [toUpload, setToUpload] = useState<{file: File, user: UserProvider, id: string}[]>([])
  
  const stats = useMemo(() => {
    const completed = mine.filter((m) => m.status === "completed");
    const inProgress = mine.filter((m) => m.status === "in_progress");
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const revenueThisMonth = completed
      .filter((m) => {
        const d = m.createdAt.toDate();
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, m) => sum + m.priceOriginal, 0);
    return {
      completedCount: completed.length,
      inProgressCount: inProgress.length,
      revenueThisMonth,
    };
  }, [mine]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === 0) navigate("/client/dashboard");
    else if (user.role === 2) navigate("/admin/dashboard");
  }, [user]);

  const handleAcceptMission = async (mission: Request) => {
    if (!user) return;
    try {
      const adjQuery = query(
        collection(db, "priceAdjustments"),
        where("requestId", "==", mission.id),
        where("providerId", "==", user.id),
        where("status", "==", "pending")
      );
      const adjSnap = await getDocs(adjQuery);
      if (!adjSnap.empty) {
        return;
      }
      await addDoc(collection(db, "priceAdjustments"), {
        requestId: mission.id,
        providerId: user.id,
        providerName: user.name,
        serviceName: mission.title,
        originalPrice: mission.priceOriginal,
        newPrice: mission.priceOriginal,
        justification: null,
        photos: [] as string[],
        videos: [] as string[],
        timestamp: new Date(),
        status: "pending"
      } as PriceAdjustment)
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
    }
    navigate("/provider/dashboard")
  };

  const handleDeclineMission = async (missionId: string) => {
    console.log("Mission refusée:", missionId);
    // Logic pour refuser la mission
  };

  const handleUpdateMissionStatus = async (missionId: string, status: string) => {
    await updateDoc(doc(db, "requests", missionId), {
      status: status,
    })
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
                      alt="Atoi" 
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

  function getRemainingTimeText(
    startDate: Date,
    hoursToAdd: number
  ): string {
    const target = new Date(startDate.getTime() + hoursToAdd * 60 * 60 * 1000);
    const diffMs = target.getTime() - Date.now();
    if (diffMs <= 0) return "Temps écoulé";
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${hours} h ${pad(minutes)} min ${pad(seconds)} s`;
  }

  function isEnded(
    startDate: Date,
    hoursToAdd: number
  ): boolean {
    const target = new Date(startDate.getTime() + hoursToAdd * 60 * 60 * 1000);
    const diffMs = target.getTime() - Date.now();
    if (diffMs <= 0) return true;
    return false
  }

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>, step: any) => {
    const files = Array.from(event.target.files || []);
    setToUpload((e) => [...e, {file: files[0], user: user, id: step?.id}]);
  };

  const handleSubmitFile = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (toUpload.length == 0)
      return
    setLoading(true);
    const data = user.kyc;
    for (const up of toUpload) {
      const url: string = await uploadKyc(up.file, user.id, up.id);
      if (up.id == 'identity') {
        data.identity.url = url
        data.identity.status = "in_review"
      } else if (up.id == 'address') {
        data.address.url = url;
        data.address.status = "in_review"
      } else if (up.id == "insurance") {
        data.insurance.url = url
        data.insurance.status = "in_review"
      } else if (up.id == "bank") {
        data.bank.url = url
        data.insurance.status = "in_review"
      }
    }
    await updateDoc(doc(db, 'profiles', user.id), {kyc: data});
    await updateUserData()
    setToUpload([])
    setLoading(false);
  };
  
  return (
    <>
    {loading && (<Loader />)}
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/logo.png" 
                alt="Atoi" 
                className="h-28 w-auto" 
              />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Bonjour, {user?.name ? user.name : ""}</span>
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

        <Tabs defaultValue={tab == 0 ? "missions" : (tab == 1 ? "kyc" : (tab == 3 ? "earnings" : "missionsj"))} className="space-y-6">
          <TabsList className={`grid grid-cols-${user.verified ? 2 : 3} w-full max-w-2xl`}>
            <TabsTrigger value="missions">Missions</TabsTrigger>
            {!user.verified &&  (<TabsTrigger value="kyc">Vérification</TabsTrigger>)}
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
                      {available.map((request) => !isEnded(request.createdAt.toDate(), request.urgency === "low" ? 12 : (request.urgency === "high" ? 3 : 6)) && (
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
                                <span>{request.createdAt.toDate().toDateString()}</span>
                              </div>
                              <div className="mt-2 text-xs text-orange-600">
                                <Clock className="h-3 w-3 inline mr-1" />
                                Accepter avant: {getRemainingTimeText(request.createdAt.toDate(), request.urgency === "low" ? 12 : (request.urgency === "high" ? 3 : 6))}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 mb-2">{request.priceOriginal}€</div>
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
                                  onClick={() => handleAcceptMission(request)}
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
                      {mine.map((job) => job.status != "completed" && (
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
                                {job.clientName} • {job.location.address}
                              </p>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Chat
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-600 mb-2">{job.priceOriginal}€</div>
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
                    {user?.verified && (<div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-600">Profil vérifié</span>
                    </div>)}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Note moyenne</span>
                        <span className="font-medium">{note ? note : "-"} / 5</span>
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
            <KYCVerification user={user} handleSubmitFile={handleSubmitFile} handleUploadFile={handleUploadFile} />
          </TabsContent>

          <TabsContent value="earnings">
            <EarningsTracker setLoading={setLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
 </>);
};

export default ProviderDashboard;
