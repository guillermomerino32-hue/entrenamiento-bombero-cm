export interface Milestone {
  week: number;
  phase: number;
  title: string;
  description: string;
  type: 'checkpoint' | 'deload' | 'test' | 'achievement';
}

export interface AdvancementCriteria {
  phase: number;
  criteria: string[];
  minimumRequirements: {
    test: string;
    value: number;
    unit: string;
  }[];
}

export interface PhaseTimeline {
  phase: number;
  name: string;
  startWeek: number;
  endWeek: number;
  totalWeeks: number;
  objective: string;
  focusAreas: string[];
  milestones: Milestone[];
  advancementCriteria: AdvancementCriteria;
  deloadWeeks: number[];
  estimatedCalories: number;
  estimatedVolume: string;
}

// Calendario completo de 24 meses (96 semanas)
export const yearlyTimeline: PhaseTimeline[] = [
  {
    phase: 1,
    name: 'FASE 1 — ADAPTACIÓN',
    startWeek: 1,
    endWeek: 8,
    totalWeeks: 8,
    objective: 'Construir base aeróbica sólida, fortalecer rodillas y articulaciones, aprender técnica básica de todos los ejercicios.',
    focusAreas: [
      'Carrera continua (20 min)',
      'Flexiones básicas',
      'Dead hang isométrico',
      'Trepa en estructura',
      'Movilidad y prevención de lesiones',
    ],
    milestones: [
      {
        week: 1,
        phase: 1,
        title: 'Inicio del Plan',
        description: 'Evaluación inicial de marcas. Establecer baseline de todas las pruebas.',
        type: 'checkpoint',
      },
      {
        week: 3,
        phase: 1,
        title: 'Test de Adaptación',
        description: 'Primera evaluación: 60m, 300m, 2000m, flexiones 60s, dead hang, trepa.',
        type: 'test',
      },
      {
        week: 4,
        phase: 1,
        title: 'Semana de Descarga',
        description: 'Reducir volumen al 50%. Enfoque en movilidad y recuperación.',
        type: 'deload',
      },
      {
        week: 7,
        phase: 1,
        title: 'Test Final Fase 1',
        description: 'Evaluación completa. Criterios de avance a Fase 2.',
        type: 'test',
      },
      {
        week: 8,
        phase: 1,
        title: 'Fin Fase 1',
        description: 'Revisión de progreso y planificación de Fase 2.',
        type: 'checkpoint',
      },
    ],
    deloadWeeks: [4],
    estimatedCalories: 2200,
    estimatedVolume: 'Bajo-Medio',
    advancementCriteria: {
      phase: 1,
      criteria: [
        'Trota 20 min continuo sin parar',
        '15 flexiones completas seguidas',
        'Dead hang 20 segundos',
        'Trepa 5m en menos de 30 segundos',
        'Sin dolor de rodilla durante entrenamientos',
        'Consistencia: 6/7 entrenamientos por semana',
      ],
      minimumRequirements: [
        { test: '60m', value: 10.5, unit: 's' },
        { test: '300m', value: 45, unit: 's' },
        { test: '2000m', value: 540, unit: 's' },
        { test: 'flexiones_60s', value: 20, unit: 'rep' },
        { test: 'dead_hang', value: 20, unit: 's' },
        { test: 'trepa', value: 30, unit: 's' },
      ],
    },
  },
  {
    phase: 2,
    name: 'FASE 2 — DESARROLLO',
    startWeek: 9,
    endWeek: 24,
    totalWeeks: 16,
    objective: 'Aumentar intensidad aeróbica, desarrollar fuerza funcional, mejorar técnica de trepa y dominadas.',
    focusAreas: [
      'Carrera a ritmo (6-8 km/h)',
      'Intervalos de velocidad',
      'Flexiones con peso',
      'Dominadas isométricas',
      'Trepa con técnica avanzada',
    ],
    milestones: [
      {
        week: 9,
        phase: 2,
        title: 'Inicio Fase 2',
        description: 'Aumento de intensidad. Introducir intervalos y trabajo de fuerza.',
        type: 'checkpoint',
      },
      {
        week: 12,
        phase: 2,
        title: 'Test Intermedio',
        description: 'Evaluación de progreso. Ajustar intensidad si es necesario.',
        type: 'test',
      },
      {
        week: 12,
        phase: 2,
        title: 'Semana de Descarga 1',
        description: 'Reducir volumen al 50%. Recuperación activa.',
        type: 'deload',
      },
      {
        week: 18,
        phase: 2,
        title: 'Test Intermedio 2',
        description: 'Segunda evaluación. Validar progreso en fuerza.',
        type: 'test',
      },
      {
        week: 20,
        phase: 2,
        title: 'Semana de Descarga 2',
        description: 'Reducir volumen al 50%. Preparación para Fase 3.',
        type: 'deload',
      },
      {
        week: 23,
        phase: 2,
        title: 'Test Final Fase 2',
        description: 'Evaluación completa. Criterios de avance a Fase 3.',
        type: 'test',
      },
      {
        week: 24,
        phase: 2,
        title: 'Fin Fase 2',
        description: 'Revisión de progreso. Fase 3 más especializada.',
        type: 'checkpoint',
      },
    ],
    deloadWeeks: [12, 20],
    estimatedCalories: 2400,
    estimatedVolume: 'Medio',
    advancementCriteria: {
      phase: 2,
      criteria: [
        'Correr 2000m en menos de 8:00 minutos',
        '30 flexiones completas seguidas',
        'Dead hang 30 segundos',
        'Trepa 5m en menos de 25 segundos',
        'Realizar 5 dominadas isométricas',
        'Consistencia: 6/7 entrenamientos por semana',
        'Sin lesiones o dolor crónico',
      ],
      minimumRequirements: [
        { test: '60m', value: 9.5, unit: 's' },
        { test: '300m', value: 40, unit: 's' },
        { test: '2000m', value: 480, unit: 's' },
        { test: 'flexiones_60s', value: 30, unit: 'rep' },
        { test: 'dead_hang', value: 30, unit: 's' },
        { test: 'trepa', value: 25, unit: 's' },
      ],
    },
  },
  {
    phase: 3,
    name: 'FASE 3 — ESPECIALIZACIÓN',
    startWeek: 25,
    endWeek: 56,
    totalWeeks: 32,
    objective: 'Especializar en pruebas específicas, aumentar volumen de entrenamiento, preparación para simulacros.',
    focusAreas: [
      'Carrera de velocidad (60m, 300m)',
      'Carrera de resistencia (2000m)',
      'Flexiones explosivas',
      'Dominadas y trepa avanzada',
      'Simulacros de pruebas',
    ],
    milestones: [
      {
        week: 25,
        phase: 3,
        title: 'Inicio Fase 3',
        description: 'Especialización en pruebas. Aumento significativo de intensidad.',
        type: 'checkpoint',
      },
      {
        week: 28,
        phase: 3,
        title: 'Test Intermedio',
        description: 'Evaluación de progreso en pruebas específicas.',
        type: 'test',
      },
      {
        week: 28,
        phase: 3,
        title: 'Semana de Descarga 1',
        description: 'Reducir volumen. Recuperación.',
        type: 'deload',
      },
      {
        week: 32,
        phase: 3,
        title: 'Simulacro 1',
        description: 'Primer simulacro completo de pruebas. Registrar marcas.',
        type: 'test',
      },
      {
        week: 36,
        phase: 3,
        title: 'Semana de Descarga 2',
        description: 'Reducir volumen. Análisis de simulacro.',
        type: 'deload',
      },
      {
        week: 40,
        phase: 3,
        title: 'Simulacro 2',
        description: 'Segundo simulacro. Validar mejoras.',
        type: 'test',
      },
      {
        week: 44,
        phase: 3,
        title: 'Semana de Descarga 3',
        description: 'Reducir volumen. Preparación final.',
        type: 'deload',
      },
      {
        week: 48,
        phase: 3,
        title: 'Simulacro 3',
        description: 'Tercer simulacro. Evaluación final de Fase 3.',
        type: 'test',
      },
      {
        week: 52,
        phase: 3,
        title: 'Semana de Descarga 4',
        description: 'Reducir volumen. Recuperación antes de Fase 4.',
        type: 'deload',
      },
      {
        week: 56,
        phase: 3,
        title: 'Fin Fase 3',
        description: 'Revisión de progreso. Preparación para Fase 4 (taper).',
        type: 'checkpoint',
      },
    ],
    deloadWeeks: [28, 36, 44, 52],
    estimatedCalories: 2600,
    estimatedVolume: 'Alto',
    advancementCriteria: {
      phase: 3,
      criteria: [
        'Correr 2000m en menos de 7:00 minutos',
        '40 flexiones completas seguidas',
        'Dead hang 35 segundos',
        'Trepa 5m en menos de 20 segundos',
        'Realizar 10 dominadas completas',
        'Consistencia: 6/7 entrenamientos por semana',
        'Completar 3 simulacros con marcas consistentes',
        'Marcas dentro del 10% del objetivo de Fase 4',
      ],
      minimumRequirements: [
        { test: '60m', value: 8.2, unit: 's' },
        { test: '300m', value: 38, unit: 's' },
        { test: '2000m', value: 420, unit: 's' },
        { test: 'flexiones_60s', value: 40, unit: 'rep' },
        { test: 'dead_hang', value: 35, unit: 's' },
        { test: 'trepa', value: 20, unit: 's' },
      ],
    },
  },
  {
    phase: 4,
    name: 'FASE 4 — TAPER & OPOSICIÓN',
    startWeek: 57,
    endWeek: 96,
    totalWeeks: 40,
    objective: 'Mantener forma, reducir volumen, optimizar recuperación, preparación mental para oposición.',
    focusAreas: [
      'Mantenimiento de velocidad',
      'Mantenimiento de fuerza',
      'Recuperación y prevención de lesiones',
      'Preparación mental',
      'Simulacros finales',
    ],
    milestones: [
      {
        week: 57,
        phase: 4,
        title: 'Inicio Fase 4 (Taper)',
        description: 'Reducción progresiva de volumen. Mantener intensidad.',
        type: 'checkpoint',
      },
      {
        week: 60,
        phase: 4,
        title: 'Test Intermedio',
        description: 'Validar que se mantiene forma con menos volumen.',
        type: 'test',
      },
      {
        week: 64,
        phase: 4,
        title: 'Semana de Descarga',
        description: 'Reducir volumen. Recuperación.',
        type: 'deload',
      },
      {
        week: 68,
        phase: 4,
        title: 'Simulacro Final 1',
        description: 'Simulacro con condiciones similares a oposición.',
        type: 'test',
      },
      {
        week: 72,
        phase: 4,
        title: 'Semana de Descarga',
        description: 'Reducir volumen. Recuperación.',
        type: 'deload',
      },
      {
        week: 76,
        phase: 4,
        title: 'Simulacro Final 2',
        description: 'Último simulacro. Validar readiness.',
        type: 'test',
      },
      {
        week: 80,
        phase: 4,
        title: 'Semana de Descarga',
        description: 'Reducir volumen significativamente. Recuperación máxima.',
        type: 'deload',
      },
      {
        week: 84,
        phase: 4,
        title: 'Mantenimiento Ligero',
        description: 'Entrenamientos muy ligeros. Enfoque en recuperación y mentalidad.',
        type: 'checkpoint',
      },
      {
        week: 88,
        phase: 4,
        title: 'Última Semana de Entrenamiento',
        description: 'Entrenamientos muy ligeros. Preparación mental.',
        type: 'checkpoint',
      },
      {
        week: 92,
        phase: 4,
        title: 'Descanso Total',
        description: 'Descanso completo. Recuperación máxima.',
        type: 'deload',
      },
      {
        week: 96,
        phase: 4,
        title: '¡OPOSICIÓN!',
        description: 'Semana de la oposición. ¡A por todas!',
        type: 'achievement',
      },
    ],
    deloadWeeks: [64, 72, 80, 92],
    estimatedCalories: 2300,
    estimatedVolume: 'Bajo-Medio',
    advancementCriteria: {
      phase: 4,
      criteria: [
        'Mantener marcas de Fase 3 con menos volumen',
        'Correr 2000m en menos de 6:20 minutos',
        '55 flexiones completas seguidas',
        'Dead hang 40 segundos',
        'Trepa 5m en menos de 15 segundos',
        'Realizar 15 dominadas completas',
        'Completar 2 simulacros finales con marcas máximas',
        'Preparación mental: visualización y confianza',
        'Sin lesiones o dolor',
      ],
      minimumRequirements: [
        { test: '60m', value: 7.5, unit: 's' },
        { test: '300m', value: 36, unit: 's' },
        { test: '2000m', value: 380, unit: 's' },
        { test: 'flexiones_60s', value: 55, unit: 'rep' },
        { test: 'dead_hang', value: 40, unit: 's' },
        { test: 'trepa', value: 15, unit: 's' },
      ],
    },
  },
];

