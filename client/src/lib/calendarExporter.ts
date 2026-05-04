import { trainingPhases, TrainingDay } from '@/data/trainingPlan';
import { yearlyTimeline, Milestone } from '@/data/yearlyCalendar';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  category: 'training' | 'milestone' | 'deload' | 'test' | 'simulacro';
  reminder?: number; // minutos antes
  color?: string;
}

/**
 * Generar eventos de entrenamiento semanal
 */
export function generateTrainingEvents(
  phase: number,
  week: number,
  startDate: Date
): CalendarEvent[] {
  const phaseData = trainingPhases[phase - 1];
  const events: CalendarEvent[] = [];

  // Calcular fecha de inicio de la semana
  const weekStartDate = new Date(startDate);
  weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);

  phaseData.days.forEach((day, dayIndex) => {
    const eventDate = new Date(weekStartDate);
    eventDate.setDate(eventDate.getDate() + dayIndex);

    // Saltar domingo (descanso)
    if (day.name === 'DOMINGO') return;

    const eventEndDate = new Date(eventDate);
    eventEndDate.setHours(eventEndDate.getHours() + 1.5);

    // Extraer ejercicios de los bloques
    const exercises = day.blocks
      .flatMap(block => block.exercises)
      .map(e => `• ${e.detail} ${e.sets && e.reps ? `${e.sets}x${e.reps}` : ''} ${e.notes ? `(${e.notes})` : ''}`)
      .join('\n');

    const event: CalendarEvent = {
      id: `training-${phase}-${week}-${dayIndex}`,
      title: `🔥 ${day.name} - ${day.focus}`,
      description: `Fase ${phase}: ${day.focus}\n\nEjercicios:\n${exercises}`,
      startDate: eventDate,
      endDate: eventEndDate,
      category: 'training',
      reminder: 24 * 60, // 24 horas antes
      color: getTrainingColor(day.focus),
    };

    events.push(event);
  });

  return events;
}

/**
 * Generar eventos de hitos
 */
export function generateMilestoneEvents(startDate: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  yearlyTimeline.forEach(phase => {
    phase.milestones.forEach(milestone => {
      const milestoneDate = new Date(startDate);
      milestoneDate.setDate(milestoneDate.getDate() + (milestone.week - 1) * 7);

      const event: CalendarEvent = {
        id: `milestone-${phase.phase}-${milestone.week}`,
        title: `${getMilestoneEmoji(milestone.type)} ${milestone.title}`,
        description: `${milestone.description}\n\nFase: ${phase.phase}\nSemana: ${milestone.week}`,
        startDate: milestoneDate,
        endDate: milestoneDate,
        category: getMilestoneCategory(milestone.type),
        reminder: milestone.type === 'test' ? 7 * 24 * 60 : 24 * 60, // 7 días antes de tests, 1 día antes de otros
        color: getMilestoneColor(milestone.type),
      };

      events.push(event);
    });
  });

  return events;
}

/**
 * Generar todos los eventos para exportación
 */
export function generateAllCalendarEvents(
  startDate: Date,
  includeTrainings: boolean = true,
  includeMilestones: boolean = true
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  if (includeMilestones) {
    events.push(...generateMilestoneEvents(startDate));
  }

  if (includeTrainings) {
    // Generar eventos de entrenamiento para todas las fases
    for (let phase = 1; phase <= 4; phase++) {
      const phaseInfo = yearlyTimeline.find(p => p.phase === phase);
      if (phaseInfo) {
        for (let week = phaseInfo.startWeek; week <= phaseInfo.endWeek; week++) {
          events.push(...generateTrainingEvents(phase, week, startDate));
        }
      }
    }
  }

  return events;
}

/**
 * Generar archivo iCal (.ics)
 */
export function generateICalContent(events: CalendarEvent[]): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Plan Bombero CM//NONSGML v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Plan Bombero CM - Oposición
X-WR-TIMEZONE:Europe/Madrid
X-WR-CALDESC:Plan de entrenamiento de 24 meses para oposición de bombero Comunidad de Madrid
BEGIN:VTIMEZONE
TZID:Europe/Madrid
BEGIN:STANDARD
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
END:DAYLIGHT
END:VTIMEZONE
`;

  events.forEach(event => {
    const eventId = `${event.id}@bombero-cm.local`;
    const startDate = formatICalDate(event.startDate);
    const endDate = formatICalDate(event.endDate);

    ical += `BEGIN:VEVENT
UID:${eventId}
DTSTAMP:${timestamp}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${escapeICalText(event.title)}
DESCRIPTION:${escapeICalText(event.description)}
`;

    if (event.reminder) {
      ical += `BEGIN:VALARM
