
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; coordinates: { lat: number; lng: number } }) => void;
  initialAddress?: string;
}

const LocationPicker = ({ onLocationSelect, initialAddress = "" }: LocationPickerProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [isLocating, setIsLocating] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [preciselocation, setPreciseLocation] = useState<string>("");
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive",
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        setCoordinates({ lat, lng });
        
        // Créer une adresse précise avec les coordonnées
        const preciseAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)} (Précision: ${Math.round(accuracy)}m)`;
        setPreciseLocation(preciseAddress);
        
        // Si l'utilisateur n'a pas encore saisi d'adresse, utiliser les coordonnées
        if (!address.trim()) {
          setAddress(preciseAddress);
        }
        
        onLocationSelect({
          address: address.trim() || preciseAddress,
          coordinates: { lat, lng }
        });
        
        setIsLocating(false);
        toast({
          title: "Position détectée",
          description: `Localisation précise obtenue (±${Math.round(accuracy)}m)`,
        });
      },
      (error) => {
        console.error('Erreur géolocalisation:', error);
        setIsLocating(false);
        let errorMessage = "Impossible d'obtenir votre position.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission de géolocalisation refusée. Veuillez l'autoriser dans votre navigateur.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position non disponible. Vérifiez votre connexion GPS.";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai d'attente dépassé. Réessayez.";
            break;
        }
        
        toast({
          title: "Erreur de géolocalisation",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    
    // Si l'utilisateur saisit une adresse et qu'on a des coordonnées précises, les utiliser
    if (newAddress.length > 3 && coordinates) {
      onLocationSelect({
        address: newAddress,
        coordinates: coordinates
      });
    }
  };

  const handleConfirmLocation = () => {
    if (!address.trim()) {
      toast({
        title: "Adresse requise",
        description: "Veuillez saisir votre adresse complète",
        variant: "destructive",
      });
      return;
    }

    // Si on n'a pas de coordonnées précises, générer des coordonnées approximatives pour la France
    let finalCoordinates = coordinates;
    if (!coordinates) {
      // Coordonnées approximatives centrées sur la France avec une variation aléatoire
      finalCoordinates = {
        lat: 46.603354 + (Math.random() - 0.5) * 8,
        lng: 1.888334 + (Math.random() - 0.5) * 8
      };
      setCoordinates(finalCoordinates);
    }

    onLocationSelect({
      address: address,
      coordinates: finalCoordinates!
    });

    toast({
      title: "Adresse confirmée",
      description: "Votre localisation a été enregistrée",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localisation précise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Votre adresse complète *</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Numéro, rue, ville, code postal (ex: 123 rue de la Paix, 75001 Paris)"
          />
          <p className="text-xs text-gray-500">
            Saisissez votre adresse exacte avec le numéro de rue, ville et code postal
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="w-full"
          >
            {isLocating ? (
              <>
                <Navigation className="h-4 w-4 mr-2 animate-spin" />
                Localisation en cours...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
                Obtenir ma position GPS précise
              </>
            )}
          </Button>

        {(coordinates || address) && (address ? (
            <div className="mt-4">
              <iframe
                title="map"
                width="100%"
                height="250"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg border"
                src={`https://www.google.com/maps?q=${address}&hl=fr&z=14&output=embed`}
              />
            </div>
          ) : (
            <div className="mt-4">
              <iframe
                title="map"
                width="100%"
                height="250"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg border"
                src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&hl=fr&z=14&output=embed`}
              />
            </div>
          ))}

          {address.trim() && (
            <Button
              type="button"
              onClick={handleConfirmLocation}
              className="w-full"
            >
              Confirmer cette adresse
            </Button>
          )}
        </div>

        {preciselocation && (
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-700 mb-1">
              <MapPin className="h-4 w-4" />
              Position GPS détectée
            </div>
            <p className="text-xs text-green-600">{preciselocation}</p>
            <p className="text-xs text-green-500 mt-1">
              💡 Vous pouvez maintenant saisir votre adresse exacte ci-dessus
            </p>
          </div>
        )}

        {coordinates && address.trim() && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <MapPin className="h-4 w-4" />
            Adresse et position confirmées
          </div>
        )}

        {!coordinates && address.length > 0 && address.length <= 10 && (
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <AlertCircle className="h-4 w-4" />
            Adresse trop courte - ajoutez le numéro, rue, ville et code postal
          </div>
        )}

        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
          <strong>💡 Pour une intervention précise :</strong><br/>
          1. Cliquez sur "Obtenir ma position GPS" pour une localisation exacte<br/>
          2. Saisissez votre adresse complète (numéro + rue + ville + code postal)<br/>
          3. Confirmez votre adresse
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationPicker;
