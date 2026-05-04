import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trainingPhases } from '@/data/trainingPlan';
import {
  generateWeeklyNutritionPlan,
  getMealRecommendationsForDay,
  generateWeeklySummary,
  classifyTrainingDays,
} from '@/lib/trainingNutritionSync';
import { Calendar, Zap, Droplet, AlertCircle, TrendingUp, Download } from 'lucide-react';
import { downloadWeeklyPlanPDF } from '@/lib/pdfExporter';

export default function WeeklyPlan() {
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const phase = trainingPhases[selectedPhase];
  const weeklyPlan = generateWeeklyNutritionPlan(selectedPhase + 1, selectedWeek);
  const weeklySummary = generateWeeklySummary(selectedPhase + 1);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'very-high':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'high':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      case 'moderate':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'light':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'rest':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getIntensityLabel = (intensity: string) => {
    switch (intensity) {
      case 'very-high':
        return '🔥 Muy Intenso';
      case 'high':
        return '💪 Intenso';
      case 'moderate':
        return '⚡ Moderado';
      case 'light':
        return '🟢 Ligero';
      case 'rest':
        return '😴 Descanso';
      default:
        return intensity;
    }
  };

  const getHydrationIcon = (level: string) => {
    switch (level) {
      case 'very-high':
        return '💧💧💧';
      case 'high':
        return '💧💧';
      default:
        return '💧';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Plan Semanal Sincronizado</h1>
            </div>
            <div className="flex gap-2">
              <a href="/progress-tracker" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                📈 Progreso
              </a>
              <a href="/menu-generator" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                🍽️ Menús
              </a>
              <a href="/" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                📊 Entrenamientos
              </a>
            </div>
          </div>
          <p className="text-muted-foreground">Entrenamientos + Nutrición optimizada para cada día</p>
        </div>
      </header>

      <main className="container py-8">
        {/* Phase & Week Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selecciona tu Fase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {trainingPhases.map((p, idx) => (
                <Button
                  key={p.id}
                  variant={selectedPhase === idx ? 'default' : 'outline'}
                  onClick={() => setSelectedPhase(idx)}
                  className="w-full justify-start text-left h-auto flex-col items-start p-3"
                >
                  <div className="font-bold text-sm">{p.name}</div>
                  <div className="text-xs opacity-70">{p.weeks}</div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Semana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(week => (
                  <Button
                    key={week}
                    variant={selectedWeek === week ? 'default' : 'outline'}
                    onClick={() => setSelectedWeek(week)}
                    size="sm"
                  >
                    S{week}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Summary */}
        <Card className="border-primary/20 bg-primary/5 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Resumen de la Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <div className="text-xs text-muted-foreground mb-2">CALORÍAS TOTALES</div>
                <div className="text-2xl font-bold text-foreground">{weeklySummary.weeklyCalories}</div>
                <div className="text-xs text-muted-foreground mt-2">Promedio: {weeklySummary.dailyAverage}/día</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <div className="text-xs text-muted-foreground mb-2">PROTEÍNA</div>
                <div className="text-2xl font-bold text-red-400">{weeklySummary.weeklyProtein}g</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <div className="text-xs text-muted-foreground mb-2">CARBOHIDRATOS</div>
                <div className="text-2xl font-bold text-green-400">{weeklySummary.weeklyCarbs}g</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <div className="text-xs text-muted-foreground mb-2">GRASAS</div>
                <div className="text-2xl font-bold text-yellow-400">{weeklySummary.weeklyFat}g</div>
              </div>
            </div>

            <div className={`rounded-lg p-4 border ${weeklySummary.recommendation.includes('⚠️') ? 'bg-red-500/10 border-red-500/30' : weeklySummary.recommendation.includes('💪') ? 'bg-orange-500/10 border-orange-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
              <p className="text-sm font-semibold">{weeklySummary.recommendation}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div className="bg-background/50 rounded p-2 text-center">
                <div className="text-muted-foreground">🔥 Muy Intenso</div>
                <div className="font-bold text-red-400">{weeklySummary.intensityDistribution['very-high']}</div>
              </div>
              <div className="bg-background/50 rounded p-2 text-center">
                <div className="text-muted-foreground">💪 Intenso</div>
                <div className="font-bold text-orange-400">{weeklySummary.intensityDistribution.high}</div>
              </div>
              <div className="bg-background/50 rounded p-2 text-center">
                <div className="text-muted-foreground">⚡ Moderado</div>
                <div className="font-bold text-yellow-400">{weeklySummary.intensityDistribution.moderate}</div>
              </div>
              <div className="bg-background/50 rounded p-2 text-center">
                <div className="text-muted-foreground">🟢 Ligero</div>
                <div className="font-bold text-blue-400">{weeklySummary.intensityDistribution.light}</div>
              </div>
              <div className="bg-background/50 rounded p-2 text-center">
                <div className="text-muted-foreground">😴 Descanso</div>
                <div className="font-bold text-green-400">{weeklySummary.intensityDistribution.rest}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Plans */}
        <div className="space-y-6">
          {weeklyPlan.days.map((day, idx) => {
            const mealRecs = getMealRecommendationsForDay(selectedPhase + 1, day.dayName);

            return (
              <Card key={idx} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{day.dayName}</CardTitle>
                      <CardDescription className="text-base mt-1">{day.training.focus}</CardDescription>
                    </div>
                    <Badge className={`${getIntensityColor(day.training.intensity)} border`}>
                      {getIntensityLabel(day.training.intensity)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="nutrition" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="nutrition">Nutrición</TabsTrigger>
                      <TabsTrigger value="recommendations">Pre/Post</TabsTrigger>
                      <TabsTrigger value="hydration">Hidratación</TabsTrigger>
                    </TabsList>

                    {/* Nutrition Tab */}
                    <TabsContent value="nutrition" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1">CALORÍAS</div>
                          <div className="text-xl font-bold text-foreground">{day.recommendedKcal}</div>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1">PROTEÍNA</div>
                          <div className="text-xl font-bold text-red-400">{day.recommendedProtein}g</div>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1">CARBOS</div>
                          <div className="text-xl font-bold text-green-400">{day.recommendedCarbs}g</div>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1">GRASAS</div>
                          <div className="text-xl font-bold text-yellow-400">{day.recommendedFat}g</div>
                        </div>
                      </div>

                      <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                        <p className="text-sm text-muted-foreground">{mealRecs.notes}</p>
                      </div>
                    </TabsContent>

                    {/* Pre/Post Tab */}
                    <TabsContent value="recommendations" className="space-y-4 mt-4">
                      <div className="space-y-4">
                        <div className="border border-blue-500/30 rounded-lg p-4 bg-blue-500/10">
                          <h4 className="font-bold text-blue-400 mb-2">PRE-ENTRENO</h4>
                          <p className="text-sm text-muted-foreground mb-3">{mealRecs.preWorkout.recommendation}</p>
                          <div className="text-xs space-y-1">
                            <div>⏰ Timing: {mealRecs.preWorkout.timing}</div>
                            <div>🎯 Objetivo: {mealRecs.preWorkout.kcalTarget} kcal</div>
                            <div>
                              P: {mealRecs.preWorkout.proteinTarget}g | C: {mealRecs.preWorkout.carbsTarget}g
                            </div>
                          </div>
                        </div>

                        <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/10">
                          <h4 className="font-bold text-green-400 mb-2">POST-ENTRENO</h4>
                          <p className="text-sm text-muted-foreground mb-3">{mealRecs.postWorkout.recommendation}</p>
                          <div className="text-xs space-y-1">
                            <div>⏰ Timing: {mealRecs.postWorkout.timing}</div>
                            <div>🎯 Objetivo: {mealRecs.postWorkout.kcalTarget} kcal</div>
                            <div>
                              P: {mealRecs.postWorkout.proteinTarget}g | C: {mealRecs.postWorkout.carbsTarget}g
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Hydration Tab */}
                    <TabsContent value="hydration" className="space-y-4 mt-4">
                      <div className={`rounded-lg p-4 border ${mealRecs.hydration.level === 'very-high' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-cyan-500/10 border-cyan-500/30'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <Droplet className="w-5 h-5 text-blue-400" />
                          <h4 className="font-bold text-blue-400">
                            {getHydrationIcon(mealRecs.hydration.level)} Hidratación {mealRecs.hydration.level === 'very-high' ? 'MUY ALTA' : mealRecs.hydration.level === 'high' ? 'ALTA' : 'NORMAL'}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{mealRecs.hydration.recommendation}</p>
                        <div className="mt-3 text-xs space-y-1 text-muted-foreground">
                          <p>💡 Distribuye el agua a lo largo del día, no todo de una vez.</p>
                          <p>💡 Bebe 250-300ml cada 30-45 minutos durante entrenamientos intensos.</p>
                          {mealRecs.hydration.level === 'very-high' && (
                            <p>⚠️ Día muy exigente: lleva botella de agua al entrenamientos. Considera bebida isotónica.</p>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Export Section */}
        <Card className="border-primary/20 bg-primary/5 mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Exportar Plan Semanal
            </CardTitle>
            <CardDescription>Descarga el plan completo en PDF para imprimir o compartir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <h4 className="font-bold text-sm mb-2">Plan Básico</h4>
                <p className="text-xs text-muted-foreground mb-3">Entrenamientos + Nutrición + Pre/Post</p>
                <Button
                  onClick={() => downloadWeeklyPlanPDF({
                    phase: selectedPhase + 1,
                    week: selectedWeek,
                    includeShoppingList: false,
                    includeEquivalences: false,
                  })}
                  className="w-full"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
              
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <h4 className="font-bold text-sm mb-2">Plan Completo</h4>
                <p className="text-xs text-muted-foreground mb-3">+ Listas de compra + Equivalencias</p>
                <Button
                  onClick={() => downloadWeeklyPlanPDF({
                    phase: selectedPhase + 1,
                    week: selectedWeek,
                    includeShoppingList: true,
                    includeEquivalences: true,
                  })}
                  className="w-full"
                  size="sm"
                  variant="default"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF Completo
                </Button>
              </div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-muted-foreground">
              💡 El PDF está optimizado para imprimir. Usa "Imprimir a PDF" desde tu navegador para mayor control.
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/" className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors">
            <div className="font-bold text-sm mb-1">📋 Ver Entrenamientos</div>
            <div className="text-xs text-muted-foreground">Detalle de ejercicios por día</div>
          </a>
          <a href="/menu-generator" className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors">
            <div className="font-bold text-sm mb-1">🍽️ Generar Menú</div>
            <div className="text-xs text-muted-foreground">Crear menú personalizado</div>
          </a>
          <div className="p-4 rounded-lg border border-border/50 bg-primary/10">
            <div className="font-bold text-sm mb-1">✅ Sincronización Activa</div>
            <div className="text-xs text-muted-foreground">Entrenamientos + Nutrición integrados</div>
          </div>
        </div>
      </main>
    </div>
  );
}
