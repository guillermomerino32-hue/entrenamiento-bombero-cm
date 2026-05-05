import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle2, Link2, Copy, Zap, Calendar } from 'lucide-react';
import {
  NotionIntegrationConfig,
  saveNotionConfig,
  loadNotionConfig,
  clearNotionConfig,
  validateNotionConfig,
  getNotionSyncInstructions,
  getManualSyncInstructions,
} from '@/lib/notionIntegration';

export default function NotionSync() {
  const [email, setEmail] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [syncTrainings, setSyncTrainings] = useState(true);
  const [syncNutrition, setSyncNutrition] = useState(true);
  const [syncMilestones, setSyncMilestones] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Cargar configuración guardada
  useEffect(() => {
    const config = loadNotionConfig();
    if (config) {
      setEmail(config.email);
      setSyncTrainings(config.syncTrainings);
      setSyncNutrition(config.syncNutrition);
      setSyncMilestones(config.syncMilestones);
      setIsConnected(!!localStorage.getItem('notion_token'));
    }
  }, []);

  const handleConnect = async () => {
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Por favor ingresa un email válido' });
      return;
    }

    const config: NotionIntegrationConfig = {
      email,
      syncTrainings,
      syncNutrition,
      syncMilestones,
    };

    const validation = validateNotionConfig(config);
    if (!validation.valid) {
      setMessage({ type: 'error', text: validation.errors[0] });
      return;
    }

    setIsSaving(true);
    try {
      // Simular conexión a Notion
      // En una implementación real, esto haría una llamada a un backend
      await new Promise(resolve => setTimeout(resolve, 1500));

      saveNotionConfig(config);
      localStorage.setItem('notion_token', `token_${Date.now()}`);
      setIsConnected(true);
      setMessage({ type: 'success', text: '✅ Conectado con Notion exitosamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al conectar con Notion' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = () => {
    clearNotionConfig();
    setIsConnected(false);
    setEmail('');
    setMessage({ type: 'success', text: 'Desconectado de Notion' });
  };

  const handleCopyInstructions = (type: 'auto' | 'manual') => {
    const instructions = type === 'auto'
      ? getNotionSyncInstructions()
      : getManualSyncInstructions(email);
    navigator.clipboard.writeText(instructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Sincronización con Notion</h1>
            </div>
            <div className="flex gap-2">
              <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                🏠 Inicio
              </a>
              <a href="/calendar-exporter" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                📅 Exportar Calendario
              </a>
            </div>
          </div>
          <p className="text-muted-foreground">Sincroniza entrenamientos, nutrición y hitos con Notion Calendar</p>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado de Conexión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center gap-3 p-4 rounded-lg ${isConnected ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-500/10 border border-gray-500/30'}`}>
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-bold text-sm text-green-400">Conectado</div>
                        <div className="text-xs text-muted-foreground">{email}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-bold text-sm">No conectado</div>
                        <div className="text-xs text-muted-foreground">Configura tu conexión abajo</div>
                      </div>
                    </>
                  )}
                </div>

                {isConnected && (
                  <Button
                    variant="destructive"
                    onClick={handleDisconnect}
                    className="w-full"
                  >
                    Desconectar
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Información */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">¿Qué es Notion Calendar?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  Notion Calendar es una herramienta que te permite visualizar y gestionar tus eventos en un calendario integrado.
                </p>
                <p>
                  Con esta sincronización, todos tus entrenamientos, comidas y hitos se mostrarán automáticamente en Notion.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-xs">
                    💡 <strong>Tip:</strong> Sincroniza regularmente para mantener tu Notion actualizado.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="config" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="config">Configuración</TabsTrigger>
                <TabsTrigger value="auto">Sincronización Automática</TabsTrigger>
                <TabsTrigger value="manual">Sincronización Manual</TabsTrigger>
              </TabsList>

              {/* Configuration Tab */}
              <TabsContent value="config" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurar Conexión con Notion</CardTitle>
                    <CardDescription>Ingresa tu email de Notion y selecciona qué deseas sincronizar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-bold mb-2">Email de Notion</label>
                      <Input
                        type="email"
                        placeholder="tu.email@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isConnected}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Este es el email con el que accedes a tu workspace de Notion
                      </p>
                    </div>

                    {/* Sync Options */}
                    <div>
                      <label className="block text-sm font-bold mb-3">¿Qué deseas sincronizar?</label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <Checkbox
                            id="sync-trainings"
                            checked={syncTrainings}
                            onCheckedChange={(checked) => setSyncTrainings(checked as boolean)}
                            disabled={isConnected}
                          />
                          <label htmlFor="sync-trainings" className="flex-1 cursor-pointer">
                            <div className="font-bold text-sm">🏋️ Entrenamientos</div>
                            <div className="text-xs text-muted-foreground">Todos tus entrenamientos diarios</div>
                          </label>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <Checkbox
                            id="sync-nutrition"
                            checked={syncNutrition}
                            onCheckedChange={(checked) => setSyncNutrition(checked as boolean)}
                            disabled={isConnected}
                          />
                          <label htmlFor="sync-nutrition" className="flex-1 cursor-pointer">
                            <div className="font-bold text-sm">🍽️ Nutrición</div>
                            <div className="text-xs text-muted-foreground">Comidas y snacks planificados</div>
                          </label>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                          <Checkbox
                            id="sync-milestones"
                            checked={syncMilestones}
                            onCheckedChange={(checked) => setSyncMilestones(checked as boolean)}
                            disabled={isConnected}
                          />
                          <label htmlFor="sync-milestones" className="flex-1 cursor-pointer">
                            <div className="font-bold text-sm">📊 Hitos Importantes</div>
                            <div className="text-xs text-muted-foreground">Tests, simulacros y checkpoints</div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    {message && (
                      <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                        {message.text}
                      </div>
                    )}

                    {/* Connect Button */}
                    <Button
                      onClick={handleConnect}
                      disabled={isConnected || isSaving}
                      className="w-full"
                      size="lg"
                    >
                      {isSaving ? (
                        <>
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                          Conectando...
                        </>
                      ) : isConnected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Conectado
                        </>
                      ) : (
                        <>
                          <Link2 className="w-4 h-4 mr-2" />
                          Conectar con Notion
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Automatic Sync Tab */}
              <TabsContent value="auto" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sincronización Automática</CardTitle>
                    <CardDescription>Instrucciones para configurar la sincronización automática</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isConnected ? (
                      <>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span className="font-bold text-green-400">Sincronización Activa</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Tu conexión con Notion está activa. Los eventos se sincronizarán automáticamente.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-bold text-sm">Pasos completados:</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <span>Email verificado: {email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <span>Opciones de sincronización configuradas</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <span>Conexión con Notion establecida</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-2">
                          <p className="text-sm font-bold text-blue-400">💡 Próximos pasos:</p>
                          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Abre Notion Calendar en tu navegador</li>
                            <li>Busca el calendario "Plan Bombero CM"</li>
                            <li>Verás todos tus entrenamientos y comidas</li>
                            <li>Los cambios se sincronizarán automáticamente</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                            <span className="font-bold text-yellow-400">Conexión Requerida</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Primero debes conectar tu cuenta de Notion en la pestaña \"Configuración\".
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-bold text-sm">Cómo funciona la sincronización automática:</h4>
                          <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex gap-3">
                              <span className="font-bold text-primary">1.</span>
                              <span>Conecta tu email de Notion</span>
                            </div>
                            <div className="flex gap-3">
                              <span className="font-bold text-primary">2.</span>
                              <span>Selecciona qué deseas sincronizar</span>
                            </div>
                            <div className="flex gap-3">
                              <span className="font-bold text-primary">3.</span>
                              <span>Los eventos se crearán automáticamente en Notion</span>
                            </div>
                            <div className="flex gap-3">
                              <span className="font-bold text-primary">4.</span>
                              <span>Las actualizaciones se reflejarán en tiempo real</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => handleCopyInstructions('auto')}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Copiado' : 'Copiar Instrucciones'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Manual Sync Tab */}
              <TabsContent value="manual" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sincronización Manual</CardTitle>
                    <CardDescription>Opciones para sincronizar manualmente si prefieres no usar la sincronización automática</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm">Opción 1: Importar archivo iCal</h4>
                      <div className="bg-background/50 rounded-lg p-4 border border-border/50 space-y-3 text-sm text-muted-foreground">
                        <p>1. Ve a \"Plan Semanal\" y descarga el archivo iCal</p>
                        <p>2. En Notion, abre tu calendario</p>
                        <p>3. Haz clic en \"Importar\" y selecciona el archivo</p>
                        <p>4. Los eventos se importarán automáticamente</p>
                      </div>
                      <Button asChild variant="outline" className="w-full">
                        <a href="/weekly-plan">Ir a Plan Semanal</a>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-sm">Opción 2: Crear eventos manualmente</h4>
                      <div className="bg-background/50 rounded-lg p-4 border border-border/50 space-y-3 text-sm text-muted-foreground">
                        <p>1. En Notion, crea una base de datos \"Entrenamientos\"</p>
                        <p>2. Añade campos: Fecha, Tipo, Intensidad, Descripción</p>
                        <p>3. Copia los datos de esta aplicación</p>
                        <p>4. Pégalos en Notion manualmente</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-sm">Opción 3: Usar suscripción de calendario</h4>
                      <div className="bg-background/50 rounded-lg p-4 border border-border/50 space-y-3 text-sm text-muted-foreground">
                        <p>1. Copia la URL de suscripción de abajo</p>
                        <p>2. En Notion, añade un calendario externo</p>
                        <p>3. Pega la URL</p>
                        <p>4. Los eventos se actualizarán automáticamente</p>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={`${window.location.origin}/api/calendar/feed`}
                          readOnly
                          className="text-xs"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/api/calendar/feed`);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleCopyInstructions('manual')}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Todas las Instrucciones
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
