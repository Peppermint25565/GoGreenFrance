
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Euro, User, Phone, MessageSquare, Navigation, CheckCircle, Settings } from "lucide-react";
import PriceAdjustmentModal from "./PriceAdjustmentModal";

interface Mission {
  id: string;
  title: string;
  description: string;
  client: {
    name: string;
    avatar: string;
    phone: string;
    rating: number;
  };
  location: {
    address: string;
    distance: string;
    coordinates: { lat: number; lng: number };
  };
  schedule: {
    date: string;
    timeSlot: string;
    estimatedDuration: string;
  };
  payment: {
    amount: number;
    currency: string;
    paymentMethod: string;
    minPrice: number;
    maxPrice: number;
  };
  requirements: string[];
  tools: string[];
  status: "available" | "accepted" | "in_progress" | "completed";
  acceptDeadline: string;
}

interface MissionDetailProps {
  mission: Mission;
  onAccept: (missionId: string) => void;
  onDecline: (missionId: string) => void;
  onUpdateStatus: (missionId: string, status: "available" | "accepted" | "in_progress" | "completed") => void;
}

const MissionDetail = ({ mission, onAccept, onDecline, onUpdateStatus }: MissionDetailProps) => {
  const [currentStatus, setCurrentStatus] = useState<"available" | "accepted" | "in_progress" | "completed">(mission.status);
  const [showPriceAdjustment, setShowPriceAdjustment] = useState(false);

  const handleStatusUpdate = (newStatus: "available" | "accepted" | "in_progress" | "completed") => {
    setCurrentStatus(newStatus);
    onUpdateStatus(mission.id, newStatus);
  };

  const handlePriceAdjustment = (adjustment: {
    newPrice: number;
    justification: string;
    photos: File[];
    videos: File[];
  }) => {
    console.log('Price adjustment submitted:', {
      missionId: mission.id,
      ...adjustment
    });
    // Ici, on enverrait l'ajustement au backend et notifierait le client
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="outline">Disponible</Badge>;
      case "accepted":
        return <Badge variant="default">Acceptée</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Terminée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderMissionActions = () => {
    switch (currentStatus) {
      case "available":
        return (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onDecline(mission.id)} className="flex-1">
                Refuser
              </Button>
              <Button onClick={() => onAccept(mission.id)} className="flex-1">
                Accepter
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowPriceAdjustment(true)}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Ajuster le tarif
            </Button>
          </div>
        );
      
      case "accepted":
        return (
          <div className="space-y-3">
            <Button 
              onClick={() => handleStatusUpdate("in_progress")} 
              className="w-full"
            >
              <Navigation className="h-4 w-4 mr-2" />
              En route
            </Button>
            <Button variant="outline" className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Appeler le client
            </Button>
          </div>
        );
      
      case "in_progress":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm">
                Arrivé sur place
              </Button>
              <Button variant="outline" size="sm">
                Travail commencé
              </Button>
            </div>
            <Button 
              onClick={() => handleStatusUpdate("completed")} 
              className="w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marquer terminé
            </Button>
          </div>
        );
      
      case "completed":
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-green-800">Mission terminée</h3>
            <p className="text-sm text-green-600">En attente du paiement automatique</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête mission */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{mission.title}</CardTitle>
              <CardDescription className="mt-2">
                Mission #{mission.id}
              </CardDescription>
            </div>
            {getStatusBadge(currentStatus)}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{mission.description}</p>
          
          {currentStatus === "available" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <Clock className="h-4 w-4 inline mr-1" />
                Temps limite pour accepter : {mission.acceptDeadline}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations client */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <h3 className="font-medium">{mission.client.name}</h3>
              <p className="text-sm text-gray-600">
                ⭐ {mission.client.rating}/5 • Client vérifié
              </p>
            </div>
          </div>
          
          {currentStatus !== "available" && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Localisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium mb-2">{mission.location.address}</p>
          <p className="text-sm text-gray-600 mb-4">
            Distance : {mission.location.distance}
          </p>
          
          <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-4">
            <p className="text-gray-500">Carte interactive</p>
          </div>
          
          <Button variant="outline" className="w-full">
            <Navigation className="h-4 w-4 mr-2" />
            Itinéraire GPS
          </Button>
        </CardContent>
      </Card>

      {/* Horaires et paiement */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Date :</span>
                <p className="font-medium">{mission.schedule.date}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Créneau :</span>
                <p className="font-medium">{mission.schedule.timeSlot}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Durée estimée :</span>
                <p className="font-medium">{mission.schedule.estimatedDuration}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              Paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-600">
                {mission.payment.amount}€
              </div>
              <p className="text-sm text-gray-600">
                Paiement automatique après validation
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Fourchette: {mission.payment.minPrice}€ - {mission.payment.maxPrice}€
              </p>
            </div>
            <Badge variant="outline" className="w-full justify-center">
              {mission.payment.paymentMethod}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Outils et exigences */}
      <Card>
        <CardHeader>
          <CardTitle>Détails techniques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Outils requis :</h4>
            <div className="flex flex-wrap gap-2">
              {mission.tools.map((tool, index) => (
                <Badge key={index} variant="outline">{tool}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Exigences spéciales :</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {mission.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          {renderMissionActions()}
        </CardContent>
      </Card>

      {/* Modal d'ajustement tarifaire */}
      <PriceAdjustmentModal
        isOpen={showPriceAdjustment}
        onClose={() => setShowPriceAdjustment(false)}
        missionId={mission.id}
        originalPrice={mission.payment.amount}
        minPrice={mission.payment.minPrice}
        maxPrice={mission.payment.maxPrice}
        clientName={mission.client.name}
        serviceName={mission.title}
        onSubmitAdjustment={handlePriceAdjustment}
      />
    </div>
  );
};

export default MissionDetail;
