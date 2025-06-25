
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Search, Filter } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  type: "client" | "prestataire";
  status: "actif" | "suspendu" | "en_attente";
  zone: string;
  registeredAt: string;
  missions: number;
  rating?: number;
}

const UserManagement = () => {
  const [filter, setFilter] = useState<"tous" | "client" | "prestataire">("tous");
  const [statusFilter, setStatusFilter] = useState<"tous" | "actif" | "suspendu" | "en_attente">("tous");

  const users: User[] = [
    {
      id: 1,
      name: "Marie Dupont",
      email: "marie@email.com",
      type: "client",
      status: "actif",
      zone: "Lyon",
      registeredAt: "2024-01-15",
      missions: 12,
    },
    {
      id: 2,
      name: "Pierre Martin",
      email: "pierre@email.com",
      type: "prestataire",
      status: "actif",
      zone: "Marseille",
      registeredAt: "2024-01-10",
      missions: 45,
      rating: 4.8,
    },
    {
      id: 3,
      name: "Sophie Durand",
      email: "sophie@email.com",
      type: "prestataire",
      status: "en_attente",
      zone: "Paris",
      registeredAt: "2024-01-18",
      missions: 0,
    },
  ];

  const filteredUsers = users.filter(user => {
    if (filter !== "tous" && user.type !== filter) return false;
    if (statusFilter !== "tous" && user.status !== statusFilter) return false;
    return true;
  });

  const handleUserAction = (userId: number, action: "approve" | "suspend" | "activate") => {
    console.log(`${action} user ${userId}`);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      actif: { variant: "default" as const, label: "actif" },
      suspendu: { variant: "destructive" as const, label: "suspendu" },
      en_attente: { variant: "secondary" as const, label: "en attente" }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { variant: "outline" as const, label: status };
    
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Gestion des Comptes
        </CardTitle>
        <CardDescription>
          Supervision et validation des comptes clients et prestataires
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === "tous" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("tous")}
            >
              Tous
            </Button>
            <Button
              variant={filter === "client" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("client")}
            >
              Clients
            </Button>
            <Button
              variant={filter === "prestataire" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("prestataire")}
            >
              Prestataires
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "tous" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("tous")}
            >
              Tous statuts
            </Button>
            <Button
              variant={statusFilter === "en_attente" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("en_attente")}
            >
              En attente
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Missions</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {user.type}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{user.zone}</TableCell>
                <TableCell>{user.missions}</TableCell>
                <TableCell>
                  {user.rating ? `${user.rating}/5` : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {user.status === "en_attente" && (
                      <Button
                        size="sm"
                        onClick={() => handleUserAction(user.id, "approve")}
                      >
                        Valider
                      </Button>
                    )}
                    {user.status === "actif" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(user.id, "suspend")}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    )}
                    {user.status === "suspendu" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(user.id, "activate")}
                      >
                        <UserCheck className="h-4 w-4" />
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

export default UserManagement;
