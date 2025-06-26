
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Clock, User, Phone, MessageSquare, CheckCircle, Navigation } from "lucide-react";

interface MissionStatus {
  id: string;
  status: "accepted" | "en_route" | "arrived" | "in_progress" | "completed";
  estimatedArrival?: string;
  provider: {
    name: string;
    avatar: string;
    phone: string;
    rating: number;
  };
  location: {
    current?: { lat: number; lng: number };
    destination: { lat: number; lng: number };
  };
  timeline: {
    accepted: string;
    en_route?: string;
    arrived?: string;
    started?: string;
    completed?: string;
  };
}

interface MissionTrackerProps {
  missionId: string;
  onContactProvider: () => void;
  onRateMission: () => void;
}

const MissionTracker = ({ missionId, onContactProvider, onRateMission }: MissionTrackerProps) => {
  const [mission, setMission] = useState<MissionStatus>({
    id: missionId,
    status: "en_route",
    estimatedArrival: "14:30",
    provider: {
      name: "Pierre Martin",
      avatar: "",
      phone: "+33 6 12 34 56 78",
      rating: 4.8
    },
    location: {
      current: { lat: 48.8566, lng: 2.3522 },
      destination: { lat: 48.8606, lng: 2.3376 }
    },
    timeline: {
      accepted: "13:15",
      en_route: "13:45"
    }
  });

  const [progress, setProgress] = useState(25);

  useEffect(() => {
    // Simuler la mise à jour en temps réel
    const interval = setInterval(() => {
      setMission(prev => {
        const statuses = ["accepted", "en_route", "arrived", "in_progress", "completed"];
        const currentIndex = statuses.indexOf(prev.status);
        if (currentIndex < statuses.length - 1) {
          const nextStatus = statuses[currentIndex + 1] as MissionStatus["status"];
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          const updatedTimeline = { ...prev.timeline };
          switch (nextStatus) {
            case "arrived":
              updatedTimeline.arrived = now;
              break;
            case "in_progress":
              updatedTimeline.started = now;
              break;
            case "completed":
              updatedTimeline.completed = now;
              break;
          }
          
          return {
            ...prev,
            status: nextStatus,
            timeline: updatedTimeline
          };
        }
        return prev;
      });
      
      setProgress(prev => Math.min(prev + 20, 100));
    }, 10000); // Change status every 10 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted": return "Mission acceptée";
      case "en_route": return "En route";
      case "arrived": return "Arrivé sur place";
      case "in_progress": return "Mission en cours";
      case "completed": return "Mission terminée";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-blue-100 text-blue-800";
      case "en_route": return "bg-orange-100 text-orange-800";
      case "arrived": return "bg-purple-100 text-purple-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Statut principal */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Suivi de votre mission</CardTitle>
            <Badge className={getStatusColor(mission.status)}>
              {getStatusText(mission.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          
          {mission.status === "en_route" && mission.estimatedArrival && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Arrivée estimée : {mission.estimatedArrival}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations prestataire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Votre prestataire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <h3 className="font-medium">{mission.provider.name}</h3>
              <p className="text-sm text-gray-600">
                ⭐ {mission.provider.rating}/5 • Prestataire vérifié
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onContactProvider}>
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
            <Button variant="outline" size="sm" onClick={onContactProvider}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
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
          <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-4">
            <p className="text-gray-500">Carte de suivi en temps réel</p>
          </div>
          
          {mission.status !== "completed" && (
            <Button variant="outline" className="w-full">
              <Navigation className="h-4 w-4 mr-2" />
              Voir sur la carte
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Chronologie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(mission.timeline).map(([step, time]) => (
              <div key={step} className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <span className="font-medium">{getStatusText(step)}</span>
                  <span className="text-sm text-gray-600 ml-2">{time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions post-mission */}
      {mission.status === "completed" && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-lg font-medium">Mission terminée avec succès !</h3>
              <p className="text-gray-600">Paiement automatique effectué</p>
              <Button onClick={onRateMission} className="w-full">
                Évaluer le prestataire
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MissionTracker;
