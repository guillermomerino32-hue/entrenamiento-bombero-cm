export interface Exercise {
  id: string;
  name: string;
  detail: string;
  sets?: string;
  reps?: string;
  duration?: string;
  notes?: string;
  progression?: string;
}

export interface TrainingBlock {
  title: string;
  type: 'warmup' | 'strength' | 'cardio' | 'cooldown' | 'special';
  exercises: Exercise[];
}

export interface TrainingDay {
  id: string;
  name: string;
  focus: string;
  blocks: TrainingBlock[];
}

export interface Phase {
  id: number;
  name: string;
  weeks: string;
  objective: string;
  advanceCriteria: string;
  days: TrainingDay[];
}

export interface DietMacro {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPhase {
  phase: number;
  name: string;
  weeks: string;
  macros: DietMacro;
  description: string;
  note: string;
}

export const trainingPhases: Phase[] = [
  {
    id: 1,
    name: 'FASE 1 — ADAPTACIÓN',
    weeks: 'Semanas 1–8',
    objective: 'Construir base aeróbica sólida, fortalecer rodillas y articulaciones, aprender técnica básica de todos los ejercicios.',
    advanceCriteria: 'Trota 20 min continuos · 15 flexiones completas seguidas · Dead hang 20 segundos · Sin dolor de rodilla',
    days: [
      {
        id: 'lun-1',
        name: 'LUNES',
        focus: 'Fortalecimiento Rodillas + Tracción (prep. trepa)',
        blocks: [
          {
            title: '⚠️ ANTES DE COMENZAR',
            type: 'warmup',
            exercises: [
              {
                id: 'inh-1',
                name: 'Inhalador de rescate',
                detail: '2 puffs, 20 minutos ANTES de iniciar. Si hace frío o viento, cúbrete nariz al salir.',
              },
            ],
          },
          {
            title: '🔥 CALENTAMIENTO (12 min)',
            type: 'warmup',
            exercises: [
              {
                id: 'warm-1',
                name: 'Caminata rápida',
                detail: '5 min a paso vivo. El cuerpo empieza a calentar sin impacto.',
              },
              {
                id: 'warm-2',
                name: 'Rotaciones articulares',
                detail: 'Tobillos (10 c/lado) → Rodillas (10 c/lado) → Caderas (10 círculos) → Hombros (10 adelante + 10 atrás). 2 min.',
              },
              {
                id: 'warm-3',
                name: 'Movilidad dinámica',
                detail: 'Elevaciones de rodilla caminando (10 c/pierna) · Giros de torso (10 c/lado) · Balanceo lateral de pierna (10 c/pierna). 3 min.',
              },
              {
                id: 'warm-4',
                name: 'Trote muy suave',
                detail: '2 min a ritmo conversacional. Si notas el pecho, camina.',
              },
            ],
          },
          {
            title: '🦵 BLOQUE A — RODILLAS (fortalecimiento)',
            type: 'strength',
            exercises: [
              {
                id: 'leg-1',
                name: 'Sentadilla isométrica en pared',
                detail: 'Espalda en pared, muslos paralelos al suelo',
                sets: '4',
                duration: '30"',
                progression: 'Sem 3-4 → 40" · Sem 5-6 → 50" · Sem 7-8 → 60"',
              },
              {
                id: 'leg-2',
                name: 'Extensión de pierna tumbado (sin peso)',
                detail: 'Tumbado boca arriba, elevar pierna extendida 30 cm',
                sets: '3',
                reps: '15 c/pierna',
              },
              {
                id: 'leg-3',
                name: 'Puente de glúteos',
                detail: 'Tumbado, pies en suelo, elevar cadera',
                sets: '3',
                reps: '20',
              },
              {
                id: 'leg-4',
                name: 'Paso lateral (sin banda)',
                detail: 'Piernas semiflexionadas, pasos laterales controlados',
                sets: '3',
                reps: '15 c/lado',
              },
              {
                id: 'leg-5',
                name: 'Elevación de talones de pie',
                detail: 'Subir y bajar sobre la punta del pie, lento y controlado',
                sets: '3',
                reps: '20',
              },
            ],
          },
          {
            title: '💪 BLOQUE B — TRACCIÓN (prep. trepa sin cuerda)',
            type: 'strength',
            exercises: [
              {
                id: 'pull-1',
                name: 'Dead hang (barra de parque / marco puerta)',
                detail: 'Cuelga, hombros activados (no dejar caer trapecios)',
                sets: '3',
                duration: '12"',
                progression: 'Sem 3-4 → 18" · Sem 7-8 → 25"',
              },
              {
                id: 'pull-2',
                name: 'Dominadas isométricas o Remo invertido en parque',
                detail: 'Cuerpo inclinado 45°, tira llevando codos atrás',
                sets: '3',
                reps: '8',
              },
              {
                id: 'pull-3',
                name: 'Retracción escapular de pie',
                detail: 'Brazos semiestirados, aprieta escápulas hacia atrás y abajo',
                sets: '3',
                reps: '20',
              },
              {
                id: 'pull-4',
                name: 'Superman (boca abajo)',
                detail: 'Tumbado, elevar simultáneamente brazos y piernas, pausa 1" arriba',
                sets: '3',
                reps: '12',
              },
            ],
          },
          {
            title: '🧘 VUELTA A LA CALMA (8 min)',
            type: 'cooldown',
            exercises: [
              {
                id: 'cool-1',
                name: 'Estiramientos pierna',
                detail: 'Cuádriceps (30" c/pierna) · Isquiotibiales (30" c/pierna) · Gemelo (30" c/pierna) · Glúteo figura-4 (30" c/lado)',
              },
              {
                id: 'cool-2',
                name: 'Estiramientos hombro y espalda',
                detail: 'Hombro cruzado (20" c/lado) · Child\'s pose (45") · Rotación torácica (5 c/lado)',
              },
              {
                id: 'cool-3',
                name: 'Respiración diafragmática',
                detail: '10 respiraciones: inhala 4" por nariz llenando barriga, exhala 6" por boca.',
              },
            ],
          },
        ],
      },
      {
        id: 'mar-1',
        name: 'MARTES',
        focus: 'Carrera Aeróbica + Técnica de Carrera',
        blocks: [
          {
            title: '⚠️ ANTES DE COMENZAR',
            type: 'warmup',
            exercises: [
              {
                id: 'inh-2',
                name: 'Inhalador de rescate',
                detail: '2 puffs, 20 minutos ANTES. Hoy corremos, es especialmente importante.',
              },
            ],
          },
          {
            title: '🔥 CALENTAMIENTO (10 min)',
            type: 'warmup',
            exercises: [
              {
                id: 'warm-5',
                name: 'Caminata 5 min',
                detail: 'Paso progresivamente más rápido.',
              },
              {
                id: 'warm-6',
                name: 'Movilidad dinámica caderas y tobillos',
                detail: 'Círculos de cadera (10 c/lado) · Rotación de tobillo (10 c/pie) · Balanceo frontal de pierna (10 c/pierna)',
              },
              {
                id: 'warm-7',
                name: 'Skipping bajo',
                detail: '2×15 pasos: eleva rodillas al 50%, sin saltar, con ritmo.',
              },
              {
                id: 'warm-8',
                name: 'Talones a glúteos',
                detail: '2×15 pasos: llevar talón atrás, sin impacto.',
              },
            ],
          },
          {
            title: '🏃 SESIÓN PRINCIPAL — CARRERA AERÓBICA',
            type: 'cardio',
            exercises: [
              {
                id: 'run-1',
                name: 'Intervalos caminata–carrera (Sem 1–2)',
                detail: '30" carrera suave + 60" caminata · Repetir 15 veces · Total: ~22 min',
                reps: '15 series',
              },
              {
                id: 'run-2',
                name: 'Intervalos progresivos (Sem 3–4)',
                detail: '45" carrera + 60" caminata · Repetir 15 veces',
                reps: '15 series',
              },
              {
                id: 'run-3',
                name: 'Carrera larga con pausa (Sem 5–6)',
                detail: '60" carrera + 45" caminata · Repetir 12 veces · Total: ~21 min',
                reps: '12 series',
              },
              {
                id: 'run-4',
                name: 'Trote continuo (Sem 7–8)',
                detail: '20–25 min sin parar · Ritmo conversacional',
                duration: '20–25 min',
                progression: 'Meta de fase: 20 min sin parar',
              },
            ],
          },
          {
            title: '🧘 VUELTA A LA CALMA',
            type: 'cooldown',
            exercises: [
              {
                id: 'cool-4',
                name: 'Caminata 5 min',
                detail: 'Baja la frecuencia cardíaca de forma gradual.',
              },
              {
                id: 'cool-5',
                name: 'Estiramientos de pierna completos',
                detail: 'Cuádriceps · Isquiotibiales · Gemelo · Flexores de cadera · Banda iliotibial. 30" c/u.',
              },
            ],
          },
        ],
      },
      {
        id: 'mie-1',
        name: 'MIÉRCOLES',
        focus: 'Empuje (prep. Peso 40kg) + Core + Natación en Seco',
        blocks: [
          {
            title: '⚠️ ANTES DE COMENZAR',
            type: 'warmup',
            exercises: [
              {
                id: 'inh-3',
                name: 'Inhalador de rescate',
                detail: '2 puffs, 20 min ANTES. Esfuerzo de empuje requiere pecho activo.',
              },
            ],
          },
          {
            title: '🔥 CALENTAMIENTO (10 min)',
            type: 'warmup',
            exercises: [
              {
                id: 'warm-9',
                name: 'Caminata 4 min + movilidad general',
                detail: 'Círculos de hombro, giros de torso, cat-cow × 10',
              },
              {
                id: 'warm-10',
                name: 'Activación pectoral y tríceps',
                detail: 'Aplauso frente al pecho (20 rep) · Empuje de pared con carga progresiva (10 rep)',
              },
            ],
          },
          {
            title: '💪 BLOQUE A — EMPUJE (press peso 40kg sin equipamiento)',
            type: 'strength',
            exercises: [
              {
                id: 'push-1',
                name: 'Flexiones en rodillas (Sem 1–2)',
                detail: 'Espalda recta, bajar hasta tocar el pecho',
                sets: '4',
                reps: '8–10',
              },
              {
                id: 'push-2',
                name: 'Flexiones completas (Sem 3–4)',
                detail: 'Cuerpo como tabla, pecho toca el suelo',
                sets: '4',
                reps: '6–8',
              },
              {
                id: 'push-3',
                name: 'Flexiones completas + declinadas (Sem 5–6)',
                detail: 'Flexiones completas: 4×10 · Flex. con pies en la pared (30°): 3×6',
                sets: '4',
                reps: '10',
              },
              {
                id: 'push-4',
                name: 'Volumen de empuje (Sem 7–8)',
                detail: 'Flexiones completas: 5×12 · Pike push-up (para hombros): 3×8 · Flex. diamante: 3×8',
                sets: '5',
                reps: '12',
              },
            ],
          },
          {
            title: '🧲 BLOQUE B — CORE',
            type: 'strength',
            exercises: [
              {
                id: 'core-1',
                name: 'Plancha frontal',
                detail: 'Aprieta glúteos y abdomen, no dejes caer la cadera',
                sets: '3',
                duration: '20–30"',
                progression: 'Cada semana suma 5"',
              },
              {
                id: 'core-2',
                name: 'Crunches con pausa',
                detail: 'Pausa 1" arriba, baja controlado',
                sets: '3',
                reps: '15',
              },
              {
                id: 'core-3',
                name: 'Bird-dog',
                detail: 'Brazo derecho + pierna izquierda, mantén 2"',
                sets: '3',
                reps: '10 c/lado',
              },
              {
                id: 'core-4',
                name: 'Hollow body hold',
                detail: 'Tumbado, espalda baja pegada al suelo, brazos y piernas elevados',
                sets: '3',
                duration: '15"',
              },
              {
                id: 'core-5',
                name: 'Mountain climbers lentos',
                detail: 'Llevar rodilla al pecho lentamente, core apretado',
                sets: '3',
                reps: '10 c/pierna',
              },
            ],
          },
          {
            title: '🧲 BLOQUE C — CORE ROTACIONAL Y DORSAL (Prep. Trepa)',
            type: 'special',
            exercises: [
              {
                id: 'rot-1',
                name: 'Pull-over isométrico con toalla/goma (fuerza dorsal)',
                detail: '2 series × 15 adelante + 15 atrás · Amplitud máxima, despacio',
                sets: '2',
                reps: '15+15',
              },
              {
                id: 'rot-2',
                name: 'Rotaciones rusas lentas (Core rotacional)',
                detail: '3 series × 12 ciclos · Simula la brazada de braza: brazos adelante → apertura → entrada agua.',
                sets: '3',
                reps: '12',
              },
              {
                id: 'rot-3',
                name: 'Apneas dinámicas controladas (caminando)',
                detail: '5 ciclos completos: inhala 4" llenando pulmones, retén 2", exhala lenta 6" por boca.',
                reps: '5 ciclos',
              },
              {
                id: 'rot-4',
                name: 'Movilidad torácica en rotación',
                detail: 'Posición 4 apoyos, rotar llevando codo al techo',
                sets: '2',
                reps: '10 c/lado',
              },
            ],
          },
          {
            title: '🧘 VUELTA A LA CALMA',
            type: 'cooldown',
            exercises: [
              {
                id: 'cool-6',
                name: 'Pectoral en marco de puerta',
                detail: 'Apoya el antebrazo en el marco, gira el torso. 30" c/lado.',
              },
              {
                id: 'cool-7',
                name: 'Estiramiento hombros y tríceps',
                detail: 'Hombro cruzado 20" c/lado · Tríceps con brazo doblado 20" c/lado',
              },
              {
                id: 'cool-8',
                name: 'Child\'s pose',
                detail: '45 segundos respirando profundamente',
              },
            ],
          },
        ],
      },
      {
        id: 'jue-1',
        name: 'JUEVES',
        focus: 'Carrera Aeróbica + Primeras Aceleraciones',
        blocks: [
          {
            title: '⚠️ ANTES DE COMENZAR',
            type: 'warmup',
            exercises: [
              {
                id: 'inh-4',
                name: 'Inhalador de rescate',
                detail: '2 puffs, 20 min ANTES. Las aceleraciones elevan bruscamente la demanda respiratoria.',
              },
            ],
          },
          {
            title: '🔥 CALENTAMIENTO ESPECÍFICO DE CARRERA (12 min)',
            type: 'warmup',
            exercises: [
              {
                id: 'warm-11',
                name: 'Caminata rápida 3 min',
                detail: 'Progresivamente más rápido.',
              },
              {
                id: 'warm-12',
                name: 'Skipping bajo 2×20m',
                detail: 'Elevación de rodilla al 50%, ritmo moderado.',
              },
              {
                id: 'warm-13',
                name: 'Talones glúteos 2×20m',
                detail: 'Llevar talón atrás tocando glúteo, sin saltar.',
              },
              {
                id: 'warm-14',
                name: 'Zancadas dinámicas 2×10m',
                detail: 'Paso largo adelante, baja la rodilla trasera, impulsa.',
              },
              {
                id: 'warm-15',
                name: 'Trote suave 3–4 min',
                detail: 'Integra todo y calienta el tejido muscular.',
              },
            ],
          },
          {
            title: '🏃 SESIÓN PRINCIPAL',
            type: 'cardio',
            exercises: [
              {
                id: 'run-5',
                name: 'Trote continuo (Sem 1–2)',
                detail: 'Ritmo que permita hablar · Sin parar. Si debes parar, camina 1 min y sigue.',
                duration: '20 min',
              },
              {
                id: 'run-6',
                name: 'Trote + aceleraciones suaves (Sem 3–4)',
                detail: '25 min trote continuo + 4×40m al 80% al final · Caminata de vuelta entre aceleraciones (60")',
                duration: '25 min',
                reps: '4×40m',
              },
              {
                id: 'run-7',
                name: 'Trote + progresivos (Sem 5–6)',
                detail: '25 min trote + 6×50m progresivos (70%→80%→90% de velocidad máxima, 2 repeticiones de cada)',
                duration: '25 min',
                reps: '6×50m',
              },
              {
                id: 'run-8',
                name: 'Trote + 60m suaves (Sem 7–8)',
                detail: '30 min trote continuo + 4×60m al 85% · Descanso: caminata 90"',
                duration: '30 min',
                reps: '4×60m',
                progression: 'Meta: 60m en menos de 10" al final de la fase',
              },
            ],
          },
          {
            title: '🧘 VUELTA A LA CALMA',
            type: 'cooldown',
            exercises: [
              {
                id: 'cool-9',
                name: 'Caminata 5 min',
                detail: 'Recuperación activa.',
              },
              {
                id: 'cool-10',
                name: 'Estiramientos pierna completos',
                detail: 'Cuádriceps · Isquiotibiales · Gemelo · Flexor cadera. 30" cada uno.',
              },
            ],
          },
        ],
      },
      {
        id: 'vie-1',
        name: 'VIERNES',
        focus: 'Descanso Activo y Movilidad',
        blocks: [
          {
            title: '🧘 RECUPERACIÓN (30 min)',
            type: 'cooldown',
            exercises: [
              {
                id: 'rec-1',
                name: 'Caminata suave',
                detail: '15 min para oxigenar las piernas sin impacto.',
              },
              {
                id: 'rec-2',
                name: 'Movilidad articular profunda',
                detail: '15 min enfocados en cadera, tobillos y hombros.',
              },
            ],
          },
        ],
      },
      {
        id: 'sab-1',
        name: 'SÁBADO',
        focus: 'Circuito Completo Integrador',
        blocks: [
          {
            title: '⚠️ ANTES DE COMENZAR',
            type: 'warmup',
            exercises: [
              {
                id: 'inh-5',
                name: 'Inhalador de rescate',
                detail: '2 puffs, 20 min ANTES. El circuito es de intensidad variable, usa el inhalador siempre.',
              },
            ],
          },
          {
            title: '🔥 CALENTAMIENTO (10 min)',
            type: 'warmup',
            exercises: [
              {
                id: 'warm-16',
                name: 'Caminata rápida 5 min + articular completo',
                detail: 'Todos los grupos articulares: tobillos, rodillas, caderas, hombros, cuello',
              },
              {
                id: 'warm-17',
                name: 'Skipping + talones glúteos',
                detail: '1 serie de 20m de cada uno',
              },
            ],
          },
          {
            title: '⚡ CIRCUITO COMPLETO (2 rondas sem 1–4 · 3 rondas sem 5–8)',
            type: 'strength',
            exercises: [
              {
                id: 'circ-1',
                name: 'Sentadilla isométrica pared',
                detail: 'Sin descanso entre ejercicios',
                duration: '30"',
              },
              {
                id: 'circ-2',
                name: 'Flexiones (nivel de la semana)',
                detail: 'Rodillas o completas según progresión',
                reps: '10',
              },
              {
                id: 'circ-3',
                name: 'Puente de glúteos',
                detail: '',
                reps: '15',
              },
              {
                id: 'circ-4',
                name: 'Remo invertido en parque',
                detail: 'Pausa 1" con codos atrás',
                reps: '8',
              },
              {
                id: 'circ-5',
                name: 'Plancha frontal',
                detail: '',
                duration: '25"',
              },
              {
                id: 'circ-6',
                name: 'Dead hang',
                detail: 'Máximo posible (objetivo: 12–20")',
              },
              {
                id: 'circ-7',
                name: 'Marcha elevando rodillas',
                detail: 'Eleva cada rodilla a la cadera, ritmo moderado',
                duration: '30"',
              },
              {
                id: 'circ-8',
                name: 'Superman',
                detail: 'Pausa 1" arriba',
                reps: '10',
              },
              {
                id: 'circ-9',
                name: 'Mountain climbers lentos',
                detail: '',
                reps: '10 c/pierna',
              },
              {
                id: 'circ-10',
                name: 'Retracción escapular',
                detail: '',
                reps: '15',
              },
            ],
          },
          {
            title: '🏃 FINALIZADOR AERÓBICO',
            type: 'cardio',
            exercises: [
              {
                id: 'final-1',
                name: 'Trote suave 8–10 min',
                detail: 'Sem 1–4: Caminata rápida 8 min si las rodillas lo necesitan. Sem 5–8: Trote suave.',
              },
            ],
          },
          {
            title: '🧘 VUELTA A LA CALMA (10 min — MÁS LARGA HOY)',
            type: 'cooldown',
            exercises: [
              {
                id: 'cool-11',
                name: 'Estiramiento global completo',
                detail: 'Piernas + tronco + hombros + espalda. Mínimo 10 minutos. Es el día de más carga: dedica tiempo a la recuperación.',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const dietPhases: DietPhase[] = [
  {
    phase: 1,
    name: 'FASE 1 — ADAPTACIÓN',
    weeks: 'Semanas 1–8',
    macros: { kcal: 2800, protein: 150, carbs: 390, fat: 75 },
    description: 'Superávit mínimo para adaptar el cuerpo sin exceso de grasa. Base aeróbica + fortalecimiento articular.',
    note: 'Entrenas de noche: pre-entreno 90 min antes (ligero), cena post-entreno rica en proteína para la recuperación nocturna.',
  },
  {
    phase: 2,
    name: 'FASE 2 — DESARROLLO',
    weeks: 'Semanas 9–20',
    macros: { kcal: 2950, protein: 158, carbs: 415, fat: 80 },
    description: 'Aumentas volumen de carrera e intervalos. Necesitas más glucógeno. Sube la ingesta de carbohidratos.',
    note: 'Los días de intervalos (Martes) y circuito (Sábado) son los más exigentes: asegura el pre-entreno completo.',
  },
  {
    phase: 3,
    name: 'FASE 3 — ESPECIALIZACIÓN',
    weeks: 'Semanas 21–36',
    macros: { kcal: 3100, protein: 168, carbs: 435, fat: 85 },
    description: 'Pico de carga. Sprints al 100%, 300m y 2000m a ritmo de competición, 55 flexiones.',
    note: 'Martes (velocidad 60m + 300m) y Jueves (2000m) son los días más duros. Pre-entreno OBLIGATORIO.',
  },
  {
    phase: 4,
    name: 'FASE 4 — PICO DE FORMA',
    weeks: 'Semanas 37–44 · Tapering 45–48',
    macros: { kcal: 2900, protein: 162, carbs: 400, fat: 78 },
    description: 'Máxima calidad nutricional. Sem 45–48: reduce 15% las calorías totales bajando los carbos.',
    note: 'Sábado es día de simulacro oficial. Sem 45–48: usa versiones tapering de cada comida.',
  },
];

export const progressionMilestones = [
  {
    month: 3,
    metrics: {
      '2000m': '< 9\'00"',
      '60m': '~10"5',
      'flexiones_60s': '20 rep',
      'dead_hang': '25"',
      'estimated_score': '1–2 pts',
    },
  },
  {
    month: 6,
    metrics: {
      '2000m': '< 8\'00"',
      '60m': '~9"5',
      'flexiones_60s': '30 rep',
      'dead_hang': '30"',
      'estimated_score': '2–3 pts',
    },
  },
  {
    month: 12,
    metrics: {
      '2000m': '< 7\'00"',
      '60m': '~8"2',
      'flexiones_60s': '40 rep',
      'dead_hang': '35"',
      'estimated_score': '3–4 pts',
    },
  },
  {
    month: 18,
    metrics: {
      '2000m': '< 6\'35"',
      '60m': '~7"7',
      'flexiones_60s': '52 rep',
      'dead_hang': '40"',
      'estimated_score': '4–5 pts',
    },
  },
  {
    month: 24,
    metrics: {
      '2000m': '≤ 6\'20"',
      '60m': '≤ 7"50',
      '300m': '≤ 38"',
      'flexiones_60s': '55+ rep',
      'dead_hang': '>40"',
      'estimated_score': '5 pts ⭐',
    },
  },
];
