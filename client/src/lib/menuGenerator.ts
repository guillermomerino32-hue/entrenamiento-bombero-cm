import { Food, Meal, DailyMenu, mealTemplates, allFoods, dietPhases } from '@/data/foodDatabase';
import { trainingPhases } from '@/data/trainingPlan';

export interface MenuGeneratorOptions {
  phase: number;
  dayOfWeek: string;
  preferences?: {
    vegetarian?: boolean;
    excludeFoods?: string[];
    preferredProteins?: string[];
    maxPrice?: number;
  };
}

export interface MacroTarget {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Calcular macros totales de una comida
export function calculateMealMacros(foods: Food[]) {
  return {
    kcal: foods.reduce((sum, f) => sum + f.kcal, 0),
    protein: foods.reduce((sum, f) => sum + f.protein, 0),
    carbs: foods.reduce((sum, f) => sum + f.carbs, 0),
    fat: foods.reduce((sum, f) => sum + f.fat, 0),
  };
}

// Calcular macros totales del día
export function calculateDailyMacros(meals: Meal[]) {
  return {
    kcal: meals.reduce((sum, m) => sum + m.totalKcal, 0),
    protein: meals.reduce((sum, m) => sum + m.totalProtein, 0),
    carbs: meals.reduce((sum, m) => sum + m.totalCarbs, 0),
    fat: meals.reduce((sum, m) => sum + m.totalFat, 0),
  };
}

// Obtener objetivos de macros para una fase
export function getMacroTargets(phase: number): MacroTarget {
  const dietPhase = dietPhases[phase - 1];
  return {
    kcal: dietPhase.macros.kcal,
    protein: dietPhase.macros.protein,
    carbs: dietPhase.macros.carbs,
    fat: dietPhase.macros.fat,
  };
}

// Generar comida basada en macros objetivo
export function generateMealForMacros(
  targetKcal: number,
  targetProtein: number,
  targetCarbs: number,
  targetFat: number,
  mealType: string,
  preferences?: MenuGeneratorOptions['preferences']
): Meal {
  // Usar plantillas como base
  const templates = (mealTemplates as any)[mealType] || [];
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];

  const foods: Food[] = [];
  let currentMacros = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

  if (selectedTemplate) {
    // Construir comida a partir de plantilla
    selectedTemplate.foods.forEach((item: any) => {
      const food = allFoods.find(f => f.name.toLowerCase() === item.name.toLowerCase());
      if (food && (!preferences?.excludeFoods?.includes(food.id))) {
        foods.push(food);
        currentMacros.kcal += food.kcal;
        currentMacros.protein += food.protein;
        currentMacros.carbs += food.carbs;
        currentMacros.fat += food.fat;
      }
    });
  }

  return {
    id: `meal-${Date.now()}`,
    name: selectedTemplate?.name || `Comida ${mealType}`,
    time: getMealTime(mealType),
    mealType: mealType as any,
    foods,
    totalKcal: currentMacros.kcal,
    totalProtein: currentMacros.protein,
    totalCarbs: currentMacros.carbs,
    totalFat: currentMacros.fat,
  };
}

// Obtener hora típica de comida
function getMealTime(mealType: string): string {
  const times: { [key: string]: string } = {
    breakfast: '7:30',
    snack: '11:00',
    lunch: '14:00',
    'pre-workout': '19:30',
    'post-workout': '21:30',
    dinner: '21:00',
  };
  return times[mealType] || '12:00';
}

// Generar menú diario completo
export function generateDailyMenu(options: MenuGeneratorOptions): DailyMenu {
  const macroTargets = getMacroTargets(options.phase);
  const phase = trainingPhases[options.phase - 1];
  const dayData = phase.days.find(d => d.name === options.dayOfWeek);

  // Determinar estructura de comidas según el día
  const mealStructure = determineMealStructure(options.dayOfWeek);

  // Distribuir macros entre comidas
  const mealMacroTargets = distributeMacros(macroTargets, mealStructure);

  // Generar cada comida
  const meals: Meal[] = mealStructure.map((mealType, idx) => {
    const targets = mealMacroTargets[idx];
    return generateMealForMacros(
      targets.kcal,
      targets.protein,
      targets.carbs,
      targets.fat,
      mealType,
      options.preferences
    );
  });

  const dailyMacros = calculateDailyMacros(meals);

  return {
    date: new Date().toISOString().split('T')[0],
    phase: options.phase,
    dayOfWeek: options.dayOfWeek,
    meals,
    totalKcal: dailyMacros.kcal,
    totalProtein: dailyMacros.protein,
    totalCarbs: dailyMacros.carbs,
    totalFat: dailyMacros.fat,
  };
}

