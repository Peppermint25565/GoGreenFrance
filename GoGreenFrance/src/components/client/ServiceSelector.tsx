
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Wrench, Clock, Star, Euro, Zap, Shield } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  category: "jardinage" | "bricolage";
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
  const [selectedCategory, setSelectedCategory] = useState<"jardinage" | "bricolage" | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<"express" | "professionnel" | null>(null);

  const services: Service[] = [
    // Services jardinage
    {
      id: "tonte-pelouse",
      name: "Tonte de pelouse",
      description: "Tonte complète de votre pelouse avec ramassage des déchets",
      category: "jardinage",
      basePrice: 0.8,
      estimatedDuration: "1-2h",
      popularity: 95,
      tags: ["Écologique", "Rapide"],
      interventionTime: "sous 12h",
      providerType: "Tous prestataires"
    },
    {
      id: "taille-haies",
      name: "Taille de haies",
      description: "Taille professionnelle de vos haies et arbustes",
      category: "jardinage",
      basePrice: 15,
      estimatedDuration: "2-3h",
      popularity: 88,
      tags: ["Précision", "Expertise"],
      interventionTime: "sous 12h",
      providerType: "Tous prestataires"
    },
    
    // Services bricolage express (sous 3h)
    {
      id: "montage-meuble",
      name: "Montage de meubles",
      description: "Montage de commodes, tables, bureaux, lits, étagères IKEA",
      category: "bricolage",
      subCategory: "express",
      basePrice: 60,
      estimatedDuration: "1-2h",
      popularity: 92,
      tags: ["Express", "IKEA"],
      interventionTime: "sous 3h",
      providerType: "Tous prestataires formés"
    },
    {
      id: "fixation-murale",
      name: "Fixations murales",
      description: "Fixation TV, cadres, étagères, tringles à rideaux, miroirs",
      category: "bricolage",
      subCategory: "express",
      basePrice: 35,
      estimatedDuration: "30min-1h",
      popularity: 85,
      tags: ["Express", "Précision"],
      interventionTime: "sous 3h",
      providerType: "Tous prestataires formés"
    },
    {
      id: "installation-pateres",
      name: "Installation d'accessoires",
      description: "Patères, porte-serviettes, crochets muraux",
      category: "bricolage",
      subCategory: "express",
      basePrice: 25,
      estimatedDuration: "30min-1h",
      popularity: 78,
      tags: ["Express", "Rapide"],
      interventionTime: "sous 3h",
      providerType: "Tous prestataires formés"
    },
    {
      id: "petites-reparations",
      name: "Petites réparations domestiques",
      description: "Poignées de porte, rebouchage trous, joints silicone",
      category: "bricolage",
      subCategory: "express",
      basePrice: 40,
      estimatedDuration: "1h",
      popularity: 82,
      tags: ["Express", "Réparation"],
      interventionTime: "sous 3h",
      providerType: "Tous prestataires formés"
    },
    {
      id: "electricite-base",
      name: "Électricité de base",
      description: "Ampoules, douilles, interrupteurs, prises, plafonniers",
      category: "bricolage",
      subCategory: "express",
      basePrice: 45,
      estimatedDuration: "30min-1h",
      popularity: 88,
      tags: ["Express", "Électricité"],
      interventionTime: "sous 3h",
      providerType: "Tous prestataires formés"
    },
    {
      id: "plomberie-legere",
      name: "Plomberie légère",
      description: "Débouchage évier, réparation fuites simples, pommeau douche",
      category: "bricolage",
      subCategory: "express",
      basePrice: 55,
      estimatedDuration: "1h",
      popularity: 80,
      tags: ["Express", "Plomberie"],
      interventionTime: "sous 3h",
      providerType: "Tous prestataires formés"
    },
    {
      id: "accessoires-securite",
      name: "Accessoires et sécurité",
      description: "Barres d'appui, boîte aux lettres, rideaux, stores",
      category: "bricolage",
      subCategory: "express",
      basePrice: 50,
      estimatedDuration: "1-2h",
      popularity: 75,
      tags: ["Express", "Sécurité"],
      interventionTime: "sous 3h",
      providerType: "Tous prestataires formés"
    },

    // Services bricolage professionnels (sous 12h)
    {
      id: "peinture-complete",
      name: "Peinture complète",
      description: "Peinture murs/plafond, enduit et lissage, ponçage",
      category: "bricolage",
      subCategory: "professionnel",
      basePrice: 25,
      estimatedDuration: "4-8h",
      popularity: 90,
      tags: ["Pro", "Rénovation"],
      interventionTime: "sous 12h",
      providerType: "Pros certifiés uniquement"
    },
    {
      id: "sol-cloison",
      name: "Sol & cloisons",
      description: "Parquet, lino, PVC, cloison placo, isolation",
      category: "bricolage",
      subCategory: "professionnel",
      basePrice: 30,
      estimatedDuration: "4-6h",
      popularity: 85,
      tags: ["Pro", "Isolation"],
      interventionTime: "sous 12h",
      providerType: "Pros certifiés uniquement"
    },
    {
      id: "plomberie-certifiee",
      name: "Plomberie certifiée",
      description: "Robinets mitigeurs, WC, meuble vasque, fuites encastrées",
      category: "bricolage",
      subCategory: "professionnel",
      basePrice: 80,
      estimatedDuration: "2-4h",
      popularity: 88,
      tags: ["Pro", "Certifié"],
      interventionTime: "sous 12h",
      providerType: "Pros certifiés uniquement"
    },
    {
      id: "electricite-certifiee",
      name: "Électricité certifiée",
      description: "Prises, tableau divisionnaire, disjoncteurs, mise aux normes",
      category: "bricolage",
      subCategory: "professionnel",
      basePrice: 90,
      estimatedDuration: "2-4h",
      popularity: 87,
      tags: ["Pro", "Normes"],
      interventionTime: "sous 12h",
      providerType: "Pros certifiés uniquement"
    },
    {
      id: "cuisine-amenagement",
      name: "Cuisine & aménagement",
      description: "Montage cuisine, hotte, plaque, évier, crédence",
      category: "bricolage",
      subCategory: "professionnel",
      basePrice: 120,
      estimatedDuration: "6-8h",
      popularity: 92,
      tags: ["Pro", "Cuisine"],
      interventionTime: "sous 12h",
      providerType: "Pros certifiés uniquement"
    },
    {
      id: "reparation-urgence",
      name: "Réparation d'urgence",
      description: "Post-sinistre, séchage, sécurisation volet/porte",
      category: "bricolage",
      subCategory: "professionnel",
      basePrice: 100,
      estimatedDuration: "2-6h",
      popularity: 95,
      tags: ["Pro", "Urgence"],
      interventionTime: "sous 12h",
      providerType: "Pros certifiés uniquement"
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

  console.log('Selected category:', selectedCategory);
  console.log('Selected subcategory:', selectedSubCategory);
  console.log('Filtered services:', filteredServices);

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
                <div className="font-medium">GreenGo - Jardinage</div>
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
                <div className="font-medium">GreenFix - Bricolage</div>
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
