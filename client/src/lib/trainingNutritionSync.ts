import { trainingPhases, TrainingDay } from '@/data/trainingPlan';
import { getMacroTargets } from './menuGenerator';

export type TrainingIntensity = 'rest' | 'light' | 'moderate' | 'high' | 'very-high';

export interface TrainingDayAnalysis {
  dayName: string;
  focus: string;
  intensity: TrainingIntensity;
  calorieMultiplier: number; // Multiplicador sobre base calórica
  preWorkoutRecommendation: string;
  postWorkoutRecommendation: string;
  nutritionNotes: string;
  priorityMacro: 'protein' | 'carbs' | 'balanced';
  hydrationLevel: 'normal' | 'high' | 'very-high';
}

export interface WeeklyNutritionPlan {
  phase: number;
  week: number;
  days: Array<{
    dayName: string;
    training: TrainingDayAnalysis;
    recommendedKcal: number;
    recommendedProtein: number;
    recommendedCarbs: number;
    recommendedFat: number;
  }>;
  totalWeeklyKcal: number;
  totalWeeklyProtein: number;
  totalWeeklyCarbs: number;
  totalWeeklyFat: number;
  averageDailyKcal: number;
}

// Análisis de intensidad de entrenamientos por día
const trainingIntensityMap: { [key: string]: TrainingIntensity } = {
  LUNES: 'high', // Fuerza tracción + pierna
  MARTES: 'very-high', // Carrera intervalos + velocidad
  MIÉRCOLES: 'high', // Empuje + core
  JUEVES: 'very-high', // Carrera + aceleraciones
  VIERNES: 'light', // Descanso activo
  SÁBADO: 'very-high', // Circuito completo + simulacro
  DOMINGO: 'rest', // Descanso total
};

// Multiplicadores calóricos según intensidad
const calorieMultipliers: { [key in TrainingIntensity]: number } = {
  rest: 0.95, // -5% calorías
  light: 0.98, // -2% calorías
  moderate: 1.0, // Mantenimiento
  high: 1.08, // +8% calorías
  'very-high': 1.15, // +15% calorías
};

// Distribución de macros según tipo de entrenamiento
const macroDistribution: { [key in TrainingIntensity]: { protein: number; carbs: number; fat: number } } = {
  rest: { protein: 0.28, carbs: 0.45, fat: 0.27 }, // Más grasas en descanso
  light: { protein: 0.30, carbs: 0.48, fat: 0.22 },
  moderate: { protein: 0.32, carbs: 0.50, fat: 0.18 },
  high: { protein: 0.35, carbs: 0.52, fat: 0.13 }, // Más proteína y carbos
  'very-high': { protein: 0.38, carbs: 0.55, fat: 0.07 }, // Máxima proteína y carbos
};

// Recomendaciones de pre-entreno
const preWorkoutRecommendations: { [key in TrainingIntensity]: string } = {
  rest: 'No necesario. Come normal 2-3 horas antes.',
  light: 'Snack ligero: plátano + 1 rebanada pan integral (90 min antes).',
  moderate: 'Snack: plátano + galletas integrales + yogur (90 min antes).',
  high: 'Comida completa: carbos + proteína + grasas (2-3 horas antes). Ejemplo: arroz + pollo + aceite.',
  'very-high': 'PRE-ENTRENO OBLIGATORIO 90 min antes: plátano + galletas integrales + yogur. Luego, 30 min antes: miel + agua.',
};

// Recomendaciones de post-entreno
const postWorkoutRecommendations: { [key in TrainingIntensity]: string } = {
  rest: 'Comida normal. Sin prisa.',
  light: 'Snack proteico: huevos + pan (30-60 min después).',
  moderate: 'Comida con proteína y carbos: pollo + arroz (30-60 min después).',
  high: 'COMIDA POST-ENTRENO IMPORTANTE: proteína + carbos + grasas dentro de 60 min. Ejemplo: huevos + arroz + brócoli.',
  'very-high': 'POST-ENTRENO CRÍTICO: proteína + carbos simples dentro de 30 min. Ejemplo: huevos + plátano + pan. Luego, comida completa en 2-3 horas.',
};

