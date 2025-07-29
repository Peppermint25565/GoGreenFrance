
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, AlertCircle, Clock } from "lucide-react";
import { KycStatus, UserProvider } from "@/contexts/AuthContext";
import { uploadKyc } from "@/supabase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface KYCStep {
  id: string;
  title: string;
  description: string;
}

const KYCVerification = ({ user, handleSubmitFile, handleUploadFile }: { user: UserProvider, handleSubmitFile:  (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>; handleUploadFile: (event: React.ChangeEvent<HTMLInputElement>, step: any) => void }) => {
  const kycKeys = Object.keys(user.kyc);
  let kycValue = Object.values(user.kyc);
  let completedSteps = 0;
  kycKeys.forEach((k) => {completedSteps += user.kyc[k].status == 'verified' ? 1 : 0})
  const progressPercentage = (completedSteps / kycKeys.length) * 100;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Validé</Badge>;
      case "in_review":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En cours</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_review':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Upload className="h-5 w-5 text-gray-400" />;
    }
  };

  const kycSteps: KYCStep[] = [
    {
      id: "identity",
      title: "Pièce d'identité",
      description: "Carte d'identité ou passeport",
    },
    {
      id: "address",
      title: "Justificatif de domicile",
      description: "Facture de moins de 3 mois",
    },
    {
      id: "insurance",
      title: "Assurance responsabilité civile",
      description: "Attestation d'assurance professionnelle",
    },
    {
      id: "bank",
      title: "RIB",
      description: "Relevé d'identité bancaire pour les paiements",
    }
  ];

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
            <span>{completedSteps}/{kycKeys.length} étapes</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {kycValue.map((step, i) => {return (
          <div key={kycKeys[i]} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(step.status)}
                <div>
                  <h4 className="font-medium">{kycSteps[i].title}</h4>
                  <p className="text-sm text-gray-600">{kycSteps[i].description}</p>
                </div>
              </div>
              {getStatusBadge(step.status)}
            </div>
            
            {step.status === 'not_started' && (
              <div className="space-y-3">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  {step.reason && <Label style={{color: "red"}}>{step.reason}</Label>}
                  <Label htmlFor={`file-${kycKeys[i]}`}>Télécharger le document</Label>
                  <Input id={`file-${kycKeys[i]}`} type="file" accept=".pdf" onChange={(e) => handleUploadFile(e, kycSteps[i])} />
                </div>
                <Button size="sm" onClick={(e) => handleSubmitFile(e)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            )}
          </div>
        )})}
        
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
