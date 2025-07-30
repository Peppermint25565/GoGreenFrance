
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface RatingModalProps {
  providerName: string;
  serviceName: string;
  onSubmitRating: (orderId: string, rating: number) => void;
  orderId: string
}

const RatingModal = ({ providerName, serviceName, onSubmitRating, orderId }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fas = async () => {
      const snap = await getDoc(doc(db, "requests", orderId));
      const rate = snap.data().providerRate
      setRating(rate ? rate : 0)
    }
    fas()
  }, [])

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Évaluation requise",
        description: "Veuillez donner une note avant de valider",
        variant: "destructive",
      });
      return;
    }

    onSubmitRating(orderId, rating);
    toast({
      title: "Évaluation envoyée",
      description: "Merci pour votre retour ! Il aidera les futurs clients.",
    });
    
    // Reset form
    setRating(0);
    setHoverRating(0);
    setComment("");
    setIsOpen(false)
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
    <>
    {!isOpen && (
    <Button variant="outline" onClick={() => setIsOpen(true)} className="">
      Noter
    </Button>)}
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
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
          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Envoyer l'évaluation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>);
};

export default RatingModal;
