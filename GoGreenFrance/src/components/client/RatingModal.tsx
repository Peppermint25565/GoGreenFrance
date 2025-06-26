
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  serviceName: string;
  onSubmitRating: (rating: number, comment: string) => void;
}

const RatingModal = ({ isOpen, onClose, providerName, serviceName, onSubmitRating }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Évaluation requise",
        description: "Veuillez donner une note avant de valider",
        variant: "destructive",
      });
      return;
    }

    onSubmitRating(rating, comment);
    toast({
      title: "Évaluation envoyée",
      description: "Merci pour votre retour ! Il aidera les futurs clients.",
    });
    
    // Reset form
    setRating(0);
    setHoverRating(0);
    setComment("");
    onClose();
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1: return "Très insatisfait";
      case 2: return "Insatisfait";
      case 3: return "Correct";
      case 4: return "Satisfait";
      case 5: return "Très satisfait";
      default: return "Sélectionnez une note";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Évaluez votre prestataire</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="font-medium">{providerName}</h3>
            <p className="text-sm text-gray-600">{serviceName}</p>
          </div>

          {/* Système d'étoiles */}
          <div className="space-y-3">
            <Label>Votre satisfaction</Label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-colors"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">
              {getRatingText(hoverRating || rating)}
            </p>
          </div>

          {/* Commentaire */}
          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              placeholder="Partagez votre expérience avec ce prestataire..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          {/* Suggestions d'amélioration */}
          {rating > 0 && rating < 4 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                Votre retour nous aide à améliorer nos services. 
                N'hésitez pas à détailler ce qui pourrait être amélioré.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Envoyer l'évaluation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
