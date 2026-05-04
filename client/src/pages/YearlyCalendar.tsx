import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  yearlyTimeline,
  getPhaseInfo,
  getPhaseProgress,
  getNextMilestone,
  getCompletedMilestones,
  getDaysUntilOpposition,
  getTimelineSummary,
  getCurrentPhase,
  getCurrentWeek,
} from '@/data/yearlyCalendar';
import { Calendar, CheckCircle2, Target, AlertCircle, Trophy } from 'lucide-react';

export default function YearlyCalendar() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Cargar fecha de inicio
  useEffect(() => {
    const stored = localStorage.getItem('bombero_start_date');
    if (stored) {
      setStartDate(new Date(stored));
      const week = getCurrentWeek(new Date(stored));
      setCurrentWeek(Math.min(week, 96));
    }
  }, []);

  const handleSetStartDate = (date: Date) => {
    setStartDate(date);
    localStorage.setItem('bombero_start_date', date.toISOString());
    const week = getCurrentWeek(date);
    setCurrentWeek(Math.min(week, 96));
    setShowDatePicker(false);
  };

  const currentPhase = getCurrentPhase(currentWeek);
  const phaseInfo = getPhaseInfo(currentPhase);
  const nextMilestone = getNextMilestone(currentWeek);
  const completedMilestones = getCompletedMilestones(currentWeek);
  const daysRemaining = startDate ? getDaysUntilOpposition(startDate) : null;
  const summary = getTimelineSummary();

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'checkpoint':
        return '📍';
      case 'deload':
        return '😴';
      case 'test':
        return '🧪';
      case 'achievement':
        return '🏆';
      default:
        return '📌';
    }
  };

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'checkpoint':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'deload':
        return 'bg-green-500/10 border-green-500/30';
      case 'test':
        return 'bg-orange-500/10 border-orange-500/30';
      case 'achievement':
        return 'bg-purple-500/10 border-purple-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
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
              <h1 className="text-3xl font-bold text-foreground">Plan de 24 Meses</h1>
            </div>
            <div className="flex gap-2">
              <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                🏠 Inicio
              </a>
              <a href="/progress-tracker" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                📈 Progreso
              </a>
              <a href="/weekly-plan" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                📅 Plan Semanal
              </a>
            </div>
          </div>
          <p className="text-muted-foreground">Timeline completo: 4 fases, hitos clave y criterios de avance</p>
        </div>
      </header>

      <main className="container py-8">
        {/* Date Picker */}
        {!startDate && (
          <Card className="border-primary/20 bg-primary/5 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Establece tu fecha de inicio
              </CardTitle>
              <CardDescription>Para calcular tu progreso en el plan de 24 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <input
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleSetStartDate(new Date(e.target.value));
                    }
                  }}
                  className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-sm text-muted-foreground flex items-center">
                  La oposición será aproximadamente 24 meses después de esta fecha.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Overview */}
        {startDate && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Semana Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{currentWeek}</div>
                <div className="text-xs text-muted-foreground mt-1">de 96 semanas</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Fase Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{currentPhase}</div>
                <div className="text-xs text-muted-foreground mt-1">{phaseInfo?.name.split('—')[0].trim()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Progreso Fase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{getPhaseProgress(currentPhase, currentWeek)}%</div>
                <div className="w-full bg-background rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${getPhaseProgress(currentPhase, currentWeek)}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Días Restantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{daysRemaining}</div>
                <div className="text-xs text-muted-foreground mt-1">hasta oposición</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="phases">Fases</TabsTrigger>
            <TabsTrigger value="milestones">Hitos</TabsTrigger>
            <TabsTrigger value="criteria">Criterios</TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timeline de 24 Meses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {yearlyTimeline.map((phase, idx) => {
                    const progress = startDate ? getPhaseProgress(phase.phase, currentWeek) : 0;
                    const isCurrentPhase = phase.phase === currentPhase;

                    return (
                      <div key={phase.phase} className={`border-l-4 pl-6 pb-6 ${isCurrentPhase ? 'border-primary' : 'border-border'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className={`text-lg font-bold ${isCurrentPhase ? 'text-primary' : 'text-foreground'}`}>
                              {phase.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{phase.objective}</p>
                          </div>
                          <Badge variant={isCurrentPhase ? 'default' : 'secondary'}>
                            Semanas {phase.startWeek}-{phase.endWeek}
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-bold text-foreground">{progress}%</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${isCurrentPhase ? 'bg-primary' : 'bg-muted'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Phase Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="bg-background/50 rounded p-2">
                            <div className="text-muted-foreground text-xs">Volumen</div>
                            <div className="font-bold text-foreground">{phase.estimatedVolume}</div>
                          </div>
                          <div className="bg-background/50 rounded p-2">
                            <div className="text-muted-foreground text-xs">Calorías Diarias</div>
                            <div className="font-bold text-foreground">{phase.estimatedCalories}</div>
                          </div>
                          <div className="bg-background/50 rounded p-2">
                            <div className="text-muted-foreground text-xs">Semanas Descarga</div>
                            <div className="font-bold text-foreground">{phase.deloadWeeks.length}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phases Tab */}
          <TabsContent value="phases">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {yearlyTimeline.map(phase => (
                <Card key={phase.phase} className={phase.phase === currentPhase ? 'border-primary/50 bg-primary/5' : ''}>
                  <CardHeader>
                    <CardTitle className="text-lg">{phase.name}</CardTitle>
                    <CardDescription>Semanas {phase.startWeek}-{phase.endWeek}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-bold text-sm mb-2">Objetivo</h4>
                      <p className="text-sm text-muted-foreground">{phase.objective}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Áreas de Enfoque</h4>
                      <ul className="space-y-1">
                        {phase.focusAreas.map((area, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="text-primary">•</span>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-background/50 rounded p-2">
                        <div className="text-muted-foreground text-xs">Volumen</div>
                        <div className="font-bold">{phase.estimatedVolume}</div>
                      </div>
                      <div className="bg-background/50 rounded p-2">
                        <div className="text-muted-foreground text-xs">Calorías</div>
                        <div className="font-bold">{phase.estimatedCalories}</div>
                      </div>
                    </div>

                    {phase.phase === currentPhase && (
                      <Button className="w-full" asChild>
                        <a href="/weekly-plan">Ver Plan Semanal</a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <div className="space-y-6">
              {yearlyTimeline.map(phase => (
                <Card key={phase.phase}>
                  <CardHeader>
                    <CardTitle className="text-lg">{phase.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {phase.milestones.map(milestone => {
                        const isCompleted = startDate && currentWeek > milestone.week;
                        const isCurrent = startDate && currentWeek === milestone.week;

                        return (
                          <div
                            key={`${milestone.phase}-${milestone.week}`}
                            className={`border rounded-lg p-4 ${getMilestoneColor(milestone.type)} ${isCurrent ? 'ring-2 ring-primary' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{getMilestoneIcon(milestone.type)}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-foreground">{milestone.title}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    Semana {milestone.week}
                                  </Badge>
                                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                </div>
                                <p className="text-sm text-muted-foreground">{milestone.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Criteria Tab */}
          <TabsContent value="criteria">
            <div className="space-y-6">
              {yearlyTimeline.map(phase => (
                <Card key={phase.phase}>
                  <CardHeader>
                    <CardTitle className="text-lg">{phase.name}</CardTitle>
                    <CardDescription>Criterios para avanzar a la siguiente fase</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        Criterios Generales
                      </h4>
                      <ul className="space-y-2">
                        {phase.advancementCriteria.criteria.map((criterion, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">✓</span>
                            <span>{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-primary" />
                        Objetivos Mínimos
                      </h4>
                      <div className="space-y-2">
                        {phase.advancementCriteria.minimumRequirements.map((req, idx) => (
                          <div key={idx} className="bg-background/50 rounded p-3 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-foreground">{req.test}</span>
                              <span className="text-primary font-bold">
                                {req.value} {req.unit}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Next Milestone Alert */}
        {nextMilestone && (
          <Card className="border-primary/20 bg-primary/5 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Próximo Hito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="text-4xl">{getMilestoneIcon(nextMilestone.type)}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground">{nextMilestone.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{nextMilestone.description}</p>
                  <div className="mt-3 text-sm">
                    <Badge variant="secondary">
                      Semana {nextMilestone.week} ({nextMilestone.week - currentWeek} semanas restantes)
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
