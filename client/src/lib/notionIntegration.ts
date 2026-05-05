/**
 * Módulo de integración con Notion Calendar
 * Permite sincronizar entrenamientos y nutrición con Notion Calendar
 */

export interface NotionIntegrationConfig {
  email: string;
  notionDatabaseId?: string;
  syncTrainings: boolean;
  syncNutrition: boolean;
  syncMilestones: boolean;
}

export interface NotionCalendarEvent {
  title: string;
  date: string; // ISO format: YYYY-MM-DD
  time?: string; // HH:mm format
  duration?: number; // minutos
  description: string;
  tags: string[];
  category: 'training' | 'nutrition' | 'milestone' | 'test';
  color?: string;
}

/**
 * Generar instrucciones para sincronizar con Notion Calendar
 */
export function getNotionSyncInstructions(): string {
  return `
SINCRONIZACIÓN CON NOTION CALENDAR

1. CREAR CONEXIÓN OAUTH
   - Ve a https://www.notion.so/my-integrations
   - Crea una nueva integración
   - Copia el "Internal Integration Token"

2. AUTORIZAR LA APLICACIÓN
   - En esta aplicación, ingresa tu email de Notion
   - Haz clic en "Conectar con Notion"
   - Autoriza el acceso a tu workspace

3. CONFIGURAR LA SINCRONIZACIÓN
   - Selecciona qué deseas sincronizar:
     ✓ Entrenamientos
     ✓ Nutrición
     ✓ Hitos importantes

4. SINCRONIZACIÓN AUTOMÁTICA
   - Los eventos se actualizarán automáticamente
   - Puedes sincronizar manualmente en cualquier momento
   - Los cambios se reflejarán en Notion en tiempo real

NOTA: La sincronización requiere que tengas una cuenta de Notion
con acceso a crear bases de datos.
`;
}

/**
 * Generar URL de autorización de Notion
 */
export function generateNotionAuthUrl(redirectUri: string): string {
  const clientId = process.env.REACT_APP_NOTION_CLIENT_ID || 'notion-client-id';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    owner: 'user',
  });
  return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
}

/**
 * Validar configuración de Notion
 */