TRIGGER:-PT${event.reminder}M
ACTION:DISPLAY
DESCRIPTION:Recordatorio: ${event.title}
END:VALARM
`;
    }

    if (event.category === 'test' || event.category === 'simulacro') {
      ical += `CATEGORIES:${event.category === 'test' ? 'TEST' : 'SIMULACRO'}
`;
    }

    ical += `STATUS:CONFIRMED
END:VEVENT
`;
  });

  ical += `END:VCALENDAR`;

  return ical;
}

/**
 * Descargar archivo iCal
 */
export function downloadICalFile(events: CalendarEvent[], filename: string = 'plan-bombero-cm.ics') {
  const icalContent = generateICalContent(events);
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Generar URL para Google Calendar
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const baseUrl = 'https://calendar.google.com/calendar/r/eventedit';

  const params = new URLSearchParams({
    text: event.title,
    details: event.description,
    location: event.location || '',
    dates: `${formatGoogleCalendarDate(event.startDate)}/${formatGoogleCalendarDate(event.endDate)}`,
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generar URL para crear múltiples eventos en Google Calendar
 */
export function generateGoogleCalendarSubscriptionUrl(startDate: Date): string {
  // Esta es una URL de suscripción que puede usarse para importar eventos
  // En un caso real, necesitarías un servidor backend que genere un feed de iCal
  const icalUrl = encodeURIComponent('webcal://example.com/plan-bombero-cm.ics');
  return `https://calendar.google.com/calendar/r/settings/addbyurl?url=${icalUrl}`;
}

/**
 * Generar instrucciones para importar en diferentes aplicaciones
 */
export function getImportInstructions(platform: 'google' | 'outlook' | 'apple' | 'ical'): string {
  const instructions: { [key: string]: string } = {
    google: `
1. Descarga el archivo .ics
2. Ve a Google Calendar (calendar.google.com)
3. Haz clic en el engranaje (Configuración) > Importar y exportar
4. Haz clic en "Seleccionar archivo en tu ordenador"
5. Elige el archivo plan-bombero-cm.ics
6. Selecciona el calendario donde deseas importar
7. Haz clic en "Importar"
    `,
    outlook: `
1. Descarga el archivo .ics
2. Abre Outlook
3. Ve a Archivo > Abrir y exportar > Importar/Exportar
4. Selecciona "Importar archivo de datos de Outlook"
5. Elige "Archivo de calendario iCalendar (.ics)"
6. Selecciona el archivo plan-bombero-cm.ics
7. Elige el calendario de destino
8. Haz clic en "Finalizar"
    `,
    apple: `
1. Descarga el archivo .ics
2. Haz doble clic en el archivo
3. Se abrirá Calendario automáticamente
4. Selecciona el calendario donde deseas importar
5. Haz clic en "Agregar"
    `,
    ical: `
1. Descarga el archivo .ics
2. Abre tu aplicación de calendario
3. Ve a Archivo > Importar
4. Selecciona el archivo plan-bombero-cm.ics
5. Confirma la importación
    `,
  };

  return instructions[platform] || '';
}

/**
 * Funciones auxiliares
 */

function formatICalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function formatGoogleCalendarDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

function getTrainingColor(focus: string): string {
  if (focus.includes('velocidad') || focus.includes('60m')) return '#ff6b35';
  if (focus.includes('fuerza') || focus.includes('empuje') || focus.includes('tracción')) return '#4caf50';
  if (focus.includes('resistencia') || focus.includes('2000m')) return '#2196f3';
  if (focus.includes('descanso') || focus.includes('movilidad')) return '#9c27b0';
  return '#757575';
}

function getMilestoneColor(type: string): string {
  switch (type) {
    case 'checkpoint':
      return '#2196f3';
    case 'deload':
      return '#4caf50';
    case 'test':
      return '#ff9800';
    case 'achievement':
      return '#9c27b0';
    default:
      return '#757575';
  }
}

function getMilestoneEmoji(type: string): string {
  switch (type) {
    case 'checkpoint':
      return '📍';
    case 'deload':
      return '😴';
    case 'test':
      return '🧪';
    case 'achievement':
      return '🏆';
    default:
      return '📌';
  }
}

function getMilestoneCategory(type: string): 'training' | 'milestone' | 'deload' | 'test' | 'simulacro' {
  if (type === 'deload') return 'deload';
  if (type === 'test') return 'test';
  if (type === 'achievement') return 'simulacro';
  return 'milestone';
}

/**
 * Generar resumen de eventos para mostrar
 */
export function getEventsSummary(events: CalendarEvent[]) {
  const summary = {
    total: events.length,
    trainings: events.filter(e => e.category === 'training').length,
    milestones: events.filter(e => e.category === 'milestone').length,
    deloads: events.filter(e => e.category === 'deload').length,
    tests: events.filter(e => e.category === 'test').length,
    simulacros: events.filter(e => e.category === 'simulacro').length,
  };

  return summary;
}
