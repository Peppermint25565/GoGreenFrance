
import { useState } from "react";
import { proposeAdjustment } from "@/services/requests";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Euro, Upload, AlertCircle, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PriceAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string;
  originalPrice: number;
  clientName: string;
  serviceName: string;
  onSubmitAdjustment: (adjustment: {
    newPrice: number;
    justification: string;
    photos: File[];
    videos: File[];
  }) => void;
}

const PriceAdjustmentModal = ({ 
  isOpen, 
  onClose, 
  missionId,
  originalPrice,
  clientName,
  serviceName,
  onSubmitAdjustment 
}: PriceAdjustmentModalProps) => {
  const [newPrice, setNewPrice] = useState(originalPrice);
  const [justification, setJustification] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const { toast } = useToast();

  const priceIncrease = newPrice - originalPrice;
  const percentageIncrease = ((priceIncrease / originalPrice) * 100).toFixed(1);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos(prev => [...prev, ...files]);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setVideos(prev => [...prev, ...files]);
  };

  const removeFile = (index: number, type: 'photo' | 'video') => {
    if (type === 'photo') {
      setPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setVideos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    if (newPrice > originalPrice && justification.trim().length < 20) {
      toast({
        title: "Justification requise",
        description: "Veuillez expliquer en détail la raison de l'augmentation (minimum 20 caractères)",
        variant: "destructive",
      });
      return;
    }

    // Reset form
    setNewPrice(originalPrice);
    setJustification("");
    setPhotos([]);
    setVideos([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajuster le tarif de la mission</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations mission */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium">{serviceName}</h3>
            <p className="text-sm text-muted-foreground">Client : {clientName}</p>
            <p className="text-sm text-muted-foreground">Mission #{missionId}</p>
          </div>

          {/* Comparaison prix */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Prix initial</p>
              <p className="text-2xl font-bold">{originalPrice}€</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Nouveau prix</p>
              <p className="text-2xl font-bold text-blue-600">{newPrice}€</p>
              {priceIncrease > 0 && (
                <p className="text-sm text-blue-600">+{priceIncrease}€ (+{percentageIncrease}%)</p>
              )}
            </div>
          </div>

          {/* Ajustement prix */}
          <div className="space-y-2">
            <Label htmlFor="price">Nouveau tarif</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="price"
                type="number"
                step="5"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="flex-1"
              />
              <Euro className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Alert si augmentation */}
          {newPrice > originalPrice && (
            <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800">Augmentation de tarif détectée</p>
                <p className="text-orange-700">
                  Vous devez justifier cette augmentation avec des explications détaillées et des preuves visuelles.
                </p>
              </div>
            </div>
          )}

          {/* Justification */}
          <div className="space-y-2">
            <Label htmlFor="justification">
              Justification {newPrice > originalPrice && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="justification"
              placeholder="Expliquez les raisons de cet ajustement (terrain difficile, accès compliqué, travail supplémentaire requis...)"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={4}
              className={newPrice > originalPrice && justification.length < 20 ? "border-orange-500" : ""}
            />
            {newPrice > originalPrice && (
              <p className="text-xs text-muted-foreground">
                {justification.length}/20 caractères minimum requis
              </p>
            )}
          </div>

          {/* Upload photos */}
          <div className="space-y-3">
            <Label>Photos justificatives</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
              <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Ajoutez des photos pour justifier l'ajustement
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photos-upload"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('photos-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Ajouter des photos
              </Button>
            </div>
            
            {/* Photos preview */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground p-2">
                      {photo.name}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeFile(index, 'photo')}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload vidéos */}
          <div className="space-y-3">
            <Label>Vidéos explicatives (optionnel)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Ajoutez une vidéo courte pour expliquer la situation
              </p>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                id="videos-upload"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => document.getElementById('videos-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Ajouter une vidéo
              </Button>
            </div>

            {/* Videos preview */}
            {videos.length > 0 && (
              <div className="space-y-2">
                {videos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <span className="text-sm">{video.name}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFile(index, 'video')}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Envoyer la proposition
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceAdjustmentModal;
