import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, UserClient } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft, Upload, Save, Camera, User } from "lucide-react";
import {
  updateEmail,
  updateProfile,
  UserProfile,
} from 'firebase/auth';
import { auth, db } from "@/firebaseConfig";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getProfilePictureUrl, uploadProfilePictures } from "@/supabase";
import { setLogLevel } from "firebase/app";
import Loader from "@/components/loader/Loader";
import { doc, updateDoc } from "firebase/firestore";

const ClientProfile = () => {
  const { u, logout, updateUserData } = useAuth();
  const user: UserClient = u as UserClient
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar);
  const [loading, setLoading] = useState<boolean>(avatarPreview ? true : false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLoading(true);
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return null;
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const user = auth.currentUser
    await updateProfile(user, { displayName: profileData.name })
    await updateEmail(user, profileData.email)
    const url: string = await uploadProfilePictures(avatarFile, user.uid) as string;
    await updateDoc(doc(db, "profiles", user.uid), {avatar: url})
    await updateUserData()
    navigate("/client/dashboard")
  };

  return (
    <>
    {loading && (<Loader />)}
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/logo.png" 
                alt="Atoi" 
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
                      <AvatarImage onLoadingStatusChange={(s) => (s == "loaded" ? setLoading(false) : null)} src={avatarPreview || ""} />
                      <AvatarFallback className="text-lg">
                        {user.name ? user.name.substring(0, 2).toUpperCase() : <Camera className="h-8 w-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAvatarChange(e)}
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
  </>);
};

export default ClientProfile;
