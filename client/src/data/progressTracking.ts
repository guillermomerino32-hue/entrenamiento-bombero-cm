export type TestType = '60m' | '300m' | '2000m' | 'flexiones_60s' | 'dead_hang' | 'trepa';

export interface ProgressRecord {
  id: string;
  date: string; // ISO date
  week: number;
  phase: number;
  testType: TestType;
  value: number; // Time in seconds or reps
  unit: string; // 's', 'rep', etc
  notes?: string;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  conditions?: string; // Weather, fatigue level, etc
}

export interface PhaseTargets {
  phase: number;
  targets: {
    [key in TestType]?: {
      target: number;
      unit: string;
      description: string;
    };
  };
}

export interface ProgressStats {
  testType: TestType;
  records: ProgressRecord[];
  current: number;
  best: number;
  average: number;
  improvement: number; // % improvement from first to last
  trend: 'improving' | 'stable' | 'declining';
  weeklyAverage: { week: number; value: number }[];
}

// Objetivos por fase
export const phaseTargets: PhaseTargets[] = [
  {
    phase: 1,
    targets: {
      '60m': { target: 10.5, unit: 's', description: 'Velocidad inicial' },
      '300m': { target: 45, unit: 's', description: 'Velocidad media' },
      '2000m': { target: 540, unit: 's', description: '9:00 minutos' },
      'flexiones_60s': { target: 20, unit: 'rep', description: 'Flexiones en 60s' },
      'dead_hang': { target: 20, unit: 's', description: 'Cuelgue isométrico' },
      'trepa': { target: 30, unit: 's', description: 'Trepa 5m' },
    },
  },
  {
    phase: 2,
    targets: {
      '60m': { target: 9.5, unit: 's', description: 'Velocidad mejorada' },
      '300m': { target: 40, unit: 's', description: 'Velocidad media mejorada' },
      '2000m': { target: 480, unit: 's', description: '8:00 minutos' },
      'flexiones_60s': { target: 30, unit: 'rep', description: 'Flexiones en 60s' },
      'dead_hang': { target: 30, unit: 's', description: 'Cuelgue isométrico' },
      'trepa': { target: 25, unit: 's', description: 'Trepa 5m' },
    },
  },
  {
    phase: 3,
    targets: {
      '60m': { target: 8.2, unit: 's', description: 'Velocidad especializada' },
      '300m': { target: 38, unit: 's', description: 'Velocidad especializada' },
      '2000m': { target: 420, unit: 's', description: '7:00 minutos' },
      'flexiones_60s': { target: 40, unit: 'rep', description: 'Flexiones en 60s' },
      'dead_hang': { target: 35, unit: 's', description: 'Cuelgue isométrico' },
      'trepa': { target: 20, unit: 's', description: 'Trepa 5m' },
    },
  },
  {
    phase: 4,
    targets: {
      '60m': { target: 7.5, unit: 's', description: 'Velocidad máxima' },
      '300m': { target: 36, unit: 's', description: 'Velocidad máxima' },
      '2000m': { target: 380, unit: 's', description: '6:20 minutos' },
      'flexiones_60s': { target: 55, unit: 'rep', description: 'Flexiones en 60s' },
      'dead_hang': { target: 40, unit: 's', description: 'Cuelgue isométrico' },
      'trepa': { target: 15, unit: 's', description: 'Trepa 5m' },
    },
  },
];

// Descripción de pruebas
export const testDescriptions: { [key in TestType]: string } = {
  '60m': 'Carrera de velocidad 60 metros',
  '300m': 'Carrera de velocidad media 300 metros',
  '2000m': 'Carrera de resistencia 2000 metros',
  'flexiones_60s': 'Flexiones completas en 60 segundos',
  'dead_hang': 'Cuelgue isométrico en barra',
  'trepa': 'Trepa de 5 metros en cuerda o estructura',
};

// Unidades
export const testUnits: { [key in TestType]: string } = {
  '60m': 's',
  '300m': 's',
  '2000m': 's',
  'flexiones_60s': 'rep',
  'dead_hang': 's',
  'trepa': 's',
};

// Colores para gráficas
export const testColors: { [key in TestType]: string } = {
  '60m': '#ff6b35',
  '300m': '#f7931e',
  '2000m': '#fdb913',
  'flexiones_60s': '#4caf50',
  'dead_hang': '#2196f3',
  'trepa': '#9c27b0',
};

