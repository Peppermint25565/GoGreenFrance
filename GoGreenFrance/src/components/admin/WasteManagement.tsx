import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, MapPin, Calendar, Plus, Leaf } from "lucide-react";

interface WasteRoute {
  id: number;
  zone: string;
  date: string;
  status: "planifiee" | "en_cours" | "terminee";
  collectes: number;
  chauffeur: string;
  volume: string;
}

const WasteManagement = () => {
  const [routes, setRoutes] = useState<WasteRoute[]>([
    {
      id: 1,
      zone: "Lyon Centre",
      date: "2024-01-18",
      status: "en_cours",
      collectes: 12,
      chauffeur: "Marc Dupont",
      volume: "2.5 m³",
    },
    {
      id: 2,
      zone: "Marseille Nord",
      date: "2024-01-18",
      status: "planifiee",
      collectes: 8,
      chauffeur: "Sophie Martin",
      volume: "1.8 m³",
    },
    {
      id: 3,
      zone: "Paris 15e",
      date: "2024-01-17",
      status: "terminee",
      collectes: 15,
      chauffeur: "Pierre Durand",
      volume: "3.2 m³",
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      planifiee: { variant: "outline" as const, label: "Planifiée" },
      en_cours: { variant: "default" as const, label: "En cours" },
      terminee: { variant: "secondary" as const, label: "Terminée" }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { variant: "outline" as const, label: status };
    
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Gestion des Tournées Déchets Verts
        </CardTitle>
        <CardDescription>
          Organisation et suivi des collectes de déchets verts
        </CardDescription>
        <div className="flex gap-2 mt-4">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tournée
          </Button>
          <Button size="sm" variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Planifier
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Leaf className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Volume total collecté</p>
                  <p className="text-2xl font-bold">7.5 m³</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tournées actives</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Points de collecte</p>
                  <p className="text-2xl font-bold">35</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Collectes</TableHead>
              <TableHead>Chauffeur</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {route.zone}
                  </div>
                </TableCell>
                <TableCell>{route.date}</TableCell>
                <TableCell>{getStatusBadge(route.status)}</TableCell>
                <TableCell>{route.collectes} points</TableCell>
                <TableCell>{route.chauffeur}</TableCell>
                <TableCell>{route.volume}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Voir trajet
                    </Button>
                    {route.status === "planifiee" && (
                      <Button size="sm">
                        Démarrer
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WasteManagement;
