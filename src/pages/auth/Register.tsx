import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserProvider, UserRole } from "@/contexts/AuthContext";
import { User, Wrench, Upload, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";

const Register = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const type = Number(queryParameters.get("type"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<0 | 1 | 2>(type as UserRole);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [firstValidate, setFirstValidate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFirstValidate(true);
    if (!acceptTerms) {
      return;
    }

    setLoading(true);

    try {
      const user = await register(email, password, name, role, avatarFile);
      if (user.role == 0) {
        toast({
          title: "Bienvenue",
          description: "N'hesitez pas a crée votre premiere offre sur votre dashboard",
        });
        navigate("/client/dashboard");
      } else if (user.role == 1) {
        if (!(user as UserProvider)?.verified) {
          toast({
            title: "Bienvenue",
            description: "Dans un premier temps vous devrez etre verifier avant de pouvoir accepter des offres. Merci de vous rentre dans les sections Profile et Verifications pour configurer votre compte et uploder les justificatif necessaire",
          });
        }
        navigate("/provider/dashboard");
      } else if (user.role == 2) { 
        navigate("/admin/dashboard");
      }
    } catch (err) {
      let description = "Erreur inconnue.";
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            description = "Cet email est déjà utilisé.";
            break;
          case "auth/invalid-email":
            description = "Adresse email invalide.";
            break;
          case "auth/weak-password":
            description = "Mot de passe trop faible (≥ 6 caractères).";
            break;
          default:
            description = err.message;
        }
      }
      toast({
        title: "Erreur d'inscription",
        description,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img 
              src="/lovable-uploads/logo.png" 
              alt="Atoi" 
              className="h-32 w-auto" 
            />
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Inscription</CardTitle>
            <CardDescription>
              Créez votre compte Atoi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo de profil */}
              <div className="space-y-2">
                <Label>Photo de profil (optionnel)</Label>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage onLoadingStatusChange={(s) => (s == "loaded" ? setLoading(false) : null)} src={avatarPreview || ""} />
                    <AvatarFallback className="text-lg">
                      {name ? name.substring(0, 2).toUpperCase() : <Camera className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choisir une photo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Type de compte</Label>
                <RadioGroup value={role.toString()} onValueChange={(value) => setRole(Number(value) as UserRole)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="0" id="client" />
                    <User className="h-5 w-5 text-blue-500" />
                    <div>
                      <Label htmlFor="client" className="font-medium">Client</Label>
                      <p className="text-sm text-gray-500">Je cherche des prestataires</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="1" id="provider" />
                    <Wrench className="h-5 w-5 text-green-500" />
                    <div>
                      <Label htmlFor="provider" className="font-medium">Prestataire</Label>
                      <p className="text-sm text-gray-500">Je propose mes services</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Case à cocher obligatoire pour les CGS */}
              <div className="space-y-3">
                <div className={`flex items-start space-x-3 p-4 border rounded-lg ${(!acceptTerms && firstValidate) ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                  <Checkbox
                    id="accept-terms"
                    checked={acceptTerms && firstValidate}
                    onCheckedChange={(checked) => {setAcceptTerms(checked as boolean); setFirstValidate(checked as boolean)}}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="accept-terms" className="text-sm font-medium cursor-pointer">
                      J'accepte les{" "}
                      <Link 
                        to="/terms-of-service" 
                        target="_blank"
                        className="text-green-600 hover:text-green-800 underline"
                      >
                        Conditions Générales de Service (CGS)
                      </Link>
                      {" "}de Atoi <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      En cochant cette case, vous confirmez avoir lu et accepté nos conditions d'utilisation.
                    </p>
                  </div>
                </div>
                {(!acceptTerms && firstValidate) && (
                  <p className="text-xs text-red-600">
                    L'acceptation des CGS est obligatoire pour créer un compte.
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
              >
                {loading ? "Création..." : "Créer mon compte"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{" "}
                <Link to="/login" className="text-green-600 hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
