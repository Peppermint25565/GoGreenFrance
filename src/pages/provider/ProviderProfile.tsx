
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft, Upload, Save } from "lucide-react";

const ProviderProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    specializations: ['jardinage'],
    zone: '',
    hourlyRate: '',
    description: '',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    }
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    // Here would be the API call to update the profile
  };

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    if (checked) {
      setProfileData({
        ...profileData,
        specializations: [...profileData.specializations, specialization]
      });
    } else {
      setProfileData({
        ...profileData,
        specializations: profileData.specializations.filter(s => s !== specialization)
      });
    }
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    setProfileData({
      ...profileData,
      availability: {
        ...profileData.availability,
        [day]: checked
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/93345a67-4688-418b-8793-ad045f122f8d.png" 
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
            <Link to="/provider/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mon profil prestataire</CardTitle>
              <CardDescription>
                Gérez vos informations et préférences professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourlyRate">Tarif horaire (€)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={profileData.hourlyRate}
                      onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                      placeholder="25"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address">Adresse complète</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    placeholder="123 Rue de la République, 75001 Paris"
                  />
                </div>

                {/* Zone */}
                <div>
                  <Label htmlFor="zone">Zone d'intervention</Label>
                  <Input
                    id="zone"
                    value={profileData.zone}
                    onChange={(e) => setProfileData({ ...profileData, zone: e.target.value })}
                    placeholder="Paris et petite couronne"
                  />
                </div>

                {/* Specializations */}
                <div>
                  <Label className="text-base font-medium">Spécialisations</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="jardinage"
                        checked={profileData.specializations.includes('jardinage')}
                        onCheckedChange={(checked) => handleSpecializationChange('jardinage', checked as boolean)}
                      />
                      <Label htmlFor="jardinage">Jardinage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bricolage"
                        checked={profileData.specializations.includes('bricolage')}
                        onCheckedChange={(checked) => handleSpecializationChange('bricolage', checked as boolean)}
                      />
                      <Label htmlFor="bricolage">Bricolage</Label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description de vos services</Label>
                  <Textarea
                    id="description"
                    value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                    placeholder="Décrivez votre expérience, vos compétences particulières..."
                    rows={4}
                  />
                </div>

                {/* Availability */}
                <div>
                  <Label className="text-base font-medium">Disponibilités</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {Object.entries(profileData.availability).map(([day, available]) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={available}
                          onCheckedChange={(checked) => handleAvailabilityChange(day, checked as boolean)}
                        />
                        <Label htmlFor={day} className="capitalize">
                          {day === 'monday' && 'Lundi'}
                          {day === 'tuesday' && 'Mardi'}
                          {day === 'wednesday' && 'Mercredi'}
                          {day === 'thursday' && 'Jeudi'}
                          {day === 'friday' && 'Vendredi'}
                          {day === 'saturday' && 'Samedi'}
                          {day === 'sunday' && 'Dimanche'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents Upload */}
                <div>
                  <Label>Documents justificatifs</Label>
                  <div className="mt-2 space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Carte d'identité</p>
                      <Button type="button" variant="outline" size="sm" className="mt-2">
                        Choisir un fichier
                      </Button>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Attestation d'assurance</p>
                      <Button type="button" variant="outline" size="sm" className="mt-2">
                        Choisir un fichier
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/provider/dashboard')}>
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

export default ProviderProfile;
