import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trainingPhases } from '@/data/trainingPlan';
import { yearlyTimeline } from '@/data/yearlyCalendar';
import { BookOpen, Edit2, Check, X, Link2, Image, Play, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface ExerciseMedia {
  exerciseId: string;
  videoUrl?: string;
  photoUrl?: string;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function getWeekProgressionValue(progression: string, relWeek: number): string | null {
  const parts = progression.split('·').map((s) => s.trim());
  for (const part of parts) {
    const m = part.match(/[Ss]em[\s.]*(\d+)\s*[–\-]\s*(\d+)\s*→\s*(.+)/);
    if (m) {
      const s = parseInt(m[1]);
      const e = parseInt(m[2]);
      if (relWeek >= s && relWeek <= e) return m[3].trim();
    }
  }
  return null;
}

function parseProgressionSteps(progression: string): Array<{ label: string; value: string }> {
  return progression
    .split('·')
    .map((s) => s.trim())
    .flatMap((part) => {
      const m = part.match(/([Ss]em[\s.]*\d+\s*[–\-]\s*\d+)\s*→\s*(.+)/);
      return m ? [{ label: m[1].replace(/^[Ss]em/, 'Sem'), value: m[2].trim() }] : [];
    });
}

function getPhaseWeeks(phaseId: number): { start: number; end: number; deload: number[] } {
  const tl = yearlyTimeline.find((t) => t.phase === phaseId);
  if (!tl) return { start: 1, end: 8, deload: [] };
  return { start: tl.startWeek, end: tl.endWeek, deload: tl.deloadWeeks ?? [] };
}

// ── component ─────────────────────────────────────────────────────────────────

export default function TrainingDetails() {
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [media, setMedia] = useState<Record<string, ExerciseMedia>>({});
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ videoUrl: '', photoUrl: '' });

  const phase = trainingPhases[selectedPhase];
  const { start: weekStart, end: weekEnd, deload: deloadWeeks } = getPhaseWeeks(phase.id);
  const totalWeeks = weekEnd - weekStart + 1;
  const relativeWeek = selectedWeek - weekStart + 1;
  const isDeload = deloadWeeks.includes(selectedWeek);

  useEffect(() => { setSelectedWeek(weekStart); }, [selectedPhase, weekStart]);

  useEffect(() => {
    const stored = localStorage.getItem('bombero_exercise_media');
    if (stored) setMedia(JSON.parse(stored));
  }, []);

  const saveMedia = (id: string, videoUrl: string, photoUrl: string) => {
    const updated = { ...media, [id]: { exerciseId: id, videoUrl, photoUrl } };
    setMedia(updated);
    localStorage.setItem('bombero_exercise_media', JSON.stringify(updated));
    setEditingExercise(null);
  };

  const day = phase.days[selectedDay];

  const blockColor = (t: string) => ({
    warmup:   'bg-yellow-500/10 border-yellow-500/30',
    strength: 'bg-blue-500/10 border-blue-500/30',
    cardio:   'bg-green-500/10 border-green-500/30',
    cooldown: 'bg-purple-500/10 border-purple-500/30',
    special:  'bg-orange-500/10 border-orange-500/30',
  }[t] ?? 'bg-gray-500/10 border-gray-500/30');

  const blockIcon = (t: string) => ({
    warmup: '🔥', strength: '💪', cardio: '🏃', cooldown: '🧘', special: '⚡',
  }[t] ?? '•');

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
              <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">🏠 Inicio</a>
              <a href="/weekly-plan" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">📅 Plan Semanal</a>
            </div>
          </div>
          <p className="text-muted-foreground">Todos los ejercicios con vídeos, fotos y progresiones · navega por semana</p>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT PANEL */}
          <div className="lg:col-span-1 space-y-6">

            {/* Phase */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Fase</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {trainingPhases.map((p, idx) => (
                  <button key={idx} onClick={() => { setSelectedPhase(idx); setSelectedDay(0); }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedPhase === idx ? 'bg-primary text-primary-foreground' : 'bg-background border border-border hover:border-primary'}`}>
                    <div className="font-bold">{p.name}</div>
                    <div className="text-xs opacity-75">{p.weeks}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Week Selector */}
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />Semana
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Nav arrows */}
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedWeek((w) => Math.max(weekStart, w - 1))}
                    disabled={selectedWeek <= weekStart}
                    className="p-2 rounded-lg border border-border hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-xl font-bold text-primary">Sem. {selectedWeek}</div>
                    <div className="text-xs text-muted-foreground">({relativeWeek} de {totalWeeks} en esta fase)</div>
                  </div>
                  <button onClick={() => setSelectedWeek((w) => Math.min(weekEnd, w + 1))}
                    disabled={selectedWeek >= weekEnd}
                    className="p-2 rounded-lg border border-border hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Deload warning */}
                {isDeload && (
                  <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                    <span className="text-lg">😴</span>
                    <div>
                      <div className="text-xs font-bold text-yellow-400">SEMANA DE DESCARGA</div>
                      <div className="text-xs text-muted-foreground">Reduce el volumen un 40 %</div>
                    </div>
                  </div>
                )}

                {/* Week grid */}
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: totalWeeks }, (_, i) => {
                    const w = weekStart + i;
                    const active = w === selectedWeek;
                    const dl = deloadWeeks.includes(w);
                    return (
                      <button key={w} onClick={() => setSelectedWeek(w)} title={dl ? `Sem. ${w} — Descarga` : `Sem. ${w}`}
                        className={`py-1.5 rounded text-xs font-bold transition-all ${active ? 'bg-primary text-primary-foreground scale-110 shadow' : dl ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:border-yellow-400' : 'bg-background border border-border hover:border-primary text-muted-foreground'}`}>
                        {w}
                        {dl && !active && <span className="block text-[8px] leading-none opacity-75">desc.</span>}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10px] text-muted-foreground text-center">Las progresiones se ajustan según la semana</p>
              </CardContent>
            </Card>

            {/* Day */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Día</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {phase.days.map((d, idx) => (
                  <button key={idx} onClick={() => setSelectedDay(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedDay === idx ? 'bg-primary text-primary-foreground' : 'bg-background border border-border hover:border-primary'}`}>
                    <div className="font-bold">{d.name}</div>
                    <div className="text-xs opacity-75">{d.focus}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-3 space-y-6">

            {/* Day header */}
            <Card className={`border ${isDeload ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-primary/20 bg-primary/5'}`}>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle className="text-2xl">{day.name}</CardTitle>
                    <CardDescription>{day.focus}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-sm px-3 py-1 border-primary text-primary">Sem. {selectedWeek}</Badge>
                    {isDeload && <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-sm px-3 py-1">😴 Descarga</Badge>}
                    <Badge className="text-lg px-4 py-2">{phase.name}</Badge>
                  </div>
                </div>
                {isDeload && (
                  <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-300">
                    <strong>Semana de descarga:</strong> Reduce todas las series y el volumen cardio un 40 %. Mantén la técnica pero baja la intensidad. El cuerpo necesita recuperarse para el siguiente bloque.
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* Blocks */}
            {day.blocks.map((block, blockIdx) => (
              <Card key={blockIdx} className={`border ${blockColor(block.type)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{blockIcon(block.type)}</span>
                    {block.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {block.exercises.map((exercise, exIdx) => {
                    const exId = `${selectedPhase}-${selectedDay}-${blockIdx}-${exIdx}`;
                    const exData = media[exId] || {};
                    const isEditing = editingExercise === exId;
                    const weekValue = exercise.progression ? getWeekProgressionValue(exercise.progression, relativeWeek) : null;
                    const progSteps = exercise.progression ? parseProgressionSteps(exercise.progression) : [];

                    return (
                      <div key={exIdx} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-foreground">{exercise.name}</h3>
                          {exercise.detail && <p className="text-sm text-muted-foreground mt-2">{exercise.detail}</p>}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {exercise.sets && (
                            <div className={`rounded-lg p-3 ${isDeload ? 'bg-yellow-500/10' : 'bg-background/50'}`}>
                              <div className="text-xs text-muted-foreground">Series</div>
                              <div className="text-lg font-bold text-primary">
                                {isDeload ? (Math.round(parseInt(exercise.sets) * 0.6) || exercise.sets) : exercise.sets}
                              </div>
                              {isDeload && <div className="text-[10px] text-yellow-400 line-through opacity-60">{exercise.sets} (normal)</div>}
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
                              <div className="text-lg font-bold text-primary">{weekValue ?? exercise.duration}</div>
                              {weekValue && weekValue !== exercise.duration && (
                                <div className="text-[10px] text-muted-foreground line-through opacity-50">{exercise.duration} (base)</div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Progression timeline */}
                        {exercise.progression && (
                          <div className="mb-4 rounded-lg border border-border bg-background/40 p-3 space-y-2">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Progresión por semanas</div>
                            <div className="flex flex-wrap gap-2">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${!weekValue ? 'bg-primary/20 border-primary text-primary font-bold' : 'border-border text-muted-foreground'}`}>
                                {!weekValue && '▶ '}Sem. 1-2 · base
                              </span>
                              {progSteps.map((step, si) => {
                                const isCurrent = weekValue !== null && step.value === weekValue;
                                return (
                                  <span key={si} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${isCurrent ? 'bg-primary/20 border-primary text-primary font-bold' : 'border-border text-muted-foreground'}`}>
                                    {isCurrent && '▶ '}{step.label} · {step.value}
                                  </span>
                                );
                              })}
                            </div>
                            {weekValue && (
                              <div className="text-xs text-primary font-medium flex items-center gap-1 mt-1">
                                <span>🎯</span> Esta semana (Sem. {selectedWeek}): <strong>{weekValue}</strong>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Media */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Video */}
                          <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Play className="w-4 h-4 text-primary" />
                              <span className="font-bold text-sm">Vídeo</span>
                            </div>
                            {exData.videoUrl && !isEditing ? (
                              <div className="space-y-3">
                                <div className="aspect-video bg-background rounded-lg overflow-hidden">
                                  <iframe width="100%" height="100%" src={exData.videoUrl.replace('watch?v=', 'embed/')} title={exercise.name} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                                </div>
                                <button onClick={() => { setEditingExercise(exId); setEditForm({ videoUrl: exData.videoUrl || '', photoUrl: exData.photoUrl || '' }); }} className="w-full px-3 py-2 text-sm bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary">
                                  <Edit2 className="w-3 h-3 inline mr-2" />Editar
                                </button>
                              </div>
                            ) : isEditing ? (
                              <div className="space-y-3">
                                <input type="text" placeholder="Enlace de YouTube (ej: https://www.youtube.com/watch?v=...)" value={editForm.videoUrl} onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-primary text-foreground text-sm" />
                                <div className="flex gap-2">
                                  <button onClick={() => saveMedia(exId, editForm.videoUrl, editForm.photoUrl)} className="flex-1 px-3 py-2 text-sm bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-green-500"><Check className="w-3 h-3 inline mr-2" />Guardar</button>
                                  <button onClick={() => setEditingExercise(null)} className="flex-1 px-3 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-500"><X className="w-3 h-3 inline mr-2" />Cancelar</button>
                                </div>
                              </div>
                            ) : (
                              <button onClick={() => { setEditingExercise(exId); setEditForm({ videoUrl: exData.videoUrl || '', photoUrl: exData.photoUrl || '' }); }} className="w-full px-3 py-2 text-sm bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary">
                                <Link2 className="w-3 h-3 inline mr-2" />Añadir vídeo
                              </button>
                            )}
                          </div>

                          {/* Photo */}
                          <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Image className="w-4 h-4 text-primary" />
                              <span className="font-bold text-sm">Foto</span>
                            </div>
                            {exData.photoUrl && !isEditing ? (
                              <div className="space-y-3">
                                <div className="aspect-square bg-background rounded-lg overflow-hidden">
                                  <img src={exData.photoUrl} alt={exercise.name} className="w-full h-full object-cover" />
                                </div>
                                <button onClick={() => { setEditingExercise(exId); setEditForm({ videoUrl: exData.videoUrl || '', photoUrl: exData.photoUrl || '' }); }} className="w-full px-3 py-2 text-sm bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary">
                                  <Edit2 className="w-3 h-3 inline mr-2" />Editar
                                </button>
                              </div>
                            ) : isEditing ? (
                              <div className="space-y-3">
                                <input type="text" placeholder="Enlace de imagen (ej: https://...)" value={editForm.photoUrl} onChange={(e) => setEditForm({ ...editForm, photoUrl: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-background border border-primary text-foreground text-sm" />
                                <div className="flex gap-2">
                                  <button onClick={() => saveMedia(exId, editForm.videoUrl, editForm.photoUrl)} className="flex-1 px-3 py-2 text-sm bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-green-500"><Check className="w-3 h-3 inline mr-2" />Guardar</button>
                                  <button onClick={() => setEditingExercise(null)} className="flex-1 px-3 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-500"><X className="w-3 h-3 inline mr-2" />Cancelar</button>
                                </div>
                              </div>
                            ) : (
                              <button onClick={() => { setEditingExercise(exId); setEditForm({ videoUrl: exData.videoUrl || '', photoUrl: exData.photoUrl || '' }); }} className="w-full px-3 py-2 text-sm bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-primary">
                                <Link2 className="w-3 h-3 inline mr-2" />Añadir foto
                              </button>
                            )}
                          </div>
                        </div>
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
