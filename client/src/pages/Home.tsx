import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trainingPhases, dietPhases, progressionMilestones } from '@/data/trainingPlan';
import { Flame, Calendar, Utensils, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedDietPhase, setSelectedDietPhase] = useState(0);

  const phase = trainingPhases[selectedPhase];
  const day = phase.days[selectedDay];
  const dietPhase = dietPhases[selectedDietPhase];

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
              <Flame className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Plan Bombero CM</h1>
            </div>
            <div className="flex gap-2">
              <a href="/progress-tracker" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                📈 Progreso
              </a>
              <a href="/weekly-plan" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                📅 Plan
              </a>
              <a href="/menu-generator" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                🍽️ Menús
              </a>
            </div>
          </div>
          <p className="text-muted-foreground">Entrenamiento interactivo para oposición — 24 meses de periodización avanzada</p>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="training" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="training">Entrenamiento</TabsTrigger>
            <TabsTrigger value="diet">Nutrición</TabsTrigger>
            <TabsTrigger value="progress">Progresión</TabsTrigger>
            <TabsTrigger value="rules">Reglas</TabsTrigger>
          </TabsList>

          {/* TRAINING TAB */}
          <TabsContent value="training" className="space-y-6">
            {/* Phase Selector */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Selecciona tu Fase
                </CardTitle>
                <CardDescription>Elige la fase de entrenamiento actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {trainingPhases.map((p, idx) => (
                    <Button
                      key={p.id}
                      variant={selectedPhase === idx ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedPhase(idx);
                        setSelectedDay(0);
                      }}
                      className="h-auto flex-col items-start p-4"
                    >
                      <div className="font-bold text-sm">{p.name}</div>
                      <div className="text-xs opacity-70">{p.weeks}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Phase Info */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">{phase.name}</CardTitle>
                <CardDescription>{phase.weeks}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">OBJETIVO</h4>
                  <p className="text-foreground">{phase.objective}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">CRITERIO DE AVANCE</h4>
                  <p className="text-green-400">{phase.advanceCriteria}</p>
                </div>
              </CardContent>
            </Card>

            {/* Day Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selecciona el Día</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                  {phase.days.map((d, idx) => (
                    <Button
                      key={d.id}
                      variant={selectedDay === idx ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDay(idx)}
                      className="text-xs"
                    >
                      {d.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Training Day Details */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{day.name}</CardTitle>
                    <CardDescription className="text-base mt-2">{day.focus}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {day.blocks.map((block, blockIdx) => (
                  <div key={blockIdx} className={`border rounded-lg p-4 ${getBlockColor(block.type)}`}>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <span>{getBlockIcon(block.type)}</span>
                      {block.title}
                    </h3>
                    <div className="space-y-3">
                      {block.exercises.map((exercise, exIdx) => (
                        <div key={exIdx} className="bg-background/50 rounded p-3 border border-border/50">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{exercise.detail}</p>
                              {exercise.progression && (
                                <p className="text-xs text-green-400 mt-2">↑ {exercise.progression}</p>
                              )}
                            </div>
                            <div className="flex gap-2 flex-wrap justify-end">
                              {exercise.sets && (
                                <Badge variant="secondary" className="text-xs">
                                  {exercise.sets} series
                                </Badge>
                              )}
                              {exercise.reps && (
                                <Badge variant="secondary" className="text-xs">
                                  {exercise.reps} rep
                                </Badge>
                              )}
                              {exercise.duration && (
                                <Badge variant="secondary" className="text-xs">
                                  {exercise.duration}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DIET TAB */}
          <TabsContent value="diet" className="space-y-6">
            {/* Diet Phase Selector */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" />
                  Selecciona tu Fase Nutricional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {dietPhases.map((p, idx) => (
                    <Button
                      key={p.phase}
                      variant={selectedDietPhase === idx ? 'default' : 'outline'}
                      onClick={() => setSelectedDietPhase(idx)}
                      className="h-auto flex-col items-start p-4"
                    >
                      <div className="font-bold text-sm">{p.name}</div>
                      <div className="text-xs opacity-70">{p.weeks}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Diet Phase Info */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>{dietPhase.name}</CardTitle>
                <CardDescription>{dietPhase.weeks}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">{dietPhase.description}</p>
                <div className="bg-background/50 rounded p-3 border border-primary/30">
                  <p className="text-sm text-muted-foreground">{dietPhase.note}</p>
                </div>
              </CardContent>
            </Card>

            {/* Macronutrient Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Objetivos de Macronutrientes Diarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">{dietPhase.macros.kcal}</div>
                    <div className="text-xs text-muted-foreground mt-1">kcal/día</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-400">{dietPhase.macros.protein}g</div>
                    <div className="text-xs text-muted-foreground mt-1">Proteína</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{dietPhase.macros.carbs}g</div>
                    <div className="text-xs text-muted-foreground mt-1">Carbohidratos</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-400">{dietPhase.macros.fat}g</div>
                    <div className="text-xs text-muted-foreground mt-1">Grasas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Food Equivalences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tabla de Equivalencias (Intercambios Flexibles)</CardTitle>
                <CardDescription>Adapta la dieta a tu presupuesto y gustos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-background/50 rounded p-3 border border-border/50">
                    <h4 className="font-semibold text-sm mb-2">100g Pechuga Pollo</h4>
                    <p className="text-sm text-muted-foreground">100g Pavo = 120g Tofu = 1 lata grande de atún = 4 claras de huevo</p>
                  </div>
                  <div className="bg-background/50 rounded p-3 border border-border/50">
                    <h4 className="font-semibold text-sm mb-2">100g Arroz (crudo)</h4>
                    <p className="text-sm text-muted-foreground">100g Pasta = 400g Patata cocida = 100g Avena = 120g Pan integral = 120g Lentejas</p>
                  </div>
                  <div className="bg-background/50 rounded p-3 border border-border/50">
                    <h4 className="font-semibold text-sm mb-2">15ml Aceite Oliva</h4>
                    <p className="text-sm text-muted-foreground">15g Frutos secos = 1/3 Aguacate mediano = 15g Crema de cacahuete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROGRESS TAB */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Hitos de Progresión
                </CardTitle>
                <CardDescription>Marcas esperadas por mes para alcanzar nota 5</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressionMilestones.map((milestone, idx) => (
                    <div key={idx} className="border border-border rounded-lg p-4 bg-background/50">
                      <h3 className="font-bold text-lg mb-3 text-primary">Mes {milestone.month}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(milestone.metrics).map(([key, value]) => (
                          <div key={key} className="bg-card rounded p-2 border border-border/50">
                            <div className="text-xs text-muted-foreground capitalize mb-1">
                              {key.replace(/_/g, ' ')}
                            </div>
                            <div className="font-bold text-foreground">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RULES TAB */}
          <TabsContent value="rules" className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Reglas de Autorregulación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-400 mb-2">⚖️ Semanas de Descarga (Deload)</h4>
                  <p className="text-sm text-muted-foreground">
                    Cada 3 semanas de carga progresiva, la 4ª semana debes reducir el volumen de series un 40-50% y la intensidad de la carrera un 15%. Es obligatorio para asimilar el trabajo.
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-2">💪 Escala de Esfuerzo (RIR/RPE)</h4>
                  <p className="text-sm text-muted-foreground">
                    No vayas al fallo muscular en los entrenamientos de fuerza (excepto en los tests mensuales). Deja siempre 1-2 repeticiones en recámara (RIR 1-2).
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">📊 Ajuste por Fatiga</h4>
                  <p className="text-sm text-muted-foreground">
                    Si tu frecuencia cardíaca en reposo al despertar es &gt;10 lpm superior a tu media normal, o presentas dolor articular agudo (&gt;5/10), cambia la sesión del día por movilidad o descanso total.
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">🦵 Cuidado de Rodillas</h4>
                  <p className="text-sm text-muted-foreground">
                    Si notas molestias rotulianas, añade trabajo excéntrico (Nordic curls asistidos, extensiones inversas) al final de las sesiones de pierna para proteger el tendón en las frenadas de los 60m.
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-purple-400 mb-2">⚠️ Protocolo de Asma</h4>
                  <p className="text-sm text-muted-foreground">
                    Usa el inhalador de rescate 2 puffs, 15–20 min ANTES de comenzar cada calentamiento. Calentamiento MÍNIMO de 12 min, siempre gradual. Si notas opresión en el pecho, PARA inmediatamente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>Plan de 24 meses · Oposición Bombero Comunidad de Madrid</p>
          <p className="mt-2">Diseñado con criterio de alto rendimiento, prevención de lesiones y periodización avanzada</p>
        </div>
      </footer>
    </div>
  );
}
