import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PhaseInfo {
  id: number;
  name: string;
  shortName: string;
  weeks: string;
  weekRange: [number, number];
  emoji: string;
  description: string;
  primaryColor: string;   // oklch value for --primary
  accentColor: string;    // oklch value for --accent / --ring
  sidebarColor: string;   // oklch value for sidebar primary
  dataAttribute: string;  // for CSS [data-phase] selector
}

export const phaseList: PhaseInfo[] = [
  {
    id: 1,
    name: 'FASE 1 — ADAPTACIÓN',
    shortName: 'Adaptación',
    weeks: 'Sem. 1–8',
    weekRange: [1, 8],
    emoji: '🔵',
    description: 'Base aeróbica y fortalecimiento articular',
    primaryColor: 'oklch(0.60 0.22 240)',
    accentColor: 'oklch(0.60 0.22 240)',
    sidebarColor: 'oklch(0.55 0.22 240)',
    dataAttribute: 'phase-1',
  },
  {
    id: 2,
    name: 'FASE 2 — DESARROLLO',
    shortName: 'Desarrollo',
    weeks: 'Sem. 9–20',
    weekRange: [9, 20],
    emoji: '🟢',
    description: 'Volumen de carrera e intervalos',
    primaryColor: 'oklch(0.60 0.20 145)',
    accentColor: 'oklch(0.60 0.20 145)',
    sidebarColor: 'oklch(0.55 0.20 145)',
    dataAttribute: 'phase-2',
  },
  {
    id: 3,
    name: 'FASE 3 — ESPECIALIZACIÓN',
    shortName: 'Especialización',
    weeks: 'Sem. 21–36',
    weekRange: [21, 36],
    emoji: '🟠',
    description: 'Sprints, 300m y pruebas a ritmo competición',
    primaryColor: 'oklch(0.65 0.22 55)',
    accentColor: 'oklch(0.65 0.22 55)',
    sidebarColor: 'oklch(0.58 0.22 55)',
    dataAttribute: 'phase-3',
  },
  {
    id: 4,
    name: 'FASE 4 — PICO DE FORMA',
    shortName: 'Pico de Forma',
    weeks: 'Sem. 37–48',
    weekRange: [37, 48],
    emoji: '🔴',
    description: 'Máxima calidad. Tapering y simulacros oficiales',
    primaryColor: 'oklch(0.62 0.30 22)',
    accentColor: 'oklch(0.62 0.30 22)',
    sidebarColor: 'oklch(0.55 0.30 22)',
    dataAttribute: 'phase-4',
  },
];

interface PhaseContextType {
  selectedPhase: number; // 1-4
  setSelectedPhase: (phase: number) => void;
  phaseInfo: PhaseInfo;
}

const PhaseContext = createContext<PhaseContextType | null>(null);

export function PhaseProvider({ children }: { children: ReactNode }) {
  const [selectedPhase, setSelectedPhaseState] = useState<number>(() => {
    const stored = localStorage.getItem('bombero_selected_phase');
    const parsed = stored ? parseInt(stored) : 1;
    return parsed >= 1 && parsed <= 4 ? parsed : 1;
  });

  const phaseInfo = phaseList.find((p) => p.id === selectedPhase) ?? phaseList[0];

  // Inject CSS variables into :root when phase changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', phaseInfo.primaryColor);
    root.style.setProperty('--accent', phaseInfo.accentColor);
    root.style.setProperty('--ring', phaseInfo.accentColor);
    root.style.setProperty('--chart-1', phaseInfo.primaryColor);
    root.style.setProperty('--sidebar-primary', phaseInfo.sidebarColor);
    root.style.setProperty('--sidebar-accent', phaseInfo.accentColor);
    root.style.setProperty('--sidebar-ring', phaseInfo.accentColor);
    root.setAttribute('data-phase', phaseInfo.dataAttribute);
  }, [phaseInfo]);

  const setSelectedPhase = (phase: number) => {
    if (phase >= 1 && phase <= 4) {
      setSelectedPhaseState(phase);
      localStorage.setItem('bombero_selected_phase', String(phase));
    }
  };

  return (
    <PhaseContext.Provider value={{ selectedPhase, setSelectedPhase, phaseInfo }}>
      {children}
    </PhaseContext.Provider>
  );
}

export function usePhase() {
  const ctx = useContext(PhaseContext);
  if (!ctx) throw new Error('usePhase must be used inside PhaseProvider');
  return ctx;
}
