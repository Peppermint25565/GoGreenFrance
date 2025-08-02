
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, UserClient } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, Check, X } from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import MissionTracking from "@/components/admin/MissionTracking";
import WasteManagement from "@/components/admin/WasteManagement";
import ContentManagement from "@/components/admin/ContentManagement";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Loader from "@/components/loader/Loader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setISODay } from "date-fns";

const AdminDashboard = () => {
  const { u, logout } = useAuth();
  const user: UserClient = u as UserClient
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [providers, setProviders] = useState<any[]>([])
  const [kycProviders, setKycProviders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("")
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState<any>(null);

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
            amount += Math.round(data.priceFinal * 0.8)
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

    useEffect(() => {
    const fas = async () => {
      const docs = (await getDocs(query(collection(db, "profiles"), where("role", "==", 1), where("verified", "==", false)))).docs
      setKycProviders(docs.map((e) => e.data()))
    }
    fas()
  }, [])

  const handleProviderAction = (providerId: number, action: 'approve' | 'reject') => {
    console.log(`${action} provider ${providerId}`);
  };

  const mainActions = ["Adresse", "RIB", "Identité", "Assurance"];

  const handleAccept = async (provider: any, i: number) => {
    setIsLoading(true)
    const data = provider.kyc
    if (i == 0) {
      data.address.status = "verified"
    }
    if (i == 1) {
      data.bank.status = "verified"
    }
    if (i == 2) {
      data.identity.status = "verified"
    }
    if (i == 3) {
      data.insurance.status = "verified"
    }
    await updateDoc(doc(db, 'profiles', provider.id), {kyc: data, verified: data.address.status == "verified" && data.bank.status == "verified" && data.identity.status == "verified" && data.insurance.status == "verified"});
    const docs = (await getDocs(query(collection(db, "profiles"), where("role", "==", 1), where("verified", "==", false)))).docs
    setKycProviders(docs.map((e) => e.data()))
    setIsLoading(false)
  }

  const handleReject = async () => {
    setIsLoading(true)
    const data = selectedProvider.kyc
    if (selectedIndex == 0) {
      data.address.status = "not_started"
      data.address.url = ""
      data.address.reason = reason
    }
    if (selectedIndex == 1) {
      data.bank.status = "not_started"
      data.bank.url = ""
      data.bank.reason = reason
    }
    if (selectedIndex == 2) {
      data.identity.status = "not_started"
      data.identity.url = ""
      data.identity.reason = reason
    }
    if (selectedIndex == 3) {
      data.insurance.status = "not_started"
      data.insurance.url = ""
      data.insurance.reason = reason
    }
    setReason("")
    await updateDoc(doc(db, 'profiles', selectedProvider.id), {kyc: data});
    const docs = (await getDocs(query(collection(db, "profiles"), where("role", "==", 1), where("verified", "==", false)))).docs
    setKycProviders(docs.map((e) => e.data()))
    setIsLoading(false)
  }

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

      <Dialog open={isDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Refuser un document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Raison</Label>
              <Textarea
                id="feedback"
                placeholder="Ajoutez un commentaire pour le prestataire..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button 
                onClick={() => handleReject()}
                className="flex-1"
              >
                Envoyer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                    { id: 'overview', label: "Chiffre prestataire", icon: BarChart3 },
                    { id: 'kyc', label: "Vérifications", icon: BarChart3 },
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
            {activeTab === 'kyc' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Vérifications des Préstataires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {kycProviders.map((provider) => {
                        if (provider.kyc.address.url === "" && provider.kyc.bank.url === "" && provider.kyc.insurance.url === "" && provider.kyc.identity.url === "") {
                          return
                        }
                        return (
                        <div key={provider.id} className="border rounded-lg p-4">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base sm:text-lg mb-2">{provider.name}</h3>
                              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                                <p>User ID : {provider.id}</p>
                                <p>Email: {provider.email}</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                            {mainActions.map((label, i) => {
                              let url = ""
                              if (i == 0) {
                                if (provider.kyc.address.url === "" || provider.kyc.address.status === "verified") {
                                  return
                                }
                                url = provider.kyc.address.url
                              }
                              if (i == 1) {
                                if (provider.kyc.bank.url === "" || provider.kyc.bank.status === "verified") {
                                  return
                                }
                                url = provider.kyc.bank.url
                              }
                              if (i == 2) {
                                if (provider.kyc.identity.url === "" || provider.kyc.identity.status === "verified") {
                                  return
                                }
                                url = provider.kyc.identity.url
                              }
                              if (i == 3) {
                                if (provider.kyc.insurance.url === "" || provider.kyc.insurance.status === "verified") {
                                  return
                                }
                                url = provider.kyc.insurance.url
                              }
                              return (
                              <div key={label+provider.id} className="flex flex-col items-center space-y-2 mt-2.5">
                                <Button variant="outline" className="w-full" onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
                                  {label}
                                </Button>
                                <div className="flex gap-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="bg-red-500/10 text-red-600 hover:bg-red-500/20"
                                    aria-label={`Refuser ${label}`}
                                    onClick={() => {setIsDialogOpen(true); setSelectedProvider(provider); setSelectedIndex(i)}}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="bg-green-500/10 text-green-600 hover:bg-green-500/20"
                                    aria-label={`Valider ${label}`}
                                    onClick={() => handleAccept(provider, i)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>

                                </div>
                              </div>
                            )})}
                          </div>
                        </div>
                      )})}
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
