
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
                src="/lovable-uploads/93345a67-4688-418b-8793-ad045f122f8d.png" 
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
                CONDITIONS GÉNÉRALES DE SERVICE (CGS)
              </CardTitle>
              <p className="text-xl text-green-600 font-semibold">GREENGOFRANCE</p>
              <p className="text-sm text-gray-500">Dernière mise à jour : 16 juin 2025</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Préambule */}
              <section className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h2 className="text-2xl font-bold text-green-700 mb-4">PRÉAMBULE</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les présentes Conditions Générales de Service régissent les relations entre :
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>GreenGoFrance</strong>, plateforme numérique mettant en relation des prestataires indépendants pour des services de petits travaux (GreenGoFix) et de jardinage (GreenGoFrance), opérée par [Raison sociale, adresse, SIRET, etc.]
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Et tout <strong>Utilisateur</strong>, qu'il soit Client (demandeur de services) ou Prestataire (offreur de services).
                </p>
                <div className="bg-white p-4 rounded border-l-4 border-green-500">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    En accédant à la plateforme ou en utilisant ses services, vous acceptez l'ensemble des présentes CGS sans réserve.
                  </p>
                </div>
              </section>

              {/* Chapitre 1 */}
              <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h2 className="text-2xl font-bold text-blue-700 mb-4">CHAPITRE 1 – OBJET DU CONTRAT</h2>
                <p className="text-gray-700 leading-relaxed">
                  Ce contrat a pour objet de définir les conditions d'accès et d'utilisation des services proposés par la plateforme GreenGoFrance.
                </p>
              </section>

              {/* Chapitre 2 */}
              <section className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h2 className="text-2xl font-bold text-purple-700 mb-4">CHAPITRE 2 – DÉFINITIONS</h2>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded border">
                    <p className="text-gray-700"><strong>Plateforme :</strong> L'application mobile et le site web GreenGoFrance.</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-gray-700"><strong>Utilisateur :</strong> Toute personne utilisant la plateforme (Client ou Prestataire).</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-gray-700"><strong>Client :</strong> Personne physique ou morale demandant une prestation.</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-gray-700"><strong>Prestataire :</strong> Personne physique ou morale proposant ses services via la plateforme.</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-gray-700"><strong>Prestation :</strong> Intervention de jardinage ou de petits travaux à domicile.</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-gray-700"><strong>Compte :</strong> Espace personnel sécurisé pour utiliser les services.</p>
                  </div>
                </div>
              </section>

              {/* Autres chapitres */}
              <section className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h2 className="text-2xl font-bold text-green-700 mb-4">CHAPITRE 3 – CRÉATION DE COMPTE</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Chaque utilisateur doit créer un compte personnel en fournissant :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Nom, prénom, adresse email, mot de passe (et pièce d'identité pour les prestataires).</li>
                  <li>Acceptation des présentes CGS.</li>
                </ul>
              </section>

              <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">CHAPITRE 4 – ACCÈS AUX SERVICES</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>L'accès est gratuit, mais certaines fonctionnalités nécessitent d'être connecté.</li>
                  <li>Le Client peut faire une demande de service.</li>
                  <li>Le Prestataire peut accepter des missions dans sa zone géographique.</li>
                </ul>
              </section>

              <section className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h2 className="text-2xl font-bold text-orange-700 mb-4">CHAPITRE 5 – RÉSERVATION ET RÉALISATION</h2>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>Le Client choisit un service, une date, et valide la commande.</li>
                  <li>Un Prestataire est affecté automatiquement ou accepte manuellement.</li>
                  <li>La prestation est réalisée conformément à la description.</li>
                  <li>À la fin, le Client confirme la bonne exécution.</li>
                </ol>
              </section>

              <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-300">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">CHAPITRE 6 – TARIFS ET PAIEMENT</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Les prix sont affichés avant toute validation.</li>
                  <li>Le paiement se fait via la plateforme (CB ou autre).</li>
                  <li>Le Prestataire est payé après la prestation, déduction faite de la commission GreenGoFrance.</li>
                </ul>
              </section>

              <section className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h2 className="text-2xl font-bold text-red-700 mb-4">CHAPITRE 7 – OBLIGATIONS DES UTILISATEURS</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Côté Client :</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Fournir des informations exactes.</li>
                      <li>Payer les prestations commandées.</li>
                      <li>Être présent lors de l'intervention.</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Côté Prestataire :</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Réaliser les prestations avec sérieux.</li>
                      <li>Respecter les délais.</li>
                      <li>Utiliser du matériel conforme.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                <h2 className="text-2xl font-bold text-pink-700 mb-4">CHAPITRE 8 – ANNULATION ET REMBOURSEMENT</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Le Client peut annuler sans frais jusqu'à 2h avant la prestation.</li>
                  <li>Au-delà, un frais d'annulation peut s'appliquer.</li>
                  <li>En cas de non-présentation du Prestataire, remboursement intégral.</li>
                </ul>
              </section>

              <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">CHAPITRE 9 – RESPONSABILITÉS</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>GreenGoFrance est un intermédiaire et non le prestataire direct.</li>
                  <li>GreenGoFrance décline toute responsabilité en cas de dommage causé par le Prestataire ou le Client.</li>
                  <li>Un support est disponible pour régler les litiges.</li>
                </ul>
              </section>

              <section className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">CHAPITRE 10 – ASSURANCE ET GARANTIES</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Les Prestataires doivent être couverts par une assurance responsabilité civile.</li>
                  <li>GreenGoFrance peut proposer une assurance optionnelle complémentaire.</li>
                </ul>
              </section>

              <section className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <h2 className="text-2xl font-bold text-cyan-700 mb-4">CHAPITRE 11 – DONNÉES PERSONNELLES</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Les données sont traitées conformément au RGPD.</li>
                  <li>L'Utilisateur peut accéder, corriger ou supprimer ses données.</li>
                  <li>Aucune revente de données sans consentement.</li>
                </ul>
              </section>

              <section className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h2 className="text-2xl font-bold text-amber-700 mb-4">CHAPITRE 12 – MODÉRATION ET SUSPENSION</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>En cas de non-respect des règles, GreenGoFrance peut suspendre ou supprimer un compte.</li>
                  <li>Une procédure de contestation est prévue.</li>
                </ul>
              </section>

              <section className="bg-lime-50 p-6 rounded-lg border border-lime-200">
                <h2 className="text-2xl font-bold text-lime-700 mb-4">CHAPITRE 13 – PROPRIÉTÉ INTELLECTUELLE</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Tous les contenus de la plateforme sont protégés (logo, texte, design).</li>
                  <li>L'utilisateur n'a aucun droit de reproduction sans autorisation.</li>
                </ul>
              </section>

              <section className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                <h2 className="text-2xl font-bold text-emerald-700 mb-4">CHAPITRE 14 – MODIFICATION DES CGS</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Les CGS peuvent être modifiées à tout moment.</li>
                  <li>Les utilisateurs sont informés des changements.</li>
                </ul>
              </section>

              <section className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">CHAPITRE 15 – LITIGES ET DROIT APPLICABLE</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>En cas de litige, une solution amiable est recherchée.</li>
                  <li>À défaut, les tribunaux compétents sont ceux du siège social de GreenGoFrance.</li>
                  <li>Droit applicable : droit français.</li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