// Notas nutricionales específicas
const nutritionNotes: { [key in TrainingIntensity]: string } = {
  rest: 'Enfócate en recuperación. Aumenta grasas saludables y micronutrientes.',
  light: 'Día de recuperación activa. Mantén hidratación normal.',
  moderate: 'Día equilibrado. Distribuye macros uniformemente.',
  high: 'Aumenta proteína un 10% respecto a base. Carbos moderados.',
  'very-high': 'DÍA MÁS EXIGENTE. Máxima proteína y carbos. Hidratación muy alta (4-5L agua). Usa inhalador 20 min antes.',
};

// Niveles de hidratación
const hydrationLevels: { [key in TrainingIntensity]: 'normal' | 'high' | 'very-high' } = {
  rest: 'normal', // 2-2.5L
  light: 'normal', // 2.5-3L
  moderate: 'high', // 3-3.5L
  high: 'high', // 3.5-4L
  'very-high': 'very-high', // 4-5L
};

/**
 * Analizar intensidad de un día de entrenamiento
 */
export function analyzeTrainingDay(dayName: string, phase: number): TrainingDayAnalysis {
  const intensity = trainingIntensityMap[dayName] || 'moderate';
  const phaseData = trainingPhases[phase - 1];
  const dayData = phaseData.days.find(d => d.name === dayName);

  return {
    dayName,
    focus: dayData?.focus || 'Entrenamiento',
    intensity,
    calorieMultiplier: calorieMultipliers[intensity],
    preWorkoutRecommendation: preWorkoutRecommendations[intensity],
    postWorkoutRecommendation: postWorkoutRecommendations[intensity],
    nutritionNotes: nutritionNotes[intensity],
    priorityMacro: intensity === 'rest' ? 'balanced' : intensity === 'very-high' ? 'protein' : 'carbs',
    hydrationLevel: hydrationLevels[intensity],
  };
}

/**
 * Calcular macros ajustados para un día específico
 */
export function calculateDayMacros(phase: number, dayName: string) {
  const baseMacros = getMacroTargets(phase);
  const analysis = analyzeTrainingDay(dayName, phase);
  const distribution = macroDistribution[analysis.intensity];

  const adjustedKcal = Math.round(baseMacros.kcal * analysis.calorieMultiplier);
  const adjustedProtein = Math.round(adjustedKcal * distribution.protein / 4);
  const adjustedCarbs = Math.round(adjustedKcal * distribution.carbs / 4);
  const adjustedFat = Math.round(adjustedKcal * distribution.fat / 9);

  return {
    kcal: adjustedKcal,
    protein: adjustedProtein,
    carbs: adjustedCarbs,
    fat: adjustedFat,
  };
}

/**
 * Generar plan nutricional semanal completo
 */
export function generateWeeklyNutritionPlan(phase: number, weekNumber: number = 1): WeeklyNutritionPlan {
  const phaseData = trainingPhases[phase - 1];
  const baseMacros = getMacroTargets(phase);

  const days = phaseData.days.map(day => {
    const training = analyzeTrainingDay(day.name, phase);
    const dayMacros = calculateDayMacros(phase, day.name);

    return {
      dayName: day.name,
      training,
      recommendedKcal: dayMacros.kcal,
      recommendedProtein: dayMacros.protein,
      recommendedCarbs: dayMacros.carbs,
      recommendedFat: dayMacros.fat,
    };
  });

  const totalWeeklyKcal = days.reduce((sum, d) => sum + d.recommendedKcal, 0);
  const totalWeeklyProtein = days.reduce((sum, d) => sum + d.recommendedProtein, 0);
  const totalWeeklyCarbs = days.reduce((sum, d) => sum + d.recommendedCarbs, 0);
  const totalWeeklyFat = days.reduce((sum, d) => sum + d.recommendedFat, 0);

  return {
    phase,
    week: weekNumber,
    days,
    totalWeeklyKcal,
    totalWeeklyProtein,
    totalWeeklyCarbs,
    totalWeeklyFat,
    averageDailyKcal: Math.round(totalWeeklyKcal / 7),
  };
}

/**
 * Obtener recomendaciones de comidas específicas para un día
 */
