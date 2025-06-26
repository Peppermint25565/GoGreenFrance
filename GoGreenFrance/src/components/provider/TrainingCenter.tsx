
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, CheckCircle, Clock, Award, BookOpen } from "lucide-react";

interface Training {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  completed: boolean;
  category: "jardinage" | "bricolage" | "securite";
  videos: number;
  quizzes: number;
}

const TrainingCenter = () => {
  const [trainings] = useState<Training[]>([
    {
      id: "1",
      title: "Sécurité sur les chantiers",
      description: "Formation obligatoire sur les règles de sécurité",
      duration: "2h30",
      progress: 100,
      completed: true,
      category: "securite",
      videos: 8,
      quizzes: 3
    },
    {
      id: "2",
      title: "Techniques de jardinage écologique",
      description: "Méthodes respectueuses de l'environnement",
      duration: "3h15",
      progress: 65,
      completed: false,
      category: "jardinage",
      videos: 12,
      quizzes: 4
    },
    {
      id: "3",
      title: "Outils de bricolage avancés",
      description: "Utilisation professionnelle des outils",
      duration: "1h45",
      progress: 0,
      completed: false,
      category: "bricolage",
      videos: 6,
      quizzes: 2
    }
  ]);

  const [currentModule, setCurrentModule] = useState<string | null>(null);

  const totalProgress = Math.round(
    trainings.reduce((acc, training) => acc + training.progress, 0) / trainings.length
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "jardinage":
        return "bg-green-100 text-green-800";
      case "bricolage":
        return "bg-blue-100 text-blue-800";
      case "securite":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Progression globale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Centre de Formation
          </CardTitle>
          <CardDescription>
            Développez vos compétences et restez à jour
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Progression globale</span>
              <span className="text-sm text-gray-600">{totalProgress}%</span>
            </div>
            <Progress value={totalProgress} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {trainings.filter(t => t.completed).length}
                </div>
                <div className="text-sm text-gray-600">Complétées</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {trainings.filter(t => t.progress > 0 && !t.completed).length}
                </div>
                <div className="text-sm text-gray-600">En cours</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {trainings.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des formations */}
      <div className="grid gap-4">
        {trainings.map((training) => (
          <Card key={training.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{training.title}</h3>
                    <Badge className={getCategoryColor(training.category)}>
                      {training.category}
                    </Badge>
                    {training.completed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complétée
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{training.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {training.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" />
                      {training.videos} vidéos
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      {training.quizzes} quiz
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Progression</span>
                    <div className="text-lg font-semibold">{training.progress}%</div>
                  </div>
                  <Button 
                    variant={training.progress > 0 ? "default" : "outline"}
                    onClick={() => setCurrentModule(training.id)}
                  >
                    {training.progress > 0 ? "Continuer" : "Commencer"}
                  </Button>
                </div>
              </div>
              
              {training.progress > 0 && (
                <div className="space-y-2">
                  <Progress value={training.progress} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {training.progress}% complété
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module de formation (simulé) */}
      {currentModule && (
        <Card>
          <CardHeader>
            <CardTitle>Module en cours</CardTitle>
            <CardDescription>
              Formation interactive avec vidéos et quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <PlayCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Vidéo de formation</p>
                <p className="text-sm text-gray-500">Cliquez pour démarrer</p>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentModule(null)}>
                Fermer
              </Button>
              <Button>
                Marquer comme vu
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainingCenter;
