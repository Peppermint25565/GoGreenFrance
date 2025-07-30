
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Euro, Clock, FileImage, Video, AlertTriangle, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PriceAdjustment } from "@/types/requests";

interface PriceAdjustmentNotificationProps {
  adjustments: PriceAdjustment[];
  onAcceptAdjustment: (adjustment: PriceAdjustment, feedback?: string) => void;
  onRejectAdjustment: (adjustmentId: string, reason: string) => void;
}

const PriceAdjustmentNotification = ({ 
  adjustments, 
  onAcceptAdjustment, 
  onRejectAdjustment 
}: PriceAdjustmentNotificationProps) => {
  const [selectedAdjustment, setSelectedAdjustment] = useState<PriceAdjustment | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const { toast } = useToast();

  const pendingAdjustments = adjustments.filter(adj => adj.status === 'pending');

  const handleAccept = (adjustment: PriceAdjustment) => {
    onAcceptAdjustment(adjustment, feedback.trim() || undefined);
    toast({
      title: "Ajustement accepté",
      description: `Le nouveau tarif de ${adjustment.newPrice}€ a été accepté`,
    });
    setSelectedAdjustment(null);
    setFeedback("");
  };

  const handleReject = (adjustment: PriceAdjustment) => {
    if (rejectReason.trim().length < 10) {
      toast({
        title: "Raison requise",
        description: "Veuillez expliquer pourquoi vous refusez cet ajustement (minimum 10 caractères)",
        variant: "destructive",
      });
      return;
    }

    onRejectAdjustment(adjustment.id, rejectReason.trim());
    toast({
      title: "Ajustement refusé",
      description: "Le prestataire sera notifié de votre refus",
    });
    setShowRejectModal(false);
    setSelectedAdjustment(null);
    setRejectReason("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepté</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (adjustments.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Ajustements tarifaires
            {pendingAdjustments.length > 0 && (
              <Badge variant="destructive">{pendingAdjustments.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {adjustments.map((adjustment) => (
            <div key={adjustment.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{adjustment.serviceName}</h4>
                  <p className="text-sm text-muted-foreground">
                    Prestataire : {adjustment.providerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {adjustment.timestamp.toDate().toDateString()}
                  </p>
                </div>
                {getStatusBadge(adjustment.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-sm text-muted-foreground">Prix initial</p>
                  <p className="text-lg font-bold">{adjustment.originalPrice}€</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-sm text-muted-foreground">Nouveau prix</p>
                  <p className="text-lg font-bold text-blue-600">{adjustment.newPrice}€</p>
                  <p className="text-xs text-blue-600">
                    +{adjustment.newPrice - adjustment.originalPrice}€
                  </p>
                </div>
              </div>

              {adjustment.justification && <div className="mb-3">
                <p className="text-sm font-medium mb-1">Justification :</p>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {adjustment.justification}
                </p>
              </div>}

              {(adjustment.photos.length > 0 || adjustment.videos.length > 0) && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-2">Preuves jointes :</p>
                  <div className="flex gap-2">
                    {adjustment.photos.length > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileImage className="h-3 w-3" />
                        {adjustment.photos.length} photo(s)
                      </Badge>
                    )}
                    {adjustment.videos.length > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        {adjustment.videos.length} vidéo(s)
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {adjustment.status === 'pending' && (
                <div className="flex gap-2 pt-3 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedAdjustment(adjustment);
                      setShowRejectModal(true);
                    }}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Refuser
                  </Button>
                  <Button 
                    onClick={() => setSelectedAdjustment(adjustment)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Voir détails
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modal détails et acceptation */}
      <Dialog open={selectedAdjustment !== null && !showRejectModal} onOpenChange={() => setSelectedAdjustment(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Accepter l'ajustement tarifaire</DialogTitle>
          </DialogHeader>
          
          {selectedAdjustment && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    Nouveau prix : {selectedAdjustment.newPrice}€
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Augmentation de {selectedAdjustment.newPrice - selectedAdjustment.originalPrice}€ 
                  par rapport au prix initial de {selectedAdjustment.originalPrice}€
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Commentaire (optionnel)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Ajoutez un commentaire pour le prestataire..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Important :</strong> Le paiement sera ajusté automatiquement. 
                  La mission débutera une fois le paiement confirmé.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedAdjustment(null)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={() => handleAccept(selectedAdjustment)}
                  className="flex-1"
                >
                  Accepter et payer {selectedAdjustment.newPrice}€
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal refus */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Refuser l'ajustement tarifaire
            </DialogTitle>
          </DialogHeader>
          
          {selectedAdjustment && (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  Vous êtes sur le point de refuser l'ajustement de prix de{' '}
                  <strong>{selectedAdjustment.providerName}</strong> pour la mission{' '}
                  <strong>{selectedAdjustment.serviceName}</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reject-reason">Raison du refus (obligatoire)</Label>
                <Textarea
                  id="reject-reason"
                  placeholder="Expliquez pourquoi vous refusez cet ajustement..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {rejectReason.length}/10 caractères minimum requis
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => selectedAdjustment && handleReject(selectedAdjustment)}
                  className="flex-1"
                >
                  Confirmer le refus
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PriceAdjustmentNotification;
