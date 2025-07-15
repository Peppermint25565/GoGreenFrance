
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft, MessageSquare, Star, Clock, CheckCircle, XCircle, Plus, Upload, AlertTriangle, Edit, Paperclip, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebaseConfig";


const MyRequests = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const [requestsData, setRequestsData] = useState<any[]>([]);

  const filterOptions = ["Tous", "En attente", "En cours", "Terminé", "Annulé"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours": return "default";
      case "Terminé": return "outline";
      case "En attente": return "secondary";
      case "Annulé": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "En cours": return <Clock className="h-3 w-3 mr-1" />;
      case "Terminé": return <CheckCircle className="h-3 w-3 mr-1" />;
      case "En attente": return <Clock className="h-3 w-3 mr-1" />;
      case "Annulé": return <XCircle className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  const handleRating = (requestId: number, stars: number) => {
    setRating(stars);
  };

  const submitRating = (requestId: number) => {
    if (rating === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une note",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Évaluation envoyée",
      description: `Vous avez attribué ${rating} étoile(s) pour ce service`,
    });
    setRating(0);
    setRatingComment("");
  };

   useEffect(() => {
     if (!user) return;
 
     const fetchRequests = async () => {
       const q = query(
         collection(db, "requests"),
         where("clientId", "==", user.id),
         orderBy("createdAt", "desc")
       );
       const snap = await getDocs(q);
       setRequestsData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
     };
 
     fetchRequests();
   }, [user]);

   const filteredRequests =
     selectedFilter === "Tous"
       ? requestsData
       : requestsData.filter((r) => {
           switch (selectedFilter) {
             case "En attente":
               return r.status === "pending";
             case "En cours":
               return r.status === "in_progress" || r.status === "accepted";
             case "Terminé":
               return r.status === "completed";
             case "Annulé":
               return r.status === "cancelled";
             default:
               return true;
           }
         });

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link to="/client/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au tableau de bord
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Mes demandes</h1>
              <p className="text-gray-600">Suivez l'état de toutes vos demandes de service</p>
            </div>
            <Link to="/client/create-request">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle demande
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="mb-6 flex gap-3 overflow-x-auto">
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedFilter(opt)}
                    className={`px-4 py-2 rounded-full text-sm border ${
                      selectedFilter === opt
                        ? "bg-primary text-white"
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

            </CardContent>
          </Card>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <CardTitle className="text-lg sm:text-xl">{request.title}</CardTitle>
                        <Badge variant={request.category === "jardinage" ? "default" : "secondary"}>
                          {request.category}
                        </Badge>
                        <Badge variant={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm sm:text-base">
                        {request.description}
                      </CardDescription>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">{request.priceOriginal}€</div>
                      <div className="text-sm text-gray-500">{new Date(request.createdAt?.seconds * 1000 + request.createdAt?.nanoseconds / 1e6).toISOString()}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Adresse</p>
                      <p className="font-medium">{request.location.address}</p>
                    </div>
                    {request.providerName && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Prestataire</p>
                        <p className="font-medium">{request.providerName || '-'}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex gap-2">
                      {request.status === "En cours" && (
                        <Link to={`/chat/${request.id}`}>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        </Link>
                      )}
                      {request.status === "Terminé" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Star className="h-4 w-4 mr-2" />
                              Noter
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Évaluer le service</DialogTitle>
                              <DialogDescription>
                                Donnez votre avis sur la prestation de {request.providerName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Note (sur 5 étoiles)</Label>
                                <div className="flex gap-1 mt-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Button
                                      key={star}
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRating(request.id, star)}
                                      className="p-1"
                                    >
                                      <Star 
                                        className={`h-6 w-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                      />
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="comment">Commentaire (optionnel)</Label>
                                <Textarea
                                  id="comment"
                                  value={ratingComment}
                                  onChange={(e) => setRatingComment(e.target.value)}
                                  placeholder="Partagez votre expérience..."
                                  className="mt-1"
                                />
                              </div>
                              <Button onClick={() => submitRating(request.id)} className="w-full">
                                Envoyer l'évaluation
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {selectedFilter === "Tous" 
                    ? "Vous n'avez encore aucune demande" 
                    : `Aucune demande avec le statut "${selectedFilter}"`
                  }
                </p>
                <Link to="/client/create-request">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer votre première demande
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
