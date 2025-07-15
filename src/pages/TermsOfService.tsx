
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
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
                className="h-32 w-auto" 
              />
            </Link>
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-600">
                CONDITIONS GÉNÉRALES D'UTILISATION (CGU) - ATOI
              </CardTitle>
              <p className="text-sm text-gray-500">Dernière mise à jour : 16 juin 2025</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chapitre 1 */}
              <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h2 className="text-2xl font-bold text-blue-700 mb-4">CHAPITRE 1 – OBJET</h2>
                <p className="text-gray-700 leading-relaxed">
                  Les présentes Conditions Générales d’Utilisation (CGU) ont pour objet de définir les conditions d’accès et d’utilisation de la plateforme ATOI, permettant la mise en relation entre des utilisateurs et des prestataires de services dans les domaines suivants : Jardinage, Bricolage, Montage de meubles, Nettoyage écologique et Petits travaux
                </p>
              </section>

              {/* Chapitre 2 */}
              <section className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h2 className="text-2xl font-bold text-purple-700 mb-4">CHAPITRE 2 – ACCEPTATION DES CGU</h2>
                <p className="text-gray-700 leading-relaxed">
                 L’utilisation de la plateforme ATOI implique l’acceptation sans réserve des présentes CGU par l’utilisateur.
                </p>
              </section>

              {/* Autres chapitres */}
              <section className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h2 className="text-2xl font-bold text-green-700 mb-4">CHAPITRE 3 – ACCÈS AU SERVICE</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  L’accès à la plateforme nécessite une connexion internet. Certains services requièrent la création d’un compte utilisateur avec des informations personnelles exactes et à jour.
                </p>
              </section>

              <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">CHAPITRE 4 – FONCTIONNEMENT DU SERVICE</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  La plateforme ATOI permet de :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Poster une demande de service</li>
                  <li>Recevoir des propositions de prestataires</li>
                  <li>Réserver, payer et évaluer les prestations ATOI n’est pas partie aux contrats conclus entre utilisateurs et prestataires.</li>
                </ul>
              </section>

              <section className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h2 className="text-2xl font-bold text-orange-700 mb-4">CHAPITRE 5 – OBLIGATIONS DES UTILISATEURS</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Les utilisateurs s’engagent à :
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>Fournir des informations exactes</li>
                  <li>Respecter les lois en vigueur</li>
                  <li>Ne pas porter atteinte aux droits des tiers</li>
                  <li>Ne pas utiliser la plateforme à des fins frauduleuses</li>
                </ol>
              </section>

              <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-300">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">CHAPITRE 6 – OBLIGATIONS DES PRESTATAIRES</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Les prestataires s’engagent à :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Fournir des prestations de qualité</li>
                  <li>Respecter les délais et les engagements pris</li>
                  <li>Détenir toutes les autorisations nécessaires à l'exercice de leur activité</li>
                </ul>
              </section>

              <section className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h2 className="text-2xl font-bold text-red-700 mb-4">CHAPITRE 7 – RÉSERVATION ET PAIEMENT</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Les paiements s’effectuent via un module sécurisé. ATOI peut prélever une commission sur les prestations réservées via la plateforme.
                </p>
              </section>

              <section className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                <h2 className="text-2xl font-bold text-pink-700 mb-4">CHAPITRE 8 – ANNULATION ET REMBOURSEMENT</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Les conditions d’annulation et de remboursement sont précisées dans chaque offre de prestation. En cas de litige, ATOI tentera de faciliter une solution amiable.
                </p>
              </section>

              <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">CHAPITRE 9 – RESPONSABILITÉS</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  ATOI agit en tant qu’intermédiaire et ne saurait être tenu responsable de l’exécution des prestations. Chaque utilisateur ou prestataire est responsable de ses actes sur la plateforme.
                </p>
              </section>

              <section className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">CHAPITRE 10 – DONNÉES PERSONNELLES</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Les données des utilisateurs sont traitées conformément à la réglementation en vigueur (RGPD). L’utilisateur peut accéder, rectifier ou supprimer ses données personnelles à tout moment.
                </p>
              </section>

              <section className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <h2 className="text-2xl font-bold text-cyan-700 mb-4">CHAPITRE 11 – PROPRIÉTÉ INTELLECTUELLE</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Tous les contenus présents sur la plateforme (textes, images, logos, etc.) sont protégés par des droits de propriété intellectuelle. Toute reproduction est interdite sans autorisation écrite.
                </p>
              </section>

              <section className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h2 className="text-2xl font-bold text-amber-700 mb-4">CHAPITRE 12 – SÉCURITÉ</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  ATOI met en œuvre des moyens techniques pour assurer la sécurité de la plateforme, mais ne peut garantir l'absence totale de failles.
                </p>
              </section>

              <section className="bg-lime-50 p-6 rounded-lg border border-lime-200">
                <h2 className="text-2xl font-bold text-lime-700 mb-4">CHAPITRE 13 – SUSPENSION ET SUPPRESSION DE COMPTE</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  ATOI se réserve le droit de suspendre ou supprimer un compte utilisateur en cas de non-respect des présentes CGU.
                </p>
              </section>

              <section className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                <h2 className="text-2xl font-bold text-emerald-700 mb-4">CHAPITRE 14 – MODIFICATION DES CGU</h2>
                 <p className="text-gray-700 leading-relaxed mb-3">
                  Les CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés des changements via la plateforme ou par email.
                </p>
              </section>

              <section className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">CHAPITRE 15 – LITIGES ET DROIT APPLICABLE</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  En cas de litige, une solution amiable sera recherchée. À défaut, les tribunaux compétents seront ceux du siège social de ATOI. Le droit applicable est le droit français.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
