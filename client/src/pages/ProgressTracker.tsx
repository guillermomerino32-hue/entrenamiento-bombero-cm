import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  ProgressRecord,
  TestType,
  testDescriptions,
  testUnits,
  testColors,
  getPhaseTarget,
  getRecordsByTest,
  calculateProgressStats,
  addProgressRecord,
  deleteProgressRecord,
  downloadProgressCSV,
} from '@/data/progressTracking';
import { TrendingUp, Download, Trash2, Plus } from 'lucide-react';

const TEST_TYPES: TestType[] = ['60m', '300m', '2000m', 'flexiones_60s', 'dead_hang', 'trepa'];

export default function ProgressTracker() {
  const [selectedTest, setSelectedTest] = useState<TestType>('60m');
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [formData, setFormData] = useState({
    value: '',
    week: 1,
    rpe: 5,
    notes: '',
  });

  // Cargar registros
  useEffect(() => {
    const stored = localStorage.getItem('bombero_progress_records');
    if (stored) {
      setRecords(JSON.parse(stored));
    }
  }, []);

  // Obtener registros de la prueba seleccionada
  const testRecords = records.filter(r => r.testType === selectedTest && r.phase === selectedPhase);
  const stats = calculateProgressStats(testRecords);
  const target = getPhaseTarget(selectedPhase, selectedTest);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value) return;

    const newRecord = addProgressRecord({
      date: new Date().toISOString().split('T')[0],
      week: formData.week,
      phase: selectedPhase,
      testType: selectedTest,
      value: parseFloat(formData.value),
      unit: testUnits[selectedTest],
      rpe: formData.rpe,
      notes: formData.notes,
    });

    setRecords([...records, newRecord]);
    setFormData({ value: '', week: 1, rpe: 5, notes: '' });
  };

  const handleDeleteRecord = (id: string) => {
    deleteProgressRecord(id);
    setRecords(records.filter(r => r.id !== id));
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '📈 Mejorando';
      case 'declining':
        return '📉 Decayendo';
      default:
        return '➡️ Estable';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-400';
      case 'declining':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Seguimiento de Progreso</h1>
            </div>
            <div className="flex gap-2">
              <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                🏠 Inicio
              </a>
              <Button
                onClick={() => downloadProgressCSV()}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <a href="/weekly-plan" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                📅 Plan Semanal
              </a>
            </div>
          </div>
          <p className="text-muted-foreground">Registra tus marcas y visualiza tu evolución en tiempo real</p>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phase Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[1, 2, 3, 4].map(phase => (
                  <Button
                    key={phase}
                    variant={selectedPhase === phase ? 'default' : 'outline'}
                    onClick={() => setSelectedPhase(phase)}
                    className="w-full justify-start"
                    size="sm"
                  >
                    Fase {phase}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Test Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prueba</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {TEST_TYPES.map(test => (
                  <Button
                    key={test}
                    variant={selectedTest === test ? 'default' : 'outline'}
                    onClick={() => setSelectedTest(test)}
                    className="w-full justify-start text-left h-auto flex-col items-start p-3"
                    size="sm"
                  >
                    <div className="font-bold text-sm">{test}</div>
                    <div className="text-xs opacity-70">{testDescriptions[test]}</div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Add Record Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Registrar Marca</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddRecord} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Valor ({testUnits[selectedTest]})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="Ej: 10.5"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Semana
                    </label>
                    <select
                      value={formData.week}
                      onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(w => (
                        <option key={w} value={w}>Semana {w}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      RPE (1-10)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.rpe}
                      onChange={(e) => setFormData({ ...formData, rpe: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-center text-sm font-bold text-primary mt-1">{formData.rpe}/10</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Notas (opcional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Condiciones, sensaciones, etc."
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Marca
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Stats & Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Summary */}
            {stats && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">{testDescriptions[selectedTest]}</CardTitle>
                  {target && <CardDescription>Objetivo Fase {selectedPhase}: {target.target} {target.unit}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-2">ACTUAL</div>
                      <div className="text-2xl font-bold text-foreground">{stats.current}</div>
                      <div className="text-xs text-muted-foreground mt-2">{testUnits[selectedTest]}</div>
                    </div>

                    <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-2">MEJOR</div>
                      <div className="text-2xl font-bold text-green-400">{stats.best}</div>
                      <div className="text-xs text-muted-foreground mt-2">{testUnits[selectedTest]}</div>
                    </div>

                    <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-2">PROMEDIO</div>
                      <div className="text-2xl font-bold text-blue-400">{stats.average.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground mt-2">{testUnits[selectedTest]}</div>
                    </div>

                    <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                      <div className="text-xs text-muted-foreground mb-2">MEJORA</div>
                      <div className={`text-2xl font-bold ${stats.improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stats.improvement > 0 ? '+' : ''}{stats.improvement.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Desde inicio</div>
                    </div>
                  </div>

                  <div className={`mt-4 p-3 rounded-lg border ${stats.trend === 'improving' ? 'bg-green-500/10 border-green-500/30' : stats.trend === 'declining' ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                    <div className={`text-sm font-bold ${getTrendColor(stats.trend)}`}>
                      {getTrendIcon(stats.trend)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stats.trend === 'improving' && 'Excelente progreso. Mantén la consistencia.'}
                      {stats.trend === 'declining' && 'Tendencia a la baja. Revisa recuperación y nutrición.'}
                      {stats.trend === 'stable' && 'Progreso estable. Considera aumentar intensidad.'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Charts Tabs */}
            <Tabs defaultValue="weekly" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekly">Evolución Semanal</TabsTrigger>
                <TabsTrigger value="records">Registros</TabsTrigger>
              </TabsList>

              {/* Weekly Chart */}
              <TabsContent value="weekly">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gráfica de Evolución</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats && stats.weeklyAverage.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.weeklyAverage}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="week" stroke="#999" />
                          <YAxis stroke="#999" />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                            labelStyle={{ color: '#fff' }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={testColors[selectedTest]}
                            strokeWidth={2}
                            dot={{ fill: testColors[selectedTest], r: 5 }}
                            activeDot={{ r: 7 }}
                            name={`${selectedTest} (${testUnits[selectedTest]})`}
                          />
                          {target && (
                            <Line
                              type="monotone"
                              dataKey={() => target.target}
                              stroke="#999"
                              strokeDasharray="5 5"
                              strokeWidth={2}
                              name={`Objetivo: ${target.target}`}
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        No hay datos para mostrar. Registra tu primera marca.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Records Tab */}
              <TabsContent value="records">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Historial de Registros</CardTitle>
                    <CardDescription>{testRecords.length} registros</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {testRecords.length > 0 ? (
                        [...testRecords].reverse().map(record => (
                          <div key={record.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50">
                            <div className="flex-1">
                              <div className="font-bold text-foreground">
                                {record.value} {record.unit}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(record.date).toLocaleDateString('es-ES')} • Semana {record.week}
                                {record.rpe && ` • RPE: ${record.rpe}/10`}
                              </div>
                              {record.notes && (
                                <div className="text-xs text-muted-foreground mt-1 italic">
                                  "{record.notes}"
                                </div>
                              )}
                            </div>
                            <Button
                              onClick={() => handleDeleteRecord(record.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          No hay registros. Comienza a registrar tus marcas.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Comparison with Other Tests */}
            {records.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comparativa de Pruebas</CardTitle>
                  <CardDescription>Progreso general en la Fase {selectedPhase}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {TEST_TYPES.map(test => {
                      const testRecords = records.filter(r => r.testType === test && r.phase === selectedPhase);
                      if (testRecords.length === 0) return null;

                      const stats = calculateProgressStats(testRecords);
                      if (!stats) return null;

                      return (
                        <div key={test} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50">
                          <div className="flex-1">
                            <div className="font-bold text-sm text-foreground">{test}</div>
                            <div className="text-xs text-muted-foreground">
                              Actual: {stats.current} {testUnits[test]} • Mejor: {stats.best} {testUnits[test]}
                            </div>
                          </div>
                          <Badge
                            variant={stats.trend === 'improving' ? 'default' : stats.trend === 'declining' ? 'destructive' : 'secondary'}
                            className="ml-2"
                          >
                            {getTrendIcon(stats.trend)}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