export function validateNotionConfig(config: NotionIntegrationConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.email || !config.email.includes('@')) {
    errors.push('Email de Notion inválido');
  }

  if (!config.syncTrainings && !config.syncNutrition && !config.syncMilestones) {
    errors.push('Debes seleccionar al menos una opción de sincronización');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Convertir evento de entrenamiento a formato Notion
 */
export function convertTrainingToNotionEvent(
  dayName: string,
  focus: string,
  intensity: string,
  date: Date
): NotionCalendarEvent {
  const intensityMap: { [key: string]: string } = {
    'very-high': '🔥 Muy Intenso',
    'high': '💪 Intenso',
    'moderate': '⚡ Moderado',
    'light': '🟢 Ligero',
    'rest': '😴 Descanso',
  };

  return {
    title: `${dayName} - ${focus}`,
    date: date.toISOString().split('T')[0],
    time: '07:00',
    duration: 90,
    description: `Entrenamiento: ${focus}\nIntensidad: ${intensityMap[intensity] || intensity}`,
    tags: ['entrenamiento', intensity],
    category: 'training',
    color: getIntensityColor(intensity),
  };
}

/**
 * Convertir evento de nutrición a formato Notion
 */
export function convertNutritionToNotionEvent(
  mealType: string,
  mealName: string,
  kcal: number,
  protein: number,
  carbs: number,
  fat: number,
  date: Date,
  time: string
): NotionCalendarEvent {
  const mealTypeMap: { [key: string]: string } = {
    breakfast: '🌅 Desayuno',
    lunch: '🍽️ Comida',
    snack: '🥜 Snack',
    dinner: '🌙 Cena',
    'pre-workout': '⚡ Pre-entreno',
    'post-workout': '💪 Post-entreno',
  };

  return {
    title: `${mealTypeMap[mealType] || mealType}: ${mealName}`,
    date: date.toISOString().split('T')[0],
    time: time,
    duration: 30,
    description: `Comida: ${mealName}\nCalorías: ${kcal} kcal\nProteína: ${protein}g | Carbos: ${carbs}g | Grasas: ${fat}g`,
    tags: ['nutrición', mealType],
    category: 'nutrition',
    color: getMealTypeColor(mealType),
  };
}

/**
 * Convertir hito a formato Notion
 */
export function convertMilestoneToNotionEvent(
  title: string,
  description: string,
  type: string,
  date: Date
): NotionCalendarEvent {
  const typeMap: { [key: string]: string } = {
    test: '📊 Test',
    deload: '😴 Descarga',
    simulacro: '🎯 Simulacro',
    checkpoint: '✅ Checkpoint',
  };

  return {
    title: `${typeMap[type] || type}: ${title}`,
    date: date.toISOString().split('T')[0],
    description: description,
    tags: ['hito', type],
    category: 'milestone',
    color: getMilestoneColor(type),
  };
}

/**
 * Obtener color según intensidad
 */
function getIntensityColor(intensity: string): string {
  const colorMap: { [key: string]: string } = {
    'very-high': 'red',
    'high': 'orange',
    'moderate': 'yellow',
    'light': 'blue',
    'rest': 'green',
  };
  return colorMap[intensity] || 'gray';
}

/**
 * Obtener color según tipo de comida
 */
function getMealTypeColor(mealType: string): string {
  const colorMap: { [key: string]: string } = {
    breakfast: 'yellow',
    lunch: 'green',
    snack: 'blue',
    dinner: 'purple',
    'pre-workout': 'orange',
    'post-workout': 'red',
  };
  return colorMap[mealType] || 'gray';
}

/**
 * Obtener color según tipo de hito
 */
function getMilestoneColor(type: string): string {
  const colorMap: { [key: string]: string } = {
    test: 'blue',
    deload: 'green',
    simulacro: 'red',
    checkpoint: 'purple',
  };
  return colorMap[type] || 'gray';
}

/**
 * Guardar configuración de Notion en localStorage
 */
export function saveNotionConfig(config: NotionIntegrationConfig): void {
  localStorage.setItem('notion_config', JSON.stringify(config));
}

/**
 * Cargar configuración de Notion desde localStorage
 */
export function loadNotionConfig(): NotionIntegrationConfig | null {
  const stored = localStorage.getItem('notion_config');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Limpiar configuración de Notion
 */
export function clearNotionConfig(): void {
  localStorage.removeItem('notion_config');
  localStorage.removeItem('notion_token');
}

/**
 * Generar URL de suscripción para Notion Calendar
 */
export function generateNotionCalendarSubscriptionUrl(baseUrl: string): string {
  // Esta URL permitiría a Notion suscribirse a actualizaciones
  // En una implementación real, esto requeriría un backend
  return `${baseUrl}/api/notion/calendar/feed`;
}

/**
 * Validar token de Notion
 */
export async function validateNotionToken(token: string): Promise<boolean> {
  try {
    // En una implementación real, esto haría una llamada a la API de Notion
    // Por ahora, solo validamos que el token tenga un formato válido
    return token.length > 20 && token.includes('secret_');
  } catch (error) {
    console.error('Error validating Notion token:', error);
    return false;
  }
}

/**
 * Obtener instrucciones de sincronización manual
 */
export function getManualSyncInstructions(email: string): string {
  return `
SINCRONIZACIÓN MANUAL CON NOTION

Email registrado: ${email}

OPCIÓN 1: Importar archivo iCal
1. Descarga el archivo iCal desde "Plan Semanal"
2. En Notion, abre tu calendario
3. Haz clic en "Importar"
4. Selecciona el archivo iCal descargado
5. Los eventos se importarán automáticamente

OPCIÓN 2: Crear eventos manualmente
1. En Notion, crea una base de datos "Entrenamientos"
2. Añade los campos: Fecha, Tipo, Intensidad, Descripción
3. Copia los datos de esta aplicación
4. Pégalos en Notion

OPCIÓN 3: Usar integración automática
1. Conecta esta aplicación con Notion
2. Los eventos se sincronizarán automáticamente
3. Los cambios se reflejarán en tiempo real

¿Necesitas ayuda? Consulta la documentación en la sección de ayuda.
`;
}
