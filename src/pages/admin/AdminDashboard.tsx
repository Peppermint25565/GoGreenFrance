
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, UserClient } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import MissionTracking from "@/components/admin/MissionTracking";
import WasteManagement from "@/components/admin/WasteManagement";
import ContentManagement from "@/components/admin/ContentManagement";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Loader from "@/components/loader/Loader";

const AdminDashboard = () => {
  const { u, logout } = useAuth();
  const user: UserClient = u as UserClient
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [providers, setProviders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const isLastWeek = (d: Date, n = new Date(), s = 1) => {
    const t = new Date(n);
    t.setHours(0, 0, 0, 0);
    t.setDate(t.getDate() - ((t.getDay() - s + 7) % 7));
    return +d >= t.getTime() - 6048e5 && +d < +t;
  };

  useEffect(() => {
    const fas = async () => {
      const docs = (await getDocs(query(collection(db, "profiles"), where("role", "==", 1)))).docs
      const out = []
      for (var doc of docs) {
        const data = doc.data()
        const reqs = (await getDocs(query(collection(db, "requests"), where("providerId", "==", doc.id)))).docs
        let amount = 0
        for (var req of reqs) {
          const data = req.data()
          if (isLastWeek(data.createdAt.toDate())) {
            amount += data.priceFinal
          }
        }
        if (amount > 0) {
          out.push({id: doc.id, name: data.name, email: data.email, amount: amount})
        }
      }
      setProviders(out)
      setIsLoading(false)
    }
    fas()
  }, [])

  const handleProviderAction = (providerId: number, action: 'approve' | 'reject') => {
    console.log(`${action} provider ${providerId}`);
  };

  return (
    <>
    {isLoading && <Loader/>}
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/logo.png" 
                  alt="Atoi" 
                  className="h-28 w-auto" 
                />
              </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm sm:text-base text-gray-600">Admin: {user.name}</span>
              <Button variant="outline" onClick={() => {logout(); navigate('/')}} size="sm">
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord administrateur
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Supervision complète de la plateforme et gestion des opérations
              </p>
            </div>

            {/* Enhanced Navigation Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex flex-wrap gap-2 sm:gap-4">
                  {[
                    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-2 px-3 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Chiffre prestataire semaine dernières</CardTitle>
                    <CardDescription className="text-sm">
                      Montant a versé pour chaque prestataires
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {providers.map((provider) => (
                        <div key={provider.id} className="border rounded-lg p-4">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base sm:text-lg mb-2">{provider.name}</h3>
                              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                                <p>User ID : {provider.id}</p>
                                <p>Email: {provider.email}</p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                              <p className="text-2xl font-bold text-green-600">{provider.amount} €</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </>);
};

export default AdminDashboard;
