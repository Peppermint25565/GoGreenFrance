
import { useState, useEffect } from "react";
import { createRequest } from "@/services/requests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Leaf, ArrowLeft, Upload, Calculator, Clock, Zap, Crown, Euro } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import LocationPicker from "@/components/client/LocationPicker";
import ServiceSelector from "@/components/client/ServiceSelector";

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

const CreateRequest = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get('type') || 'greengo';
  
  const [formData, setFormData] = useState({
    service: null as Service | null,
    location: {
      address: '',
      coordinates: { lat: 0, lng: 0 }
    },
    description: '',
    surface: '',
    urgency: 'normal',
    photos: [] as File[],
    isExpress: false,
    ecoOptions: {
      certificateRequested: false,
      ecoFriendlyMethods: true
    }
  });

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const calculateEstimatedPrice = () => {
    if (!formData.service || !formData.surface) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      const surface = parseFloat(formData.surface);
      let basePrice = formData.service!.basePrice;
      
      if (formData.service!.category === "jardinage") {
        basePrice = basePrice * surface;
      } else {
        basePrice = basePrice * surface;
      }

      // Express surcharge
      if (formData.isExpress) {
        basePrice *= 1.3;
      }

      // Urgency multiplier
      if (formData.urgency === 'urgent') {
        basePrice *= 1.2;
      }

      // Eco certificate addon
      if (formData.ecoOptions.certificateRequested) {
        basePrice += 15;
      }

      const finalPrice = Math.max(basePrice, 30);
      
      setEstimatedPrice(Math.round(finalPrice));
      setIsCalculating(false);
    }, 1500);
  };

  useEffect(() => {
    if (formData.service && formData.surface) {
      calculateEstimatedPrice();
    }
  }, [formData.service, formData.surface, formData.isExpress, formData.urgency, formData.ecoOptions.certificateRequested]);

  const handleLocationSelect = (location: { address: string; coordinates: { lat: number; lng: number } }) => {
    setFormData({ ...formData, location });
  };

  const handleServiceSelect = (service: Service) => {
    setFormData({ ...formData, service });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData({ ...formData, photos: [...formData.photos, ...files] });
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const requestId = await createRequest(
        user.id,
        {
          service: formData.service,
          address: formData.address,
          lat: formData.lat,
          lng: formData.lng,
          description: formData.description,
          surface: +formData.surface,
          urgency: +formData.urgency,
          photos: [],             // remplacé par la fonction
          priceOriginal: +formData.priceEstimation,
        },
        photosFiles           
      );
      toast.success("Demande créée !");
      navigate(`/client/requests/${requestId}`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-600">GreenGoFrance</span>
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
          <div className="mb-6">
            <Link to="/client/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Créer une nouvelle demande</CardTitle>
                <CardDescription>
                  Suivez les étapes pour créer votre demande personnalisée
                </CardDescription>
              </CardHeader>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sélection du service */}
              <ServiceSelector
                onServiceSelect={handleServiceSelect}
                selectedService={formData.service}
              />

              {/* Localisation */}
              {formData.service && (
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialAddress={formData.location.address}
                />
              )}

              {/* Détails de la demande */}
              {formData.service && formData.location.address && (
                <Card>
                  <CardHeader>
                    <CardTitle>Détails de votre demande</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Options spéciales */}
                    {formData.service.category === "bricolage" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="express"
                          checked={formData.isExpress}
                          onCheckedChange={(checked) => setFormData({ ...formData, isExpress: checked as boolean })}
                        />
                        <Label htmlFor="express" className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-orange-500" />
                          <span>Intervention Express (3h max) - +30%</span>
                          <Badge variant="outline" className="text-orange-600">Express</Badge>
                        </Label>
                      </div>
                    )}

                    {/* Options écologiques pour jardinage */}
                    {formData.service.category === "jardinage" && (
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Options écologiques</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="eco-certificate"
                            checked={formData.ecoOptions.certificateRequested}
                            onCheckedChange={(checked) => setFormData({ 
                              ...formData, 
                              ecoOptions: { ...formData.ecoOptions, certificateRequested: checked as boolean }
                            })}
                          />
                          <Label htmlFor="eco-certificate" className="flex items-center space-x-2">
                            <span>🌱</span>
                            <span>Certificat d'impact écologique (+15€)</span>
                          </Label>
                        </div>
                      </div>
                    )}

                    {/* Surface/Durée et Prix */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="surface">
                          {formData.service.category === 'jardinage' ? 'Surface (m²)' : 'Durée estimée (heures)'}
                        </Label>
                        <Input
                          id="surface"
                          type="number"
                          value={formData.surface}
                          onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                          placeholder={formData.service.category === 'jardinage' ? 'Ex: 100' : 'Ex: 2'}
                          className="mt-1"
                        />
                      </div>
                      
                      {/* Estimation du prix */}
                      {formData.surface && (
                        <div>
                          <Label>Estimation du prix</Label>
                          <div className="mt-1 flex items-center space-x-2">
                            {isCalculating ? (
                              <div className="flex items-center space-x-2 text-gray-500">
                                <Clock className="h-4 w-4 animate-spin" />
                                <span>Calcul en cours...</span>
                              </div>
                            ) : estimatedPrice ? (
                              <div className="flex items-center space-x-2">
                                <div className="text-2xl font-bold text-green-600 flex items-center">
                                  <Euro className="h-5 w-5 mr-1" />
                                  {estimatedPrice}€
                                </div>
                              </div>
                            ) : null}
                          </div>
                          {estimatedPrice && (
                            <p className="text-xs text-gray-500 mt-1">
                              * Tarif estimatif, peut être ajusté par le prestataire
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description">Description détaillée *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Décrivez précisément vos besoins, contraintes particulières, etc."
                        className="mt-1"
                        rows={4}
                        required
                      />
                    </div>

                    {/* Upload de photos */}
                    <div>
                      <Label>Photos (optionnel)</Label>
                      <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600 mb-2">Glissez vos photos ici ou cliquez pour les sélectionner</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                          Choisir des fichiers
                        </Button>
                      </div>
                      
                      {/* Affichage des photos uploadées */}
                      {formData.photos.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {formData.photos.map((photo, index) => (
                            <div key={index} className="relative">
                              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600">
                                {photo.name}
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                onClick={() => removePhoto(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Urgence */}
                    <div>
                      <Label className="text-base font-medium">Urgence</Label>
                      <RadioGroup
                        value={formData.urgency}
                        onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="normal" />
                          <Label htmlFor="normal">Normal (intervention sous 12h)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="urgent" id="urgent" />
                          <Label htmlFor="urgent">Urgent (intervention sous 6h) - +20%</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/client/dashboard')}>
                        Annuler
                      </Button>
                      <Button type="submit" className="flex-1">
                        Créer la demande
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
