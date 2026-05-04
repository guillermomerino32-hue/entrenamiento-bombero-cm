export interface Food {
  id: string;
  name: string;
  category: 'protein' | 'carbs' | 'fat' | 'vegetable' | 'fruit' | 'dairy';
  serving: string; // e.g., "100g", "1 unit"
  kcal: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  price?: number; // euros, approximate
  notes?: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string; // e.g., "7:30", "14:00"
  mealType: 'breakfast' | 'snack' | 'lunch' | 'pre-workout' | 'post-workout' | 'dinner';
  foods: Food[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface DailyMenu {
  date: string;
  phase: number;
  dayOfWeek: string;
  meals: Meal[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

// Proteínas
export const proteinFoods: Food[] = [
  {
    id: 'prot-1',
    name: 'Pechuga de pollo a la plancha',
    category: 'protein',
    serving: '100g',
    kcal: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    price: 0.8,
    notes: 'Bajo en grasas, versátil',
  },
  {
    id: 'prot-2',
    name: 'Pavo a la plancha',
    category: 'protein',
    serving: '100g',
    kcal: 135,
    protein: 29,
    carbs: 0,
    fat: 1.3,
    price: 1.2,
    notes: 'Más magro que pollo',
  },
  {
    id: 'prot-3',
    name: 'Huevos (1 unidad)',
    category: 'protein',
    serving: '1 unidad',
    kcal: 70,
    protein: 6,
    carbs: 0.6,
    fat: 5,
    price: 0.15,
    notes: 'Proteína completa, económico',
  },
  {
    id: 'prot-4',
    name: 'Claras de huevo',
    category: 'protein',
    serving: '1 unidad',
    kcal: 17,
    protein: 3.6,
    carbs: 0.4,
    fat: 0.1,
    price: 0.1,
    notes: 'Proteína pura sin grasas',
  },
  {
    id: 'prot-5',
    name: 'Atún en lata (al natural)',
    category: 'protein',
    serving: '100g',
    kcal: 96,
    protein: 21,
    carbs: 0,
    fat: 0.8,
    price: 0.6,
    notes: 'Práctico, larga duración',
  },
  {
    id: 'prot-6',
    name: 'Merluza al horno',
    category: 'protein',
    serving: '150g',
    kcal: 135,
    protein: 28,
    carbs: 0,
    fat: 1.5,
    price: 2,
    notes: 'Pescado blanco magro',
  },
  {
    id: 'prot-7',
    name: 'Sardinas en lata (al natural)',
    category: 'protein',
    serving: '100g',
    kcal: 135,
    protein: 18,
    carbs: 0,
    fat: 6,
    price: 0.8,
    notes: 'Omega-3, económico',
  },
  {
    id: 'prot-8',
    name: 'Lentejas cocidas',
    category: 'protein',
    serving: '200g',
    kcal: 230,
    protein: 18,
    carbs: 40,
    fat: 0.4,
    price: 0.5,
    notes: 'Proteína vegetal + carbos',
  },
  {
    id: 'prot-9',
    name: 'Garbanzos cocidos',
    category: 'protein',
    serving: '200g',
    kcal: 270,
    protein: 15,
    carbs: 45,
    fat: 4,
    price: 0.6,
    notes: 'Proteína vegetal + carbos',
  },
  {
    id: 'prot-10',
    name: 'Tofu',
    category: 'protein',
    serving: '120g',
    kcal: 95,
    protein: 15,
    carbs: 1.5,
    fat: 5,
    price: 1.5,
    notes: 'Proteína vegana',
  },
  {
    id: 'prot-11',
    name: 'Queso fresco batido',
    category: 'dairy',
    serving: '100g',
    kcal: 110,
    protein: 14,
    carbs: 3,
    fat: 5,
    price: 1,
    notes: 'Proteína láctea',
  },
  {
    id: 'prot-12',
    name: 'Yogur natural sin azúcar',
    category: 'dairy',
    serving: '125g',
    kcal: 80,
    protein: 10,
    carbs: 3.5,
    fat: 0.4,
    price: 0.4,
    notes: 'Probióticos, proteína',
  },
];

// Carbohidratos
export const carbFoods: Food[] = [
  {
    id: 'carb-1',
    name: 'Arroz blanco cocido',
    category: 'carbs',
    serving: '100g',
    kcal: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    price: 0.3,
    notes: 'Absorción rápida',
  },
  {
    id: 'carb-2',
    name: 'Pasta integral cocida',
    category: 'carbs',
    serving: '100g',
    kcal: 124,
    protein: 4.3,
    carbs: 25,
    fat: 0.5,
    price: 0.4,
    notes: 'Más fibra que blanca',
  },
  {
    id: 'carb-3',
    name: 'Pan integral',
    category: 'carbs',
    serving: '1 rebanada (40g)',
    kcal: 100,
    protein: 3.5,
    carbs: 18,
    fat: 1,
    price: 0.2,
    notes: 'Fibra, saciante',
  },
  {
    id: 'carb-4',
    name: 'Avena en copos (cruda)',
    category: 'carbs',
    serving: '40g',
    kcal: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    price: 0.3,
    notes: 'Beta-glucanos, saciante',
  },
  {
    id: 'carb-5',
    name: 'Patata cocida',
    category: 'carbs',
    serving: '150g',
    kcal: 117,
    protein: 2.1,
    carbs: 26,
    fat: 0.1,
    price: 0.3,
    notes: 'Almidón resistente',
  },
  {
    id: 'carb-6',
    name: 'Plátano mediano',
    category: 'fruit',
    serving: '1 unidad (~100g)',
    kcal: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    price: 0.3,
    notes: 'Potasio, glucosa rápida',
  },
  {
    id: 'carb-7',
    name: 'Manzana mediana',
    category: 'fruit',
    serving: '1 unidad (~150g)',
    kcal: 80,
    protein: 0.4,
    carbs: 21,
    fat: 0.2,
    price: 0.4,
    notes: 'Fibra, vitaminas',
  },
  {
    id: 'carb-8',
    name: 'Naranja grande',
    category: 'fruit',
    serving: '1 unidad (~200g)',
    kcal: 86,
    protein: 1.7,
    carbs: 21,
    fat: 0.2,
    price: 0.3,
    notes: 'Vitamina C',
  },
  {
    id: 'carb-9',
    name: 'Galletas integrales de avena',
    category: 'carbs',
    serving: '5 unidades (~50g)',
    kcal: 200,
    protein: 4,
    carbs: 30,
    fat: 7,
    price: 0.5,
    notes: 'Pre-entreno rápido',
  },
  {
    id: 'carb-10',
    name: 'Miel',
    category: 'carbs',
    serving: '15g (1 cucharada)',
    kcal: 49,
    protein: 0.1,
    carbs: 13,
    fat: 0,
    price: 0.2,
    notes: 'Glucosa rápida',
  },
];

// Grasas
export const fatFoods: Food[] = [
  {
    id: 'fat-1',
    name: 'Aceite de oliva virgen',
    category: 'fat',
    serving: '15ml (1 cucharada)',
    kcal: 135,
    protein: 0,
    carbs: 0,
    fat: 15,
    price: 0.3,
    notes: 'Oleico, antiinflamatorio',
  },
  {
    id: 'fat-2',
    name: 'Mantequilla de cacahuete',
    category: 'fat',
    serving: '20g (1 cucharada)',
    kcal: 190,
    protein: 7,
    carbs: 7,
    fat: 16,
    price: 0.5,
    notes: 'Proteína + grasas',
  },
  {
    id: 'fat-3',
    name: 'Frutos secos (almendras, nueces)',
    category: 'fat',
    serving: '25g (~5 unidades)',
    kcal: 160,
    protein: 5.5,
    carbs: 6,
    fat: 14,
    price: 0.8,
    notes: 'Omega-3, saciantes',
  },
  {
    id: 'fat-4',
    name: 'Aguacate mediano',
    category: 'fat',
    serving: '1/3 unidad (~60g)',
    kcal: 100,
    protein: 1.3,
    carbs: 5,
    fat: 9,
    price: 0.8,
    notes: 'Potasio, grasas insaturadas',
  },
  {
    id: 'fat-5',
    name: 'Leche entera',
    category: 'dairy',
    serving: '250ml (1 vaso)',
    kcal: 160,
    protein: 7.7,
    carbs: 11.5,
    fat: 8,
    price: 0.4,
    notes: 'Calcio, proteína',
  },
];

// Verduras
export const vegetableFoods: Food[] = [
  {
    id: 'veg-1',
    name: 'Brócoli cocido',
    category: 'vegetable',
    serving: '150g',
    kcal: 51,
    protein: 3.7,
    carbs: 9.2,
    fat: 0.6,
    price: 0.6,
    notes: 'Bajo en calorías, vitaminas',
  },
  {
    id: 'veg-2',
    name: 'Espinacas salteadas',
    category: 'vegetable',
    serving: '100g',
    kcal: 23,
    protein: 2.7,
    carbs: 3.6,
    fat: 0.4,
    price: 0.5,
    notes: 'Hierro, bajo en calorías',
  },
  {
    id: 'veg-3',
    name: 'Ensalada mixta (tomate, lechuga, pepino)',
    category: 'vegetable',
    serving: '200g',
    kcal: 32,
    protein: 1.5,
    carbs: 6,
    fat: 0.4,
    price: 0.8,
    notes: 'Fibra, hidratación',
  },
  {
    id: 'veg-4',
    name: 'Zanahoria cocida',
    category: 'vegetable',
    serving: '100g',
    kcal: 41,
    protein: 0.9,
    carbs: 10,
    fat: 0.2,
    price: 0.3,
    notes: 'Beta-caroteno',
  },
  {
    id: 'veg-5',
    name: 'Calabacín al horno',
    category: 'vegetable',
    serving: '150g',
    kcal: 24,
    protein: 1.5,
    carbs: 3.5,
    fat: 0.4,
    price: 0.5,
    notes: 'Muy bajo en calorías',
  },
];

// Todas las comidas
export const allFoods = [...proteinFoods, ...carbFoods, ...fatFoods, ...vegetableFoods];

// Equivalencias de intercambio
export const foodEquivalences = [
  {
    group: 'Proteína (100g)',
    equivalents: [
      { food: 'Pechuga de pollo', amount: '100g' },
      { food: 'Pavo', amount: '100g' },
      { food: 'Huevos', amount: '4 claras' },
      { food: 'Atún en lata', amount: '1 lata grande (~160g)' },
      { food: 'Tofu', amount: '120g' },
    ],
  },
  {
    group: 'Carbohidratos (100g crudo)',
    equivalents: [
      { food: 'Arroz blanco', amount: '100g crudo' },
      { food: 'Pasta', amount: '100g crudo' },
      { food: 'Patata cocida', amount: '400g' },
      { food: 'Avena', amount: '100g' },
      { food: 'Pan integral', amount: '120g (~3 rebanadas)' },
      { food: 'Lentejas cocidas', amount: '200g' },
    ],
  },
  {
    group: 'Grasas (15ml aceite)',
    equivalents: [
      { food: 'Aceite de oliva', amount: '15ml' },
      { food: 'Frutos secos', amount: '15g' },
      { food: 'Mantequilla de cacahuete', amount: '15g' },
      { food: 'Aguacate', amount: '1/3 mediano' },
    ],
  },
];

// Fases de dieta (importadas de trainingPlan)
export const dietPhases = [
  {
    phase: 1,
    name: 'FASE 1 — ADAPTACIÓN',
    weeks: 'Semanas 1–8',
    macros: { kcal: 2800, protein: 150, carbs: 390, fat: 75 },
  },
  {
    phase: 2,
    name: 'FASE 2 — DESARROLLO',
    weeks: 'Semanas 9–20',
    macros: { kcal: 2950, protein: 158, carbs: 415, fat: 80 },
  },
  {
    phase: 3,
    name: 'FASE 3 — ESPECIALIZACIÓN',
    weeks: 'Semanas 21–36',
    macros: { kcal: 3100, protein: 168, carbs: 435, fat: 85 },
  },
  {
    phase: 4,
    name: 'FASE 4 — PICO DE FORMA',
    weeks: 'Semanas 37–44 · Tapering 45–48',
    macros: { kcal: 2900, protein: 162, carbs: 400, fat: 78 },
  },
];

// Plantillas de comidas tipo
export const mealTemplates = {
  breakfast: [
    {
      name: 'Desayuno Proteico + Carbos',
      foods: [
        { name: 'Avena en copos', amount: '80g' },
        { name: 'Leche entera', amount: '250ml' },
        { name: 'Plátano mediano', amount: '1 unidad' },
        { name: 'Miel', amount: '10g' },
      ],
    },
    {
      name: 'Desayuno Clásico',
      foods: [
        { name: 'Pan integral', amount: '3 rebanadas' },
        { name: 'Queso fresco batido', amount: '100g' },
        { name: 'Huevos revueltos', amount: '2 unidades' },
        { name: 'Naranja', amount: '1 grande' },
      ],
    },
  ],
  preWorkout: [
    {
      name: 'Pre-Entreno Velocidad',
      foods: [
        { name: 'Plátano grande', amount: '1 unidad' },
        { name: 'Galletas integrales de avena', amount: '5 unidades' },
        { name: 'Yogur natural sin azúcar', amount: '125g' },
      ],
    },
    {
      name: 'Pre-Entreno Fuerza',
      foods: [
        { name: 'Pan integral tostado', amount: '3 rebanadas' },
        { name: 'Mantequilla de cacahuete', amount: '20g' },
        { name: 'Manzana grande', amount: '1 unidad' },
      ],
    },
  ],
  postWorkout: [
    {
      name: 'Post-Entreno Recuperación',
      foods: [
        { name: 'Huevos revueltos', amount: '3 unidades' },
        { name: 'Arroz blanco cocido', amount: '100g' },
        { name: 'Brócoli salteado', amount: '150g' },
        { name: 'Aceite de oliva', amount: '10ml' },
      ],
    },
  ],
  lunch: [
    {
      name: 'Comida Clásica Bombero',
      foods: [
        { name: 'Arroz blanco', amount: '150g crudo' },
        { name: 'Pechuga de pollo a la plancha', amount: '200g' },
        { name: 'Ensalada mixta', amount: '200g' },
        { name: 'Aceite de oliva', amount: '15ml' },
      ],
    },
    {
      name: 'Comida Legumbres',
      foods: [
        { name: 'Lentejas cocidas', amount: '200g' },
        { name: 'Pechuga de pollo', amount: '150g' },
        { name: 'Espinacas salteadas', amount: '100g' },
        { name: 'Aceite de oliva', amount: '15ml' },
      ],
    },
  ],
  snack: [
    {
      name: 'Snack Proteico',
      foods: [
        { name: 'Huevos duros', amount: '2 unidades' },
        { name: 'Pan integral', amount: '2 rebanadas' },
      ],
    },
    {
      name: 'Snack Frutas + Frutos Secos',
      foods: [
        { name: 'Manzana mediana', amount: '1 unidad' },
        { name: 'Frutos secos', amount: '25g' },
      ],
    },
  ],
  dinner: [
    {
      name: 'Cena Ligera Proteica',
      foods: [
        { name: 'Merluza al horno', amount: '150g' },
        { name: 'Verduras al horno', amount: '200g' },
        { name: 'Pan integral', amount: '2 rebanadas' },
        { name: 'Aceite de oliva', amount: '10ml' },
      ],
    },
  ],
};
