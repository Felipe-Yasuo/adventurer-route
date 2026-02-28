import GlassCard from "./GlassCard";

export default function DailyGoalCard() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Meta do dia</h3>
        <button className="text-xs text-blueSoft hover:underline">Reset</button>
      </div>

      <p className="mt-2 text-xs text-white/60">Hoje: 28/02/2026</p>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/70">Concluídas hoje</span>
          <span className="text-white/80">0/3</span>
        </div>

        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-0 bg-forest" />
        </div>

        <p className="mt-2 text-[11px] text-white/50">
          Dica: cada task concluída conta pra sua streak e XP.
        </p>
      </div>
    </GlassCard>
  );
}