export function getMealRecommendationsForDay(phase: number, dayName: string) {
  const analysis = analyzeTrainingDay(dayName, phase);
  const dayMacros = calculateDayMacros(phase, dayName);

  return {
    dayName,
    intensity: analysis.intensity,
    totalKcal: dayMacros.kcal,
    totalProtein: dayMacros.protein,
    totalCarbs: dayMacros.carbs,
    totalFat: dayMacros.fat,
    preWorkout: {
      recommendation: analysis.preWorkoutRecommendation,
      timing: analysis.intensity === 'rest' ? 'N/A' : '90 minutos antes',
      kcalTarget: Math.round(dayMacros.kcal * 0.12),
      proteinTarget: Math.round(dayMacros.protein * 0.12 / 4),
      carbsTarget: Math.round(dayMacros.carbs * 0.12 / 4),
    },
    postWorkout: {
      recommendation: analysis.postWorkoutRecommendation,
      timing: analysis.intensity === 'rest' ? 'N/A' : '30-60 minutos después',
      kcalTarget: Math.round(dayMacros.kcal * 0.15),
      proteinTarget: Math.round(dayMacros.protein * 0.15 / 4),
      carbsTarget: Math.round(dayMacros.carbs * 0.15 / 4),
    },
    hydration: {
      level: analysis.hydrationLevel,
      recommendation:
        analysis.hydrationLevel === 'very-high'
          ? '4-5 litros de agua distribuidos en el día'
          : analysis.hydrationLevel === 'high'
            ? '3.5-4 litros de agua distribuidos en el día'
            : '2.5-3 litros de agua distribuidos en el día',
    },
    notes: analysis.nutritionNotes,
  };
}

/**
 * Clasificar días por tipo de entrenamiento
 */
export function classifyTrainingDays(phase: number) {
  const phaseData = trainingPhases[phase - 1];

  const classified = {
    velocidad: [] as string[],
    fuerza: [] as string[],
    resistencia: [] as string[],
    descanso: [] as string[],
  };

  phaseData.days.forEach(day => {
    const focus = day.focus.toLowerCase();

    if (focus.includes('velocidad') || focus.includes('60m') || focus.includes('aceleraciones')) {
      classified.velocidad.push(day.name);
    } else if (focus.includes('fuerza') || focus.includes('empuje') || focus.includes('tracción')) {
      classified.fuerza.push(day.name);
    } else if (focus.includes('carrera') || focus.includes('2000m') || focus.includes('aeróbica')) {
      classified.resistencia.push(day.name);
    } else if (focus.includes('descanso') || focus.includes('movilidad')) {
      classified.descanso.push(day.name);
    }
  });

  return classified;
}

/**
 * Generar resumen de la semana
 */
export function generateWeeklySummary(phase: number) {
  const plan = generateWeeklyNutritionPlan(phase);
  const classified = classifyTrainingDays(phase);

  const intensityCount = {
    'very-high': plan.days.filter(d => d.training.intensity === 'very-high').length,
    high: plan.days.filter(d => d.training.intensity === 'high').length,
    moderate: plan.days.filter(d => d.training.intensity === 'moderate').length,
    light: plan.days.filter(d => d.training.intensity === 'light').length,
    rest: plan.days.filter(d => d.training.intensity === 'rest').length,
  };

  return {
    phase,
    weeklyCalories: plan.totalWeeklyKcal,
    dailyAverage: plan.averageDailyKcal,
    weeklyProtein: plan.totalWeeklyProtein,
    weeklyCarbs: plan.totalWeeklyCarbs,
    weeklyFat: plan.totalWeeklyFat,
    trainingDistribution: classified,
    intensityDistribution: intensityCount,
    recommendation:
      intensityCount['very-high'] >= 3
        ? '⚠️ SEMANA MUY EXIGENTE: Asegura pre/post-entreno en todos los días intensos. Hidratación máxima.'
        : intensityCount['very-high'] === 2 && intensityCount.high >= 2
          ? '💪 SEMANA EQUILIBRADA: Mezcla de intensidad. Mantén consistencia nutricional.'
          : '✅ SEMANA MODERADA: Recuperación adecuada. Aprovecha para consolidar técnica.',
  };
}