// Determinar estructura de comidas según el día
function determineMealStructure(dayOfWeek: string): string[] {
  // Días de entrenamiento intenso: más comidas
  const intenseDays = ['MARTES', 'JUEVES', 'SÁBADO'];
  
  if (intenseDays.includes(dayOfWeek)) {
    return ['breakfast', 'snack', 'lunch', 'pre-workout', 'post-workout', 'snack'];
  }
  
  // Viernes (descanso activo): menos comidas
  if (dayOfWeek === 'VIERNES') {
    return ['breakfast', 'snack', 'lunch', 'snack', 'dinner'];
  }
  
  // Días normales
  return ['breakfast', 'snack', 'lunch', 'pre-workout', 'post-workout', 'dinner'];
}

// Distribuir macros entre comidas
function distributeMacros(
  targets: MacroTarget,
  mealStructure: string[]
): MacroTarget[] {
  const distribution: { [key: string]: number } = {
    breakfast: 0.25,
    snack: 0.08,
    lunch: 0.35,
    'pre-workout': 0.12,
    'post-workout': 0.15,
    dinner: 0.2,
  };

  return mealStructure.map(mealType => ({
    kcal: Math.round(targets.kcal * (distribution[mealType] || 0.15)),
    protein: Math.round(targets.protein * (distribution[mealType] || 0.15)),
    carbs: Math.round(targets.carbs * (distribution[mealType] || 0.15)),
    fat: Math.round(targets.fat * (distribution[mealType] || 0.15)),
  }));
}

// Calcular diferencia de macros
export function calculateMacroDifference(actual: MacroTarget, target: MacroTarget) {
  return {
    kcal: {
      value: actual.kcal - target.kcal,
      percent: ((actual.kcal - target.kcal) / target.kcal) * 100,
    },
    protein: {
      value: actual.protein - target.protein,
      percent: ((actual.protein - target.protein) / target.protein) * 100,
    },
    carbs: {
      value: actual.carbs - target.carbs,
      percent: ((actual.carbs - target.carbs) / target.carbs) * 100,
    },
    fat: {
      value: actual.fat - target.fat,
      percent: ((actual.fat - target.fat) / target.fat) * 100,
    },
  };
}

// Generar lista de compra
export function generateShoppingList(menu: DailyMenu): { [key: string]: number } {
  const shoppingList: { [key: string]: number } = {};

  menu.meals.forEach(meal => {
    meal.foods.forEach(food => {
      const key = `${food.name} (${food.serving})`;
      shoppingList[key] = (shoppingList[key] || 0) + 1;
    });
  });

  return shoppingList;
}

// Exportar menú como texto
export function exportMenuAsText(menu: DailyMenu): string {
  let text = `MENÚ DIARIO - ${menu.dayOfWeek} (Fase ${menu.phase})\n`;
  text += `${'='.repeat(60)}\n\n`;

  menu.meals.forEach(meal => {
    text += `${meal.time} - ${meal.name.toUpperCase()}\n`;
    text += `${'-'.repeat(40)}\n`;
    meal.foods.forEach(food => {
      text += `  • ${food.name} (${food.serving})\n`;
    });
    text += `  Macros: ${meal.totalKcal} kcal | P: ${meal.totalProtein}g | C: ${meal.totalCarbs}g | F: ${meal.totalFat}g\n\n`;
  });

  text += `${'='.repeat(60)}\n`;
  text += `TOTAL DIARIO\n`;
  text += `Calorías: ${menu.totalKcal} kcal\n`;
  text += `Proteína: ${menu.totalProtein}g\n`;
  text += `Carbohidratos: ${menu.totalCarbs}g\n`;
  text += `Grasas: ${menu.totalFat}g\n`;

  return text;
}

// Sugerir intercambios de alimentos
export function suggestFoodSwaps(food: Food, preferences?: MenuGeneratorOptions['preferences']): Food[] {
  // Encontrar alimentos con macros similares
  const similar = allFoods.filter(f => {
    if (f.id === food.id) return false;
    if (preferences?.excludeFoods?.includes(f.id)) return false;
    
    // Misma categoría o similar
    const sameMacroRange =
      Math.abs(f.protein - food.protein) < 3 &&
      Math.abs(f.carbs - food.carbs) < 5 &&
      Math.abs(f.fat - food.fat) < 3;
    
    return sameMacroRange;
  });

  return similar.slice(0, 3); // Retornar top 3 opciones
}
