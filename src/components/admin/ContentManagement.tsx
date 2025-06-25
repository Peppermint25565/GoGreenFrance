
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Plus, Settings, Euro, HelpCircle } from "lucide-react";

interface Service {
  id: number;
  nom: string;
  description: string;
  prix: string;
  statut: "actif" | "inactif";
  categorie: string;
}

interface FAQ {
  id: number;
  question: string;
  reponse: string;
  categorie: string;
  statut: "publie" | "brouillon";
}

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState<"services" | "tarifs" | "faq" | "contenu">("services");

  const services: Service[] = [
    {
      id: 1,
      nom: "Tonte de pelouse",
      description: "Tonte régulière et entretien de pelouse",
      prix: "35-80€",
      statut: "actif",
      categorie: "Jardinage"
    },
    {
      id: 2,
      nom: "Élagage",
      description: "Taille et élagage d'arbres",
      prix: "80-200€",
      statut: "actif",
      categorie: "Jardinage"
    },
    {
      id: 3,
      nom: "Ramassage déchets verts",
      description: "Collecte et évacuation déchets verts",
      prix: "25-60€",
      statut: "inactif",
      categorie: "Collecte"
    },
  ];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "Comment réserver un service ?",
      reponse: "Vous pouvez réserver directement via l'application...",
      categorie: "Utilisation",
      statut: "publie"
    },
    {
      id: 2,
      question: "Quels sont les modes de paiement ?",
      reponse: "Nous acceptons les cartes bancaires...",
      categorie: "Paiement",
      statut: "publie"
    },
    {
      id: 3,
      question: "Comment devenir prestataire ?",
      reponse: "Pour devenir prestataire, vous devez...",
      categorie: "Prestataires",
      statut: "brouillon"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      actif: { variant: "default" as const, label: "actif" },
      inactif: { variant: "secondary" as const, label: "inactif" },
      publie: { variant: "default" as const, label: "publié" },
      brouillon: { variant: "outline" as const, label: "brouillon" }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { variant: "outline" as const, label: status };
    
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Gestion du Contenu
        </CardTitle>
        <CardDescription>
          Administration des services, tarifs, FAQ et contenu du site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === "services" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("services")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Services
            </Button>
            <Button
              variant={activeTab === "tarifs" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("tarifs")}
            >
              <Euro className="h-4 w-4 mr-2" />
              Tarifs
            </Button>
            <Button
              variant={activeTab === "faq" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("faq")}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </Button>
            <Button
              variant={activeTab === "contenu" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("contenu")}
            >
              <Edit className="h-4 w-4 mr-2" />
              Contenu
            </Button>
          </div>
        </div>

        {activeTab === "services" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Services disponibles</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau service
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service.nom}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{service.categorie}</TableCell>
                    <TableCell>{service.prix}</TableCell>
                    <TableCell>{getStatusBadge(service.statut)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === "faq" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Questions fréquentes</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle FAQ
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{faq.question}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{faq.reponse}</div>
                      </div>
                    </TableCell>
                    <TableCell>{faq.categorie}</TableCell>
                    <TableCell>{getStatusBadge(faq.statut)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === "tarifs" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Gestion des tarifs</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau tarif
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Commission standard</h4>
                  <p className="text-2xl font-bold text-green-600">10%</p>
                  <p className="text-sm text-gray-500">Sur chaque mission</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Modifier
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Frais de service client</h4>
                  <p className="text-2xl font-bold text-blue-600">2€</p>
                  <p className="text-sm text-gray-500">Par demande</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Modifier
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Abonnement prestataire</h4>
                  <p className="text-2xl font-bold text-purple-600">29€</p>
                  <p className="text-sm text-gray-500">Par mois</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Modifier
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "contenu" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Gestion du contenu</h3>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Page d'accueil</h4>
                      <p className="text-sm text-gray-500">Titre principal, descriptions, images</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Éditer
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">À propos</h4>
                      <p className="text-sm text-gray-500">Histoire de l'entreprise, équipe</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Éditer
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Conditions d'utilisation</h4>
                      <p className="text-sm text-gray-500">CGU, politique de confidentialité</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Éditer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentManagement;
