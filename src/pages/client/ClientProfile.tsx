import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft, Upload, Save, Camera, User } from "lucide-react";
import {
  updateEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from "@/firebaseConfig";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const ClientProfile = () => {
  const { user, logout, changeAvatar } = useAuth();
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      changeAvatar(user.id, avatarFile);
    }
  };


  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser
    await updateProfile(user, { displayName: profileData.name })
    await updateEmail(user, profileData.email)
    navigate("/client/dashboard")
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/logo.png" 
                alt="GreenGo France" 
                className="h-28 w-auto" 
              />
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link to="/client/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mon profil client</CardTitle>
              <CardDescription>
                Gérez vos informations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Photo de profil (optionnel)</Label>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24 flex flex-col items-center justify-center space-y-2 rounded-full border border-[rgb(223, 223, 223)]">
                      <AvatarImage src={avatarPreview || ""} />
                      <AvatarFallback className="text-lg">
                        {user.name ? user.name.substring(0, 2).toUpperCase() : <Camera className="h-8 w-8" />}
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
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/client/dashboard')}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