/**
 * Obtener objetivo para una prueba en una fase específica
 */
export function getPhaseTarget(phase: number, testType: TestType) {
  const phaseTarget = phaseTargets.find(pt => pt.phase === phase);
  if (!phaseTarget) return null;
  return phaseTarget.targets[testType] || null;
}

/**
 * Calcular estadísticas de progreso
 */
export function calculateProgressStats(records: ProgressRecord[]): ProgressStats | null {
  if (records.length === 0) return null;

  const testType = records[0].testType;
  const sortedRecords = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const values = sortedRecords.map(r => r.value);
  const current = values[values.length - 1];
  const best = Math.min(...values);
  const average = values.reduce((a, b) => a + b, 0) / values.length;

  // Calcular mejora
  const first = values[0];
  const last = values[values.length - 1];
  const improvement = ((first - last) / first) * 100; // Para tiempos, menos es mejor

  // Determinar tendencia
  const recentRecords = sortedRecords.slice(-3);
  const recentValues = recentRecords.map(r => r.value);
  const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
  const previousAvg = values.slice(-6, -3).reduce((a, b) => a + b, 0) / Math.min(3, values.length - 3);

  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (recentAvg < previousAvg * 0.98) {
    trend = 'improving';
  } else if (recentAvg > previousAvg * 1.02) {
    trend = 'declining';
  }

  // Promedios semanales
  const weeklyData: { [week: number]: number[] } = {};
  sortedRecords.forEach(record => {
    if (!weeklyData[record.week]) {
      weeklyData[record.week] = [];
    }
    weeklyData[record.week].push(record.value);
  });

  const weeklyAverage = Object.entries(weeklyData).map(([week, values]) => ({
    week: parseInt(week),
    value: values.reduce((a, b) => a + b, 0) / values.length,
  }));

  return {
    testType,
    records: sortedRecords,
    current,
    best,
    average,
    improvement,
    trend,
    weeklyAverage,
  };
}

/**
 * Obtener todos los registros del almacenamiento local
 */
export function getStoredRecords(): ProgressRecord[] {
  try {
    const stored = localStorage.getItem('bombero_progress_records');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading progress records:', error);
    return [];
  }
}

/**
 * Guardar registros en almacenamiento local
 */
export function saveRecords(records: ProgressRecord[]) {
  try {
    localStorage.setItem('bombero_progress_records', JSON.stringify(records));
  } catch (error) {
    console.error('Error saving progress records:', error);
  }
}

/**
 * Añadir nuevo registro
 */
export function addProgressRecord(record: Omit<ProgressRecord, 'id'>): ProgressRecord {
  const newRecord: ProgressRecord = {
    ...record,
    id: `${Date.now()}-${Math.random()}`,
  };

  const records = getStoredRecords();
  records.push(newRecord);
  saveRecords(records);

  return newRecord;
}

/**
 * Eliminar registro
 */
export function deleteProgressRecord(id: string) {
  const records = getStoredRecords();
  const filtered = records.filter(r => r.id !== id);
  saveRecords(filtered);
}

/**
 * Obtener registros por prueba
 */
export function getRecordsByTest(testType: TestType): ProgressRecord[] {
  const records = getStoredRecords();
  return records.filter(r => r.testType === testType);
}

/**
 * Obtener registros de la última semana
 */
export function getLastWeekRecords(): ProgressRecord[] {
  const records = getStoredRecords();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return records.filter(r => new Date(r.date) >= oneWeekAgo);
}

/**
 * Exportar datos de progreso como CSV
 */
export function exportProgressAsCSV(): string {
  const records = getStoredRecords();
  const headers = ['Fecha', 'Semana', 'Fase', 'Prueba', 'Valor', 'Unidad', 'RPE', 'Notas'];
  const rows = records.map(r => [
    r.date,
    r.week,
    r.phase,
    r.testType,
    r.value,
    r.unit,
    r.rpe || '',
    r.notes || '',
  ]);

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  return csv;
}

/**
 * Descargar CSV de progreso
 */
export function downloadProgressCSV() {
  const csv = exportProgressAsCSV();
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', `progreso-bombero-${new Date().toISOString().split('T')[0]}.csv`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
