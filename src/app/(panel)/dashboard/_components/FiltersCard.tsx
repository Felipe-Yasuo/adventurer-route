import GlassCard from "./GlassCard";

export default function FiltersCard() {
  return (
    <GlassCard>
      <h3 className="text-sm font-semibold mb-3">Filtros</h3>

      <div className="space-y-3">
        <input
          placeholder="Buscar por título ou descrição"
          className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
        />

        <div className="grid grid-cols-2 gap-3">
          <select className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none">
            <option>Todas</option>
            <option>EASY</option>
            <option>MEDIUM</option>
            <option>HARD</option>
          </select>

          <select className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none">
            <option>Todas tags</option>
          </select>
        </div>
      </div>
    </GlassCard>
  );
}