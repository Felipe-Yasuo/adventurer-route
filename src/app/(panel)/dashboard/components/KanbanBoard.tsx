import GlassCard from "./GlassCard";

function Column({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4 min-h-[520px]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-cloudWhite">{title}</h3>
        <span className="text-xs text-white/60">0</span>
      </div>

      <div className="space-y-3">
        <GlassCard className="text-sm text-white/60">
          (Próximo passo: TaskCard + clique abre modal)
        </GlassCard>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Column title="Tasks" />
      <Column title="Concluídas" />
    </div>
  );
}