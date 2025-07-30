
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Wrench, Clock, Star, Euro, Zap, Shield } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategory?: "express" | "professionnel";
  basePrice: number;
  estimatedDuration: string;
  popularity: number;
  tags: string[];
  interventionTime: string;
  providerType: string;
}

interface ServiceSelectorProps {
  onServiceSelect: (service: Service) => void;
  selectedService?: Service;
}

const ServiceSelector = ({ onServiceSelect, selectedService }: ServiceSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<"express" | "professionnel" | null>(null);

  const services: Service[] = [
    {
      "id": "montage-meubles",
      "name": "Montage de meubles",
      "description": "Montage de meubles",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 40,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Meubles", "Express"],
      "interventionTime": "sous 3h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "pose-etageres-tringles-cadres",
      "name": "Pose d'étagères, tringles, cadres",
      "description": "Pose d'étagères, tringles, cadres",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 30,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Fixation", "Rapide"],
      "interventionTime": "sous 3h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "reparations-diverses-poignees-serrures",
      "name": "Réparations diverses (poignées, serrures)",
      "description": "Réparations diverses (poignées, serrures)",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 45,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Petites‑réparations", "Express"],
      "interventionTime": "sous 3h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "pose-joints",
      "name": "Pose de joints",
      "description": "Pose de joints",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 35,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Étanchéité", "Rapide"],
      "interventionTime": "sous 3h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "remplacement-prises-interrupteurs-bricolage",
      "name": "Remplacement de prises, interrupteurs",
      "description": "Remplacement de prises, interrupteurs",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 25,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Électricité", "Express"],
      "interventionTime": "sous 3h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "fixation-tv-tableaux-objets",
      "name": "Fixation TV, tableaux, objets",
      "description": "Fixation TV, tableaux, objets",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 40,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Fixation", "Précision"],
      "interventionTime": "sous 3h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "pose-rideaux-stores",
      "name": "Pose de rideaux et stores",
      "description": "Pose de rideaux et stores",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 30,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Décoration", "Rapide"],
      "interventionTime": "sous 3h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "bouchage-trous-retouches-peinture",
      "name": "Bouchage de trous, retouches peinture",
      "description": "Bouchage de trous, retouches peinture",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 35,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Peinture", "Finitions"],
      "interventionTime": "sous 3h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "menage-ponctuel",
      "name": "Ménage ponctuel (1h)",
      "description": "Ménage ponctuel",
      "category": "bricolage",
      "basePrice": 25,
      "estimatedDuration": "1h",
      "popularity": 0,
      "tags": ["Nettoyage", "Rapide"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "nettoyage-printemps",
      "name": "Nettoyage de printemps",
      "description": "Nettoyage de printemps",
      "category": "bricolage",
      "basePrice": 3,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Grand‑nettoyage", "Saisonnier"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "lavage-vitres",
      "name": "Lavage de vitres",
      "description": "Lavage de vitres",
      "category": "bricolage",
      "basePrice": 5,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Vitres", "Brillant"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "nettoyage-fin-chantier",
      "name": "Nettoyage de fin de chantier",
      "description": "Nettoyage de fin de chantier",
      "category": "bricolage",
      "basePrice": 4,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Post‑chantier", "Professionnel"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "nettoyage-apres-demenagement",
      "name": "Nettoyage après déménagement",
      "description": "Nettoyage après déménagement",
      "category": "bricolage",
      "basePrice": 4,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Fin‑location", "Complet"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "repassage-domicile",
      "name": "Repassage à domicile (1h)",
      "description": "Repassage à domicile",
      "category": "bricolage",
      "basePrice": 20,
      "estimatedDuration": "1h",
      "popularity": 0,
      "tags": ["Linge", "Soin‑textile"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "desinfection",
      "name": "Désinfection (COVID, allergènes)",
      "description": "Désinfection (COVID, allergènes)",
      "category": "bricolage",
      "basePrice": 6,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Sanitaire", "Hygiène"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "tonte-pelouse",
      "name": "Tonte de pelouse",
      "description": "Tonte de pelouse",
      "category": "jardinage",
      "basePrice": 1.5,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Pelouse", "Rapide"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "taille-haies-arbustes",
      "name": "Taille de haies, arbustes",
      "description": "Taille de haies, arbustes",
      "category": "jardinage",
      "basePrice": 3,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Haies", "Entretien"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "desherbage",
      "name": "Désherbage",
      "description": "Désherbage",
      "category": "jardinage",
      "basePrice": 2,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Mauvaises‑herbes", "Écologique"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "ramassage-feuilles",
      "name": "Ramassage de feuilles",
      "description": "Ramassage de feuilles",
      "category": "jardinage",
      "basePrice": 1,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Saison", "Nettoyage"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "nettoyage-terrasse-balcon",
      "name": "Nettoyage terrasse/balcon",
      "description": "Nettoyage terrasse/balcon",
      "category": "jardinage",
      "basePrice": 2.5,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Extérieur", "Pression"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "arrosage-plantes",
      "name": "Arrosage de plantes",
      "description": "Arrosage de plantes",
      "category": "jardinage",
      "basePrice": 20,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Entretien", "Soins‑plantes"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "entretien-jardin-potager",
      "name": "Entretien jardin potager",
      "description": "Entretien jardin potager",
      "category": "jardinage",
      "basePrice": 2.5,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Potager", "Bio"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "montage-mobilier-exterieur",
      "name": "Montage mobilier extérieur",
      "description": "Montage mobilier extérieur",
      "category": "jardinage",
      "basePrice": 40,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Mobilier", "Extérieur"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "aide-demenagement",
      "name": "Aide au déménagement (1h)",
      "description": "Aide au déménagement",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 30,
      "estimatedDuration": "1h",
      "popularity": 0,
      "tags": ["Portage", "Logistique"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "chargement-dechargement-camion",
      "name": "Chargement/déchargement camion",
      "description": "Chargement/déchargement camion",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 35,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Camion", "Déménagement"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "deplacement-meubles-lourds",
      "name": "Déplacement de meubles lourds",
      "description": "Déplacement de meubles lourds",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 50,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Lourds", "Sécurité"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "transport-encombrants-dechetterie",
      "name": "Transport encombrants déchetterie",
      "description": "Transport encombrants déchetterie",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 45,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Déchetterie", "Écologique"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "livraison-meubles-electromenagers",
      "name": "Livraison meubles/électroménagers",
      "description": "Livraison meubles/électroménagers",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 50,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Livraison", "Gros‑volume"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "debouchage-evier-lavabo-douche",
      "name": "Débouchage évier/lavabo/douche",
      "description": "Débouchage évier/lavabo/douche",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 40,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Urgence", "Canalisation"],
      "interventionTime": "sous 12h",
      "providerType": "Pros certifiés uniquement"
    },
    {
      "id": "changement-robinet",
      "name": "Changement de robinet",
      "description": "Changement de robinet",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 50,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Robinetterie", "Plomberie"],
      "interventionTime": "sous 12h",
      "providerType": "Pros certifiés uniquement"
    },
    {
      "id": "remplacement-flexible-douche",
      "name": "Remplacement flexible douche",
      "description": "Remplacement flexible douche",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 30,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Douche", "Flexible"],
      "interventionTime": "sous 12h",
      "providerType": "Pros certifiés uniquement"
    },
    {
      "id": "installation-lave-linge-lave-vaisselle",
      "name": "Installation lave-linge/lave-vaisselle",
      "description": "Installation lave-linge/lave-vaisselle",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 50,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Électroménager", "Raccordement"],
      "interventionTime": "sous 12h",
      "providerType": "Pros certifiés uniquement"
    },
    {
      "id": "petites-fuites",
      "name": "Petites fuites (joints, siphons)",
      "description": "Petites fuites (joints, siphons)",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 40,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Fuite", "Réparation"],
      "interventionTime": "sous 12h",
      "providerType": "Pros certifiés uniquement"
    },
    {
      "id": "changement-luminaires",
      "name": "Changement luminaires",
      "description": "Changement luminaires",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 35,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Éclairage", "Sécurité"],
      "interventionTime": "sous 12h",
      "providerType": "Pros certifiés uniquement"
    },
    {
      "id": "remplacement-prises-interrupteurs-electricite",
      "name": "Remplacement prises/interrupteurs",
      "description": "Remplacement prises/interrupteurs",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 30,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Prises", "Mise‑aux‑normes"],
      "interventionTime": "sous 12h",
      "providerType": "Pros certifiés uniquement"
    },
    {
      "id": "installation-detecteurs-fumee",
      "name": "Installation détecteurs de fumée",
      "description": "Installation détecteurs de fumée",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 25,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Sécurité", "Détecteur"],
      "interventionTime": "sous 12h",
      "providerType": "Pros certifiés uniquement"
    },
    {
      "id": "pose-multiprises-murales",
      "name": "Pose multiprises murales",
      "description": "Pose multiprises murales",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 20,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Courant", "Pratique"],
      "interventionTime": "sous 12h",
      "providerType": "Pros certifiés uniquement"
    },
    {
      "id": "depannage-petits-appareils",
      "name": "Dépannage petits appareils",
      "description": "Dépannage petits appareils",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 30,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Dépannage", "Électronique"],
      "interventionTime": "sous 12h",
      "providerType": "Pros certifiés uniquement"
    },
    {
      "id": "rafraichissement-peinture-mur",
      "name": "Rafraîchissement peinture mur",
      "description": "Rafraîchissement peinture mur",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 6,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Peinture", "Rénovation"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "pose-papier-peint",
      "name": "Pose de papier peint",
      "description": "Pose de papier peint",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 8,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Décoration", "Mur"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "pose-stickers-decorations",
      "name": "Pose de stickers/décorations",
      "description": "Pose de stickers/décorations",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 25,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Stickers", "Rapide"],
      "interventionTime": "sous 3h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "conseils-amenagement-interieur",
      "name": "Conseils aménagement intérieur",
      "description": "Conseils aménagement intérieur",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 45,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Design", "Conseil"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "assemblage-jouets-velos",
      "name": "Assemblage jouets, vélos",
      "description": "Assemblage jouets, vélos",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 30,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Assemblage", "Loisir"],
      "interventionTime": "sous 3h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "securisation-domicile-enfants",
      "name": "Sécurisation domicile enfants",
      "description": "Sécurisation domicile enfants",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 35,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Sécurité", "Enfants"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "aide-informatique-simple",
      "name": "Aide informatique simple",
      "description": "Aide informatique simple",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 40,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Informatique", "Assistance"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "aide-administrative-domicile",
      "name": "Aide administrative à domicile",
      "description": "Aide administrative à domicile",
      "category": "bricolage",
      "subCategory": "express",
      "basePrice": 25,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Documents", "Support"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    },
    {
      "id": "surveillance-domicile",
      "name": "Surveillance domicile",
      "description": "Surveillance domicile",
      "category": "bricolage",
      "subCategory": "professionnel",
      "basePrice": 20,
      "estimatedDuration": "",
      "popularity": 0,
      "tags": ["Veille", "Sécurité"],
      "interventionTime": "sous 12h",
      "providerType": "Tous prestataires"
    }
  ];



  // Fix the filtering logic to properly show services
  const filteredServices = services.filter(service => {
    if (!selectedCategory) return false;
    
    if (service.category !== selectedCategory) return false;
    
    if (selectedCategory === "jardinage") {
      return true; // Show all jardinage services
    }
    
    if (selectedCategory === "bricolage") {
      if (!selectedSubCategory) return false;
      return service.subCategory === selectedSubCategory;
    }
    
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Sélection de catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Choisissez votre type de service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={selectedCategory === "jardinage" ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory("jardinage");
                setSelectedSubCategory(null);
              }}
              className="h-20 flex-col gap-2"
            >
              <Leaf className="h-6 w-6 text-green-600" />
              <div>
                <div className="font-medium">AtoiGreen - Jardinage</div>
                <div className="text-xs opacity-70">Écoresponsable et durable</div>
              </div>
            </Button>
            
            <Button
              variant={selectedCategory === "bricolage" ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory("bricolage");
                setSelectedSubCategory(null);
              }}
              className="h-20 flex-col gap-2"
            >
              <Wrench className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-medium">AtoiFix - Bricolage</div>
                <div className="text-xs opacity-70">Réparations et montages</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sous-catégories pour bricolage */}
      {selectedCategory === "bricolage" && (
        <Card>
          <CardHeader>
            <CardTitle>Type d'intervention GreenFix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant={selectedSubCategory === "express" ? "default" : "outline"}
                onClick={() => setSelectedSubCategory("express")}
                className="h-16 flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Petits travaux express</span>
                </div>
                <div className="text-xs opacity-70">Intervention sous 3h</div>
              </Button>
              
              <Button
                variant={selectedSubCategory === "professionnel" ? "default" : "outline"}
                onClick={() => setSelectedSubCategory("professionnel")}
                className="h-16 flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Travaux professionnels</span>
                </div>
                <div className="text-xs opacity-70">Intervention sous 12h</div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des services - Updated condition to show services correctly */}
      {(selectedCategory === "jardinage" || (selectedCategory === "bricolage" && selectedSubCategory)) && filteredServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Services {selectedCategory === "jardinage" ? "de jardinage" : 
                selectedSubCategory === "express" ? "express (sous 3h)" : "professionnels (sous 12h)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedService?.id === service.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => onServiceSelect(service)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-lg">{service.name}</h3>
                        {service.subCategory === "express" && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            <Zap className="h-3 w-3 mr-1" />
                            Express
                          </Badge>
                        )}
                        {service.subCategory === "professionnel" && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <Shield className="h-3 w-3 mr-1" />
                            Pro
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="text-xs text-gray-500">
                        {service.providerType} • Intervention {service.interventionTime}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-orange-500">
                        <Star className="h-3 w-3 fill-current" />
                        {service.popularity}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {service.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-3 w-3" />
                        {service.estimatedDuration}
                      </div>
                      <div className="flex items-center gap-1 font-medium text-green-600">
                        <Euro className="h-3 w-3" />
                        À partir de {service.basePrice}€
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug info - remove this in production */}
      {selectedCategory && (
        <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
          Debug: Catégorie sélectionnée: {selectedCategory}, 
          Sous-catégorie: {selectedSubCategory || 'aucune'}, 
          Services filtrés: {filteredServices.length}
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;
