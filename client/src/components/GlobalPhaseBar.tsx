import { usePhase, phaseList } from '@/contexts/PhaseContext';

export default function GlobalPhaseBar() {
  const { selectedPhase, setSelectedPhase, phaseInfo } = usePhase();

  return (
    <div className="w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container py-2">
        {/* Label row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            📋 Fase activa del plan
          </span>
          <span className="text-xs text-muted-foreground">— cambia aquí para afectar toda la app</span>
        </div>

        {/* Phase buttons */}
        <div className="flex flex-wrap gap-2">
          {phaseList.map((phase) => {
            const isActive = selectedPhase === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                    : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                <span>{phase.emoji}</span>
                <span className="hidden sm:inline font-bold">{phase.shortName}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${isActive ? 'bg-primary-foreground/20' : 'bg-muted'}`}>
                  {phase.weeks}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active phase detail strip */}
        <div className="mt-2 flex items-center gap-3">
          <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary font-medium">{phaseInfo.name}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{phaseInfo.description}</span>
        </div>
      </div>
    </div>
  );
}