/**
 * Obtener información de una fase específica
 */
export function getPhaseInfo(phase: number): PhaseTimeline | null {
  return yearlyTimeline.find(p => p.phase === phase) || null;
}

/**
 * Obtener hitos de una fase
 */
export function getPhaseMilestones(phase: number): Milestone[] {
  const phaseInfo = getPhaseInfo(phase);
  return phaseInfo?.milestones || [];
}

/**
 * Obtener criterios de avance de una fase
 */
export function getAdvancementCriteria(phase: number): AdvancementCriteria | null {
  const phaseInfo = getPhaseInfo(phase);
  return phaseInfo?.advancementCriteria || null;
}

/**
 * Calcular semana actual basada en fecha de inicio
 */
export function getCurrentWeek(startDate: Date): number {
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
}

/**
 * Obtener fase actual basada en semana
 */
export function getCurrentPhase(week: number): number {
  for (const phase of yearlyTimeline) {
    if (week >= phase.startWeek && week <= phase.endWeek) {
      return phase.phase;
    }
  }
  return 4; // Si es después de la semana 96, retornar fase 4
}

/**
 * Obtener progreso de una fase (0-100%)
 */
export function getPhaseProgress(phase: number, currentWeek: number): number {
  const phaseInfo = getPhaseInfo(phase);
  if (!phaseInfo) return 0;

  if (currentWeek < phaseInfo.startWeek) return 0;
  if (currentWeek > phaseInfo.endWeek) return 100;

  const weeksCompleted = currentWeek - phaseInfo.startWeek;
  const totalWeeks = phaseInfo.totalWeeks;
  return Math.round((weeksCompleted / totalWeeks) * 100);
}

