import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, MapPin, Clock, Euro } from "lucide-react";

interface Mission {
  id: number;
  service: string;
  client: string;
  prestataire: string;
  zone: string;
  status: "en_cours" | "terminee" | "planifiee" | "annulee";
  montant: number;
  commission: number;
  dateDebut: string;
  dateFin?: string;
}

const MissionTracking = () => {
  const missions: Mission[] = [
    {
      id: 1,
      service: "Tonte de pelouse",
      client: "Marie D.",
      prestataire: "Pierre M.",
      zone: "Lyon 3e",
      status: "en_cours",
      montant: 65,
      commission: 6.5,
      dateDebut: "2024-01-18 09:00",
    },
    {
      id: 2,
      service: "Élagage arbres",
      client: "Jean L.",
      prestataire: "Sophie D.",
      zone: "Marseille 8e",
      status: "planifiee",
      montant: 120,
      commission: 12,
      dateDebut: "2024-01-19 14:00",
    },
    {
      id: 3,
      service: "Ramassage déchets verts",
      client: "Paul R.",
      prestataire: "Marc T.",
      zone: "Paris 15e",
      status: "terminee",
      montant: 45,
      commission: 4.5,
      dateDebut: "2024-01-17 10:00",
      dateFin: "2024-01-17 12:30",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      en_cours: { variant: "default" as const, label: "En cours" },
      terminee: { variant: "secondary" as const, label: "Terminée" },
      planifiee: { variant: "outline" as const, label: "Planifiée" },
      annulee: { variant: "destructive" as const, label: "Annulée" }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { variant: "outline" as const, label: status };
    
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Suivi des Missions en Temps Réel
        </CardTitle>
        <CardDescription>
          Surveillance en direct de toutes les missions en cours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Prestataire</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Horaires</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">{mission.service}</TableCell>
                <TableCell>{mission.client}</TableCell>
                <TableCell>{mission.prestataire}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {mission.zone}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(mission.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    {mission.montant}€
                  </div>
                </TableCell>
                <TableCell className="text-green-600">
                  {mission.commission}€
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Début: {mission.dateDebut}
                    </div>
                    {mission.dateFin && (
                      <div>Fin: {mission.dateFin}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    Voir détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MissionTracking;
