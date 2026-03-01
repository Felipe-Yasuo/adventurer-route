import GlassCard from "./GlassCard";

export default function NewTaskCard() {
  return (
    <GlassCard>
      <h3 className="text-sm font-semibold mb-3">Nova tarefa</h3>

      <div className="space-y-3">
        <input
          placeholder="Título da tarefa"
          className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
        />
        <textarea
          placeholder="Descrição (opcional)"
          className="w-full min-h-[90px] rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
        />

        <div className="grid grid-cols-2 gap-3">
          <select className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none">
            <option>EASY</option>
            <option>MEDIUM</option>
            <option>HARD</option>
          </select>

          <input
            type="date"
            className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none"
          />
        </div>

        <input
          placeholder="Tags (ex: react, estudo) — separa por vírgula"
          className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
        />

        <button className="w-full rounded-xl bg-cloudWhite text-twilight py-2 text-sm font-semibold hover:opacity-90">
          Adicionar
        </button>
      </div>
    </GlassCard>
  );
}