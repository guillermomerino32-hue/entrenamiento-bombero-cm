import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  generateAllCalendarEvents,
  downloadICalFile,
  getEventsSummary,
  getImportInstructions,
} from '@/lib/calendarExporter';
import { Calendar, Download, Copy, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function CalendarExporter() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [includeTrainings, setIncludeTrainings] = useState(true);
  const [includeMilestones, setIncludeMilestones] = useState(true);
  const [eventsSummary, setEventsSummary] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Cargar fecha de inicio
  useEffect(() => {
    const stored = localStorage.getItem('bombero_start_date');
    if (stored) {
      setStartDate(new Date(stored));
    }
  }, []);

  // Actualizar resumen de eventos
  useEffect(() => {
    if (startDate) {
      const events = generateAllCalendarEvents(startDate, includeTrainings, includeMilestones);
      setEventsSummary(getEventsSummary(events));
    }
  }, [startDate, includeTrainings, includeMilestones]);

  const handleDownloadIcal = () => {
    if (!startDate) return;
    const events = generateAllCalendarEvents(startDate, includeTrainings, includeMilestones);
    downloadICalFile(events, `plan-bombero-cm-${new Date().toISOString().split('T')[0]}.ics`);
  };

  const handleCopyInstructions = (platform: 'google' | 'outlook' | 'apple' | 'ical') => {
    const instructions = getImportInstructions(platform);
    navigator.clipboard.writeText(instructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!startDate) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card sticky top-0 z-50">
          <div className="container py-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Exportar a Calendario</h1>
            </div>
            <p className="text-muted-foreground">Sincroniza entrenamientos y hitos con tu móvil</p>
          </div>
        </header>

        <main className="container py-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Establece tu fecha de inicio</CardTitle>
              <CardDescription>Necesitamos tu fecha de inicio para generar los eventos correctamente</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ve a <strong>Plan de 24 Meses</strong> y establece tu fecha de inicio. Luego vuelve aquí.
              </p>
              <Button asChild>
                <a href="/yearly-calendar">Ir a Plan de 24 Meses</a>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Exportar a Calendario</h1>
            </div>
            <div className="flex gap-2">
              <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                🏠 Inicio
              </a>
              <a href="/yearly-calendar" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                📄 Plan de 24 Meses
              </a>
            </div>
          </div>
          <p className="text-muted-foreground">Sincroniza entrenamientos, hitos y simulacros con tu móvil</p>
        </div>
      </header>

      <main className="container py-8">
        {/* Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Opciones de Exportación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTrainings}
                  onChange={(e) => setIncludeTrainings(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Incluir entrenamientos semanales</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMilestones}
                  onChange={(e) => setIncludeMilestones(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Incluir hitos clave (tests, deload, simulacros)</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {eventsSummary && (
          <Card className="border-primary/20 bg-primary/5 mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-background/50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-primary">{eventsSummary.total}</div>
                  <div className="text-xs text-muted-foreground mt-1">Total</div>
                </div>
                {includeTrainings && (
                  <div className="bg-background/50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-orange-400">{eventsSummary.trainings}</div>
                    <div className="text-xs text-muted-foreground mt-1">Entrenamientos</div>
                  </div>
                )}
                {includeMilestones && (
                  <>
                    <div className="bg-background/50 rounded p-3 text-center">
                      <div className="text-2xl font-bold text-blue-400">{eventsSummary.milestones}</div>
                      <div className="text-xs text-muted-foreground mt-1">Hitos</div>
                    </div>
                    <div className="bg-background/50 rounded p-3 text-center">
                      <div className="text-2xl font-bold text-green-400">{eventsSummary.deloads}</div>
                      <div className="text-xs text-muted-foreground mt-1">Descargas</div>
                    </div>
                    <div className="bg-background/50 rounded p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-400">{eventsSummary.tests}</div>
                      <div className="text-xs text-muted-foreground mt-1">Tests</div>
                    </div>
                    <div className="bg-background/50 rounded p-3 text-center">
                      <div className="text-2xl font-bold text-purple-400">{eventsSummary.simulacros}</div>
                      <div className="text-xs text-muted-foreground mt-1">Simulacros</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Download Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Descargar Archivo iCal
            </CardTitle>
            <CardDescription>Descarga un archivo .ics que puedes importar en cualquier aplicación de calendario</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDownloadIcal} className="w-full md:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Descargar plan-bombero-cm.ics
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              El archivo contiene {eventsSummary?.total || 0} eventos con recordatorios automáticos.
            </p>
          </CardContent>
        </Card>

        {/* Import Instructions */}
        <Tabs defaultValue="google" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="google">Google Calendar</TabsTrigger>
            <TabsTrigger value="outlook">Outlook</TabsTrigger>
            <TabsTrigger value="apple">Apple Calendar</TabsTrigger>
            <TabsTrigger value="ical">Otro</TabsTrigger>
          </TabsList>

          {/* Google Calendar */}
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Importar en Google Calendar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background/50 rounded p-4 space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">1.</div>
                    <div>Descarga el archivo .ics haciendo clic en el botón anterior</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">2.</div>
                    <div>Ve a <strong>Google Calendar</strong> (calendar.google.com)</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">3.</div>
                    <div>Haz clic en el engranaje (⚙️) en la esquina superior derecha</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">4.</div>
                    <div>Selecciona <strong>"Importar y exportar"</strong></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">5.</div>
                    <div>Haz clic en <strong>"Seleccionar archivo en tu ordenador"</strong></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">6.</div>
                    <div>Elige el archivo <strong>plan-bombero-cm.ics</strong></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">7.</div>
                    <div>Selecciona el calendario donde deseas importar (ej: "Mi calendario")</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">8.</div>
                    <div>Haz clic en <strong>"Importar"</strong></div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4 text-sm">
                  <p className="text-blue-400 font-bold mb-2">💡 Sincronización automática</p>
                  <p className="text-muted-foreground">
                    Una vez importado, los eventos aparecerán en tu Google Calendar y se sincronizarán automáticamente con tu móvil.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outlook */}
          <TabsContent value="outlook">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Importar en Outlook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background/50 rounded p-4 space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">1.</div>
                    <div>Descarga el archivo .ics</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">2.</div>
                    <div>Abre <strong>Outlook</strong> en tu ordenador</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">3.</div>
                    <div>Ve a <strong>Archivo</strong> → <strong>Abrir y exportar</strong> → <strong>Importar/Exportar</strong></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">4.</div>
                    <div>Selecciona <strong>"Importar archivo de datos de Outlook"</strong></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">5.</div>
                    <div>Elige <strong>"Archivo de calendario iCalendar (.ics)"</strong></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">6.</div>
                    <div>Selecciona el archivo <strong>plan-bombero-cm.ics</strong></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">7.</div>
                    <div>Elige el calendario de destino</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">8.</div>
                    <div>Haz clic en <strong>"Finalizar"</strong></div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4 text-sm">
                  <p className="text-blue-400 font-bold mb-2">📱 En tu móvil</p>
                  <p className="text-muted-foreground">
                    Los eventos se sincronizarán automáticamente si tienes Outlook configurado en tu teléfono.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apple Calendar */}
          <TabsContent value="apple">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Importar en Apple Calendar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background/50 rounded p-4 space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">1.</div>
                    <div>Descarga el archivo .ics</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">2.</div>
                    <div>Haz doble clic en el archivo <strong>plan-bombero-cm.ics</strong></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">3.</div>
                    <div><strong>Calendario</strong> se abrirá automáticamente</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">4.</div>
                    <div>Selecciona el calendario donde deseas importar</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">5.</div>
                    <div>Haz clic en <strong>"Agregar"</strong></div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4 text-sm">
                  <p className="text-blue-400 font-bold mb-2">🔄 Sincronización iCloud</p>
                  <p className="text-muted-foreground">
                    Los eventos se sincronizarán automáticamente con iCloud y aparecerán en todos tus dispositivos Apple.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Otro */}
          <TabsContent value="ical">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Importar en Otra Aplicación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background/50 rounded p-4 space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">1.</div>
                    <div>Descarga el archivo .ics</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">2.</div>
                    <div>Abre tu aplicación de calendario favorita</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">3.</div>
                    <div>Busca la opción <strong>"Importar"</strong> o <strong>"Abrir"</strong></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">4.</div>
                    <div>Selecciona el archivo <strong>plan-bombero-cm.ics</strong></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-primary font-bold">5.</div>
                    <div>Confirma la importación</div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded p-4 text-sm">
                  <p className="text-green-400 font-bold mb-2">✅ Aplicaciones compatibles</p>
                  <p className="text-muted-foreground">
                    El formato iCal (.ics) es compatible con prácticamente todas las aplicaciones de calendario: Thunderbird, Evolution, Nextcloud, etc.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Características Incluidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Entrenamientos semanales</div>
                  <div className="text-xs text-muted-foreground">Con detalles de ejercicios</div>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Hitos clave</div>
                  <div className="text-xs text-muted-foreground">Tests, deload, simulacros</div>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Recordatorios automáticos</div>
                  <div className="text-xs text-muted-foreground">24h antes de entrenamientos, 7d antes de tests</div>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Colores por tipo</div>
                  <div className="text-xs text-muted-foreground">Fácil identificación visual</div>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Sincronización móvil</div>
                  <div className="text-xs text-muted-foreground">Acceso desde cualquier dispositivo</div>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Actualizable</div>
                  <div className="text-xs text-muted-foreground">Descarga nuevamente si cambias de fecha</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