/**
 * Obtener próximo hito
 */
export function getNextMilestone(currentWeek: number): Milestone | null {
  for (const phase of yearlyTimeline) {
    for (const milestone of phase.milestones) {
      if (milestone.week >= currentWeek) {
        return milestone;
      }
    }
  }
  return null;
}

/**
 * Obtener hitos completados
 */
export function getCompletedMilestones(currentWeek: number): Milestone[] {
  const completed: Milestone[] = [];
  for (const phase of yearlyTimeline) {
    for (const milestone of phase.milestones) {
      if (milestone.week < currentWeek) {
        completed.push(milestone);
      }
    }
  }
  return completed;
}

/**
 * Calcular días restantes hasta oposición
 */
export function getDaysUntilOpposition(startDate: Date): number {
  const oppositionDate = new Date(startDate);
  oppositionDate.setDate(oppositionDate.getDate() + 96 * 7); // 96 semanas

  const today = new Date();
  const diffTime = oppositionDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Obtener resumen de la timeline
 */
export function getTimelineSummary() {
  return {
    totalWeeks: 96,
    totalPhases: 4,
    totalMilestones: yearlyTimeline.reduce((sum, p) => sum + p.milestones.length, 0),
    totalDeloadWeeks: yearlyTimeline.reduce((sum, p) => sum + p.deloadWeeks.length, 0),
    phases: yearlyTimeline.map(p => ({
      phase: p.phase,
      name: p.name,
      weeks: p.totalWeeks,
      objective: p.objective,
    })),
  };
}
