
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Leaf, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MissionTracker from "@/components/client/MissionTracker";
import RatingModal from "@/components/client/RatingModal";

const MissionTrackingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { missionId } = useParams();
  const { toast } = useToast();
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    providerName: "Pierre Martin",
    serviceName: "Tonte de pelouse"
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleContactProvider = () => {
    toast({
      title: "Contact en cours",
      description: "Connexion avec votre prestataire...",
    });
  };

  const handleRateMission = () => {
    setRatingModal({ ...ratingModal, isOpen: true });
  };

  const handleSubmitRating = (rating: number, comment: string) => {
    console.log(`Rating submitted for mission ${missionId}:`, { rating, comment });
    toast({
      title: "Évaluation enregistrée",
      description: "Merci pour votre retour !",
    });
    navigate('/client/my-requests');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/93345a67-4688-418b-8793-ad045f122f8d.png" 
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
          <div className="mb-6">
            <Link to="/client/my-requests" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à mes demandes
            </Link>
          </div>

          <MissionTracker
            missionId={missionId || ""}
            onContactProvider={handleContactProvider}
            onRateMission={handleRateMission}
          />
        </div>
      </div>

      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal(prev => ({ ...prev, isOpen: false }))}
        providerName={ratingModal.providerName}
        serviceName={ratingModal.serviceName}
        onSubmitRating={handleSubmitRating}
      />
    </div>
  );
};

export default MissionTrackingPage;
