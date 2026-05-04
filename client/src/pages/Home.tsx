import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Utensils, TrendingUp, AlertCircle, Share2, BookOpen, Zap } from 'lucide-react';

export default function Home() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);

  // Cargar fecha de inicio
  useEffect(() => {
    const stored = localStorage.getItem('bombero_start_date');
    if (stored) {
      const date = new Date(stored);
      setStartDate(date);
      const today = new Date();
      const diffTime = today.getTime() - date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setCurrentWeek(Math.ceil(diffDays / 7));
    }
  }, []);

  const modules = [
    {
      id: 'calendar-exporter',
      title: '📄 Exportar a Calendario',
      description: 'Sincroniza entrenamientos y hitos con Google Calendar, Outlook o Apple Calendar. Acceso desde tu móvil.',
      href: '/calendar-exporter',
      color: 'from-blue-500 to-cyan-500',
      icon: '📅',
      badge: 'Sincronización',
    },
    {
      id: 'yearly-calendar',
      title: '📊 Plan de 24 Meses',
      description: 'Timeline completo con 4 fases, 40+ hitos clave, criterios de avance y progresión visual.',
      href: '/yearly-calendar',
      color: 'from-purple-500 to-pink-500',
      icon: '📈',
      badge: 'Planificación',
    },
    {
      id: 'progress-tracker',
      title: '📈 Seguimiento de Progreso',
      description: 'Registra tus marcas en 6 pruebas físicas. Visualiza gráficas semanales y detecta tendencias.',
      href: '/progress-tracker',
      color: 'from-green-500 to-emerald-500',
      icon: '📊',
      badge: 'Métricas',
    },
    {
      id: 'weekly-plan',
      title: '📅 Plan Semanal Sincronizado',
      description: 'Entrenamientos + nutrición optimizada para cada día. Recomendaciones pre/post-entreno.',
      href: '/weekly-plan',
      color: 'from-orange-500 to-red-500',
      icon: '⚡',
      badge: 'Ejecución',
    },
    {
      id: 'menu-generator',
      title: '🍽️ Generador de Menús',
      description: 'Menús automáticos con macros precisos. Tabla de equivalencias y listas de compra.',
      href: '/menu-generator',
      color: 'from-yellow-500 to-orange-500',
      icon: '🥗',
      badge: 'Nutrición',
    },
    {
      id: 'training-details',
      title: '💪 Entrenamientos Detallados',
      description: 'Visualiza todos los ejercicios, series, repeticiones y progresiones por fase.',
      href: '#training',
      color: 'from-red-500 to-pink-500',
      icon: '🏋️',
      badge: 'Referencia',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Flame className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Plan Bombero CM</h1>
              <p className="text-muted-foreground mt-1">Entrenamiento interactivo para oposición — 24 meses de periodización avanzada</p>
            </div>
          </div>

          {/* Quick Stats */}
          {startDate && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-background/50 rounded-lg p-4 border border-border">
                <div className="text-sm text-muted-foreground">Semana Actual</div>
                <div className="text-2xl font-bold text-primary mt-1">{currentWeek}</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-border">
                <div className="text-sm text-muted-foreground">Fecha de Inicio</div>
                <div className="text-2xl font-bold text-primary mt-1">{startDate.toLocaleDateString('es-ES')}</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-border">
                <div className="text-sm text-muted-foreground">Días Restantes</div>
                <div className="text-2xl font-bold text-primary mt-1">{Math.max(0, 672 - (currentWeek * 7))}</div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">Bienvenido a tu Plan de Entrenamiento</h2>
            <p className="text-muted-foreground mb-4">
              Esta plataforma te guía a través de 24 meses de entrenamiento estructurado para la oposición de bombero de la Comunidad de Madrid. 
              Selecciona un módulo abajo para comenzar.
            </p>
            {!startDate && (
              <div className="flex gap-3 items-center">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-muted-foreground">
                  Para activar todas las funciones, establece tu fecha de inicio en <strong>Plan de 24 Meses</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((module) => (
            <a
              key={module.id}
              href={module.href}
              className="group"
            >
              <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{module.icon}</div>
                    <Badge variant="secondary" className="text-xs">{module.badge}</Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {module.description}
                  </CardDescription>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Acceder</span>
                    <span className="text-lg">→</span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Características Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-primary" />
                  Periodización Avanzada
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>✓ 4 fases estructuradas (Adaptación, Desarrollo, Especialización, Taper)</p>
                <p>✓ Semanas de descarga automáticas para prevenir sobrecarga</p>
                <p>✓ Criterios claros de avance entre fases</p>
                <p>✓ Simulacros integrados en la progresión</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Seguimiento Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>✓ Registro de marcas en 6 pruebas físicas</p>
                <p>✓ Gráficas semanales de evolución</p>
                <p>✓ Detección automática de tendencias</p>
                <p>✓ Alertas si vas por debajo del objetivo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Utensils className="w-5 h-5 text-primary" />
                  Nutrición Personalizada
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>✓ Menús automáticos con macros precisos</p>
                <p>✓ Tabla de equivalencias de alimentos</p>
                <p>✓ Sincronización con tipo de entrenamiento</p>
                <p>✓ Listas de compra generadas automáticamente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  Sincronización Móvil
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>✓ Exporta a Google Calendar, Outlook, Apple Calendar</p>
                <p>✓ Recordatorios automáticos de entrenamientos</p>
                <p>✓ Acceso desde cualquier dispositivo</p>
                <p>✓ Sincronización en tiempo real</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Referencia Completa
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>✓ Todos los ejercicios detallados por fase</p>
                <p>✓ Series, repeticiones y progresiones</p>
                <p>✓ Reglas de autorregulación por fatiga</p>
                <p>✓ Criterios de prevención de lesiones</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Share2 className="w-5 h-5 text-primary" />
                  Exportación Flexible
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>✓ Descarga plan semanal en PDF</p>
                <p>✓ Exporta datos de progreso a CSV</p>
                <p>✓ Genera calendarios iCal</p>
                <p>✓ Comparte tu progreso fácilmente</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              Comienza Aquí
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <div className="font-bold text-foreground">Establece tu fecha de inicio</div>
                  <div className="text-sm text-muted-foreground">Ve a "Plan de 24 Meses" e introduce tu fecha de inicio del entrenamiento</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <div className="font-bold text-foreground">Revisa tu plan semanal</div>
                  <div className="text-sm text-muted-foreground">En "Plan Semanal Sincronizado" verás entrenamientos y nutrición para esta semana</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <div className="font-bold text-foreground">Sincroniza con tu móvil</div>
                  <div className="text-sm text-muted-foreground">En "Exportar a Calendario" descarga el archivo .ics e importa en tu app de calendario</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <div className="font-bold text-foreground">Registra tu progreso</div>
                  <div className="text-sm text-muted-foreground">En "Seguimiento de Progreso" anota tus marcas semanales y visualiza tu evolución</div>
                </div>
              </div>
            </div>

            <Button className="w-full mt-4" asChild>
              <a href="/yearly-calendar">Comenzar Ahora →</a>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>Plan de entrenamiento para oposición de bombero — Comunidad de Madrid</p>
          <p className="mt-2">Versión 1.0 • Diseñado con criterio de alto rendimiento y prevención de lesiones</p>
        </div>
      </main>
    </div>
  );
}
