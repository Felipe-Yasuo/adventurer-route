"use client";

import GlassCard from "@/features/shared/components/GlassCard";

type Difficulty = "ALL" | "EASY" | "MEDIUM" | "HARD";

export default function FiltersCard({
  query,
  onChangeQuery,
  difficulty,
  onChangeDifficulty,
  onClear,
}: {
  query: string;
  onChangeQuery: (v: string) => void;
  difficulty: Difficulty;
  onChangeDifficulty: (v: Difficulty) => void;
  onClear: () => void;
}) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filtros</h3>

        <button
          onClick={onClear}
          className="text-xs text-blueSoft hover:underline"
        >
          Limpar
        </button>
      </div>

      <div className="mt-3 space-y-3">
        <input
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          placeholder="Buscar por título"
          className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
        />

        <select
          value={difficulty}
          onChange={(e) => onChangeDifficulty(e.target.value as Difficulty)}
          className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none"
        >
          <option value="ALL">Todas dificuldades</option>
          <option value="EASY">EASY</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HARD">HARD</option>
        </select>
      </div>
    </GlassCard>
  );
}

