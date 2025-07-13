
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, AlertCircle, Clock } from "lucide-react";

interface KYCStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "rejected" | "in_review";
  doesNeedFileInput: boolean;
  required: boolean;
}

const KYCVerification = () => {
  const [kycSteps, setKycSteps] = useState<KYCStep[]>([
    {
      id: "identity",
      title: "Pièce d'identité",
      description: "Carte d'identité ou passeport",
      doesNeedFileInput: true,
      status: "in_review",
      required: true
    },
    {
      id: "address",
      title: "Justificatif de domicile",
      description: "Facture de moins de 3 mois",
      doesNeedFileInput: true,
      status: "pending",
      required: true
    },
    {
      id: "insurance",
      title: "Assurance responsabilité civile",
      description: "Attestation d'assurance professionnelle",
      doesNeedFileInput: true,
      status: "pending",
      required: true
    },
    {
      id: "bank",
      title: "RIB",
      description: "Relevé d'identité bancaire pour les paiements",
      doesNeedFileInput: true,
      status: "pending",
      required: true
    }
  ]);

  const completedSteps = kycSteps.filter(step => step.status === "completed").length;
  const progressPercentage = (completedSteps / kycSteps.length) * 100;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Validé</Badge>;
      case "in_review":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En cours</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in_review":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Upload className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vérification KYC</CardTitle>
        <CardDescription>
          Complétez votre vérification pour accéder à toutes les fonctionnalités
        </CardDescription>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>{completedSteps}/{kycSteps.length} étapes</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {kycSteps.map((step) => (
          <div key={step.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(step.status)}
                <div>
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
              {getStatusBadge(step.status)}
            </div>
            
            {step.status === "pending" && step.doesNeedFileInput && (
              <div className="space-y-3">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor={`file-${step.id}`}>Télécharger le document</Label>
                  <Input id={`file-${step.id}`} type="file" accept="image/*,.pdf" />
                </div>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            )}
            
            {step.status === "rejected" && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mt-3">
                <p className="text-sm text-red-800">
                  Document rejeté. Veuillez télécharger un nouveau document conforme.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Retélécharger
                </Button>
              </div>
            )}
          </div>
        ))}
        
        {progressPercentage === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-green-800">Vérification complète !</h3>
            <p className="text-sm text-green-600">Votre compte est maintenant vérifié</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KYCVerification;
