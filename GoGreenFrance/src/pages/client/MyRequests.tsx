
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft, MessageSquare, Star, Clock, CheckCircle, XCircle, Plus, Upload, AlertTriangle, Edit, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MyRequests = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const requests = [
    {
      id: 1,
      service: "Tonte de pelouse",
      type: "Jardinage",
      status: "En cours",
      provider: "Pierre Martin",
      price: 65,
      date: "2024-01-15",
      address: "123 Rue de la Paix, Paris",
      description: "Tonte de pelouse avec ramassage des déchets verts"
    },
    {
      id: 2,
      service: "Montage meuble IKEA",
      type: "Bricolage",
      status: "Terminé",
      provider: "Sophie Durand",
      price: 45,
      date: "2024-01-10",
      address: "456 Avenue des Fleurs, Lyon",
      description: "Montage d'une bibliothèque IKEA Billy"
    },
    {
      id: 3,
      service: "Taille de haies",
      type: "Jardinage",
      status: "En attente",
      provider: null,
      price: 80,
      date: "2024-01-20",
      address: "789 Boulevard du Jardin, Marseille",
      description: "Taille de haies de laurier sur 20 mètres"
    },
    {
      id: 4,
      service: "Réparation robinet",
      type: "Bricolage",
      status: "Annulé",
      provider: null,
      price: 35,
      date: "2024-01-08",
      address: "321 Rue de l'Eau, Toulouse",
      description: "Réparation fuite robinet cuisine"
    }
  ];

  const filterOptions = ["Tous", "En attente", "En cours", "Terminé", "Annulé"];

  const filteredRequests = selectedFilter === "Tous" 
    ? requests 
    : requests.filter(request => request.status === selectedFilter);

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

  const handleReport = (requestId: number) => {
    if (!reportReason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer la raison du signalement",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Signalement envoyé",
      description: "Votre signalement a été transmis à notre équipe",
    });
    setReportReason("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">ServicePro</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Bonjour, {user.name}</span>
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
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <Button 
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter}
                  </Button>
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
                        <CardTitle className="text-lg sm:text-xl">{request.service}</CardTitle>
                        <Badge variant={request.type === "Jardinage" ? "default" : "secondary"}>
                          {request.type}
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
                      <div className="text-xl sm:text-2xl font-bold text-green-600">{request.price}€</div>
                      <div className="text-sm text-gray-500">{request.date}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Adresse</p>
                      <p className="font-medium">{request.address}</p>
                    </div>
                    {request.provider && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Prestataire</p>
                        <p className="font-medium">{request.provider}</p>
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
                                Donnez votre avis sur la prestation de {request.provider}
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
                      
                      {/* Attach Files Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Paperclip className="h-4 w-4 mr-2" />
                            Joindre
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Joindre des fichiers</DialogTitle>
                            <DialogDescription>
                              Ajoutez des photos ou documents liés à votre demande
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-gray-600 mb-2">Glissez vos fichiers ici ou cliquez pour les sélectionner</p>
                              <input
                                type="file"
                                multiple
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                              />
                              <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                                Choisir des fichiers
                              </Button>
                            </div>
                            {attachments.length > 0 && (
                              <div className="space-y-2">
                                <Label>Fichiers joints :</Label>
                                {attachments.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{file.name}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeAttachment(index)}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <Button className="w-full">
                              Envoyer les fichiers
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="flex gap-2">
                      {(request.status === "En attente" || request.status === "En cours") && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier la demande</DialogTitle>
                              <DialogDescription>
                                Modifiez les détails de votre demande
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  defaultValue={request.description}
                                  className="mt-1"
                                />
                              </div>
                              <Button className="w-full">
                                Enregistrer les modifications
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Signaler
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Signaler un problème</DialogTitle>
                            <DialogDescription>
                              Décrivez le problème rencontré avec cette demande
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="report-reason">Raison du signalement</Label>
                              <Textarea
                                id="report-reason"
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder="Décrivez le problème..."
                                className="mt-1"
                              />
                            </div>
                            <Button onClick={() => handleReport(request.id)} className="w-full">
                              Envoyer le signalement
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
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
