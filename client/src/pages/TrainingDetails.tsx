import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trainingPhases } from '@/data/trainingPlan';
import { Calendar, BookOpen, Edit2, Check, X, Link2, Image, Play } from 'lucide-react';

interface ExerciseMedia {
  exerciseId: string;
  videoUrl?: string;
  photoUrl?: string;
}

export default function TrainingDetails() {
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [media, setMedia] = useState<Record<string, ExerciseMedia>>({});
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ videoUrl: '', photoUrl: '' });

  // Cargar media desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem('bombero_exercise_media');
    if (stored) {
      setMedia(JSON.parse(stored));
    }
  }, []);

  // Guardar media en localStorage
  const saveMedia = (exerciseId: string, videoUrl: string, photoUrl: string) => {
    const updated = {
      ...media,
      [exerciseId]: { exerciseId, videoUrl, photoUrl },
    };
    setMedia(updated);
    localStorage.setItem('bombero_exercise_media', JSON.stringify(updated));
    setEditingExercise(null);
  };

  const phase = trainingPhases[selectedPhase];
  const day = phase.days[selectedDay];
  const exerciseMedia = media[`${selectedPhase}-${selectedDay}`] || {};

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'warmup':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'strength':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'cardio':
        return 'bg-green-500/10 border-green-500/30';
      case 'cooldown':
        return 'bg-purple-500/10 border-purple-500/30';
      case 'special':
        return 'bg-orange-500/10 border-orange-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'warmup':
        return '🔥';
      case 'strength':
        return '💪';
      case 'cardio':
        return '🏃';
      case 'cooldown':
        return '🧘';
      case 'special':
        return '⚡';
      default:
        return '•';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Entrenamientos Detallados</h1>
            </div>
            <div className="flex gap-2">
              <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                🏠 Inicio
              </a>
              <a href="/weekly-plan" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                📅 Plan Semanal
              </a>
            </div>
          </div>
          <p className="text-muted-foreground">Todos los ejercicios con vídeos, fotos y progresiones</p>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Phase & Day Selector */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phase Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {trainingPhases.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPhase(idx);
                      setSelectedDay(0);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedPhase === idx
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border border-border hover:border-primary'
                    }`}
                  >
                    <div className="font-bold">{p.name}</div>
                    <div className="text-xs opacity-75">Semanas {p.weeks}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Day Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Día</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {phase.days.map((d, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedDay === idx
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border border-border hover:border-primary'
                    }`}
                  >
                    <div className="font-bold">{d.name}</div>
                    <div className="text-xs opacity-75">{d.focus}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Exercises */}
          <div className="lg:col-span-3 space-y-6">
            {/* Day Header */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{day.name}</CardTitle>
                    <CardDescription>{day.focus}</CardDescription>
                  </div>
                  <Badge className="text-lg px-4 py-2">{phase.name}</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Exercises by Type */}
            {day.blocks.map((block, blockIdx) => (
              <Card key={blockIdx} className={`border ${getBlockColor(block.type)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{getBlockIcon(block.type)}</span>
                    {block.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {block.exercises.map((exercise, exIdx) => {
                    const exerciseId = `${selectedPhase}-${selectedDay}-${blockIdx}-${exIdx}`;
                    const exerciseData = media[exerciseId] || {};
                    const isEditing = editingExercise === exerciseId;

                    return (
                      <div key={exIdx} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                        {/* Exercise Title & Description */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-foreground">{exercise.name}</h3>
                          {exercise.detail && (
                            <p className="text-sm text-muted-foreground mt-2">{exercise.detail}</p>
                          )}
                        </div>

                        {/* Exercise Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {exercise.sets && (
                            <div className="bg-background/50 rounded-lg p-3">
                              <div className="text-xs text-muted-foreground">Series</div>
                              <div className="text-lg font-bold text-primary">{exercise.sets}</div>
                            </div>
                          )}
                          {exercise.reps && (
                            <div className="bg-background/50 rounded-lg p-3">
                              <div className="text-xs text-muted-foreground">Repeticiones</div>
                              <div className="text-lg font-bold text-primary">{exercise.reps}</div>
                            </div>
                          )}
                          {exercise.duration && (
                            <div className="bg-background/50 rounded-lg p-3">
                              <div className="text-xs text-muted-foreground">Duración</div>
                              <div className="text-lg font-bold text-primary">{exercise.duration}</div>
                            </div>
                          )}

                        </div>

                        {/* Media Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Video */}
                          <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Play className="w-4 h-4 text-primary" />
                              <span className="font-bold text-sm">Vídeo</span>
                            </div>
                            {exerciseData.videoUrl && !isEditing ? (
                              <div className="space-y-3">
                                <div className="aspect-video bg-background rounded-lg overflow-hidden">
                                  <iframe
                                    width="100%"
                                    height="100%"
                                    src={exerciseData.videoUrl.replace('watch?v=', 'embed/')}
                                    title={exercise.name}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    setEditingExercise(exerciseId);
                                    setEditForm({
                                      videoUrl: exerciseData.videoUrl || '',
                                      photoUrl: exerciseData.photoUrl || '',
                                    });
                                  }}
                                  className="w-full px-3 py-2 text-sm bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary"
                                >
                                  <Edit2 className="w-3 h-3 inline mr-2" />
                                  Editar
                                </button>
                              </div>
                            ) : isEditing ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  placeholder="Enlace de YouTube (ej: https://www.youtube.com/watch?v=...)"
                                  value={editForm.videoUrl}
                                  onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg bg-background border border-primary text-foreground text-sm"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => saveMedia(exerciseId, editForm.videoUrl, editForm.photoUrl)}
                                    className="flex-1 px-3 py-2 text-sm bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-green-500"
                                  >
                                    <Check className="w-3 h-3 inline mr-2" />
                                    Guardar
                                  </button>
                                  <button
                                    onClick={() => setEditingExercise(null)}
                                    className="flex-1 px-3 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-500"
                                  >
                                    <X className="w-3 h-3 inline mr-2" />
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingExercise(exerciseId);
                                  setEditForm({
                                    videoUrl: exerciseData.videoUrl || '',
                                    photoUrl: exerciseData.photoUrl || '',
                                  });
                                }}
                                className="w-full px-3 py-2 text-sm bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary"
                              >
                                <Link2 className="w-3 h-3 inline mr-2" />
                                Añadir vídeo
                              </button>
                            )}
                          </div>

                          {/* Photo */}
                          <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Image className="w-4 h-4 text-primary" />
                              <span className="font-bold text-sm">Foto</span>
                            </div>
                            {exerciseData.photoUrl && !isEditing ? (
                              <div className="space-y-3">
                                <div className="aspect-square bg-background rounded-lg overflow-hidden">
                                  <img
                                    src={exerciseData.photoUrl}
                                    alt={exercise.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    setEditingExercise(exerciseId);
                                    setEditForm({
                                      videoUrl: exerciseData.videoUrl || '',
                                      photoUrl: exerciseData.photoUrl || '',
                                    });
                                  }}
                                  className="w-full px-3 py-2 text-sm bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary"
                                >
                                  <Edit2 className="w-3 h-3 inline mr-2" />
                                  Editar
                                </button>
                              </div>
                            ) : isEditing ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  placeholder="Enlace de imagen (ej: https://...)"
                                  value={editForm.photoUrl}
                                  onChange={(e) => setEditForm({ ...editForm, photoUrl: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg bg-background border border-primary text-foreground text-sm"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => saveMedia(exerciseId, editForm.videoUrl, editForm.photoUrl)}
                                    className="flex-1 px-3 py-2 text-sm bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-green-500"
                                  >
                                    <Check className="w-3 h-3 inline mr-2" />
                                    Guardar
                                  </button>
                                  <button
                                    onClick={() => setEditingExercise(null)}
                                    className="flex-1 px-3 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-500"
                                  >
                                    <X className="w-3 h-3 inline mr-2" />
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingExercise(exerciseId);
                                  setEditForm({
                                    videoUrl: exerciseData.videoUrl || '',
                                    photoUrl: exerciseData.photoUrl || '',
                                  });
                                }}
                                className="w-full px-3 py-2 text-sm bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary"
                              >
                                <Link2 className="w-3 h-3 inline mr-2" />
                                Añadir foto
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Progression */}
                        {exercise.progression && (
                          <div className="bg-background/50 rounded-lg p-3 border border-border">
                            <div className="text-xs text-muted-foreground mb-1">Progresión</div>
                            <div className="text-sm text-foreground">{exercise.progression}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}


          </div>
        </div>
      </main>
    </div>
  );
}
