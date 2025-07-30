
import { useEffect, useState } from "react";
import { useAuth, UserClient } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import OrderHistory from "@/components/client/OrderHistory";
import RatingModal from "@/components/client/RatingModal";
import Loader from "@/components/loader/Loader";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const OrderHistoryPage = () => {
  const { u, logout } = useAuth();
  const user: UserClient = u as UserClient
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return null;
    }
  },  [])

  const handleViewDetails = (orderId: string) => {
    navigate(`/client/order/${orderId}`);
  };

  const handleDownloadInvoice = (orderId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: "Votre facture sera téléchargée dans quelques instants",
    });
    // Simuler le téléchargement
    console.log(`Downloading invoice for order ${orderId}`);
  };

  const handleRateProvider = async (orderId: string, rating: number) => {
    await updateDoc(doc(db, "requests", orderId), {"providerRate": rating})
  };

  return (
    <>
    {loading && <Loader />}
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link to="/client/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </div>

          <OrderHistory
            setLoading={setLoading}
            onViewDetails={handleViewDetails}
            onDownloadInvoice={handleDownloadInvoice}
            onRateProvider={handleRateProvider}
            user={user}
          />
        </div>
      </div>
    </div>
  </>);
};

export default OrderHistoryPage;
