import { useEffect, useState } from "react";
import { rejectAdjustment } from "@/services/requests";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Plus, MessageSquare, MapPin, Calendar, Settings, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc, getDoc, limit, orderBy } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import PriceAdjustmentNotification from "@/components/client/PriceAdjustmentNotification";
import { useToast } from "@/hooks/use-toast";
import { PriceAdjustment } from "@/types/requests";
import Loader from "@/components/loader/Loader";

const ClientDashboard = () => {
  const { user, logout, fetchClientDashboard } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeRequestsCount, setActiveRequestsCount] = useState(0);
  const [completedServicesCount, setCompletedServicesCount] = useState(0);
  const [averageRating, setAverageRating] = useState<number | string>("–");
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
   useEffect(() => {
     if (!user) return;
 
     const fetchData = async () => {
       const reqSnap = await fetchClientDashboard(user.id);
 
       let active = 0;
       let completed = 0;
       let sumRatings = 0;
       let rated = 0;
 
       reqSnap.forEach((d) => {
         const data = d.data();
         switch (data.status) {
           case "pending":
           case "accepted":
           case "in_progress":
             active += 1;
             break;
           case "completed":
             completed += 1;
             if (typeof data.rating === "number") {
               sumRatings += data.rating;
               rated += 1;
             }
             break;
           default:
             break;
         }
       });
 
       /* 3.  Dernières demandes (limite 4)      */
       const recentQuery = query(
         collection(db, "requests"),
         where("clientId", "==", user.id),
         orderBy("createdAt", "desc"),
         limit(4)
       );
       const recentSnap = await getDocs(recentQuery);
 
       setActiveRequestsCount(active);
       setCompletedServicesCount(completed);
       setAverageRating(rated ? (sumRatings / rated).toFixed(1) : "–");
       setRecentRequests(recentSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
       setLoading(false);
     };
 
     fetchData();
   }, [user]);
  
 const [priceAdjustments, setPriceAdjustments] = useState<PriceAdjustment[]>([]);

  useEffect(() => {
    const fetchAdjustments = async () => {
      if (!user) return;
      const adjustmentsArray: PriceAdjustment[] = [];
      const reqQuery = query(collection(db, "requests"), where("clientId", "==", user.id));
      const reqSnapshot = await getDocs(reqQuery);
      for (const reqDoc of reqSnapshot.docs) {
        try {
          const adjQuery = query(collection(db, "priceAdjustments"), where("requestId", "==", reqDoc.id));
          const adjSnapshot = await getDocs(adjQuery);
          adjSnapshot.forEach(adjDoc => adjustmentsArray.push(adjDoc.data() as PriceAdjustment));
        } catch {

        }
      }
      setPriceAdjustments(adjustmentsArray);
    };
    fetchAdjustments();
  }, [user]);

  const handleAcceptAdjustment = async (adjustment: PriceAdjustment, feedback?: string) => {
    try {
      const reqRef = doc(db, "requests", adjustment.requestId);
      await updateDoc(reqRef, {
        providerId: adjustment.providerId,
        providerName: adjustment.providerName,
        status: "accepted",
        priceFinal: adjustment.newPrice
      })

      const otherAdjQuery = query(
        collection(db, "priceAdjustments"),
        where("requestId", "==", adjustment.requestId),
        where("status", "==", "pending")
      );
      const otherAdjSnap = await getDocs(otherAdjQuery);
      otherAdjSnap.forEach(async otherDoc => {
        if (otherDoc.id !== adjustment.id) {
          await deleteDoc(doc(db, "priceAdjustments", otherDoc.id));
        }
      });
      setPriceAdjustments(prev =>
        prev.map(adj =>
          adj.id === adjustment.id ? { ...adj, status: 'accepted' as const } : adj
        )
      );
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: adjustment.requestId, amount: adjustment.newPrice })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation de l'ajustement :", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter l'ajustement, réessayez plus tard.",
        variant: "destructive",
      });
    }
  };

  const handleRejectAdjustment = async (adjustmentId: string, reason: string) => {
    try {
      const adjRef = doc(db, "priceAdjustments", adjustmentId);
      await updateDoc(adjRef, { status: "rejected" });
      setPriceAdjustments(prev =>
        prev.map(adj =>
          adj.id === adjustmentId ? { ...adj, status: 'rejected' as const } : adj
        )
      );
    } catch (error) {
      console.error("Erreur lors du refus de l'ajustement :", error);
    }
  };

  const pendingAdjustments = priceAdjustments.filter(adj => adj.status === 'pending');

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
              <Link to="/client/profile">
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
                <div className="text-3xl font-bold text-green-600 mb-2">{activeRequestsCount}</div>
                <p className="text-sm text-gray-600">En cours de traitement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Services terminés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">{completedServicesCount}</div>
                <p className="text-sm text-gray-600">Ce mois-ci</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Note moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {averageRating !== "–" ? `${averageRating}/5` : "–"}
                </div>
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
                {recentRequests.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Aucune demande récente.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {recentRequests.map((req) => (
                      <li
                        key={req.id}
                        className="border rounded-lg p-4 shadow-sm bg-background/40"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{req.service?.name || "Service"}</h3>
                            <p className="text-sm text-muted-foreground">
                              Créée&nbsp;:{" "}
                              {new Date(req.createdAt?.seconds ? req.createdAt.seconds * 1000 : req.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-sm font-semibold">
                            {req.status === "completed" ? "Terminé" : "En cours"}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </>);
};

export default ClientDashboard;
