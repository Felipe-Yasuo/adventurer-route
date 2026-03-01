"use client";

import { useState } from "react";
import GlassCard from "./GlassCard";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

async function createTaskApi(payload: {
  title: string;
  difficulty: Difficulty;
  dueDate: string | null;
}) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: payload.title,
      difficulty: payload.difficulty,
      dueDate: payload.dueDate ? payload.dueDate : null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? "Falha ao criar task");
  }

  return await res.json();
}

export default function NewTaskCard({
  onCreated,
}: {
  onCreated: () => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [dueDate, setDueDate] = useState<string>("");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    const t = title.trim();
    if (!t) return alert("Digite um título.");

    setCreating(true);
    try {
      await createTaskApi({
        title: t,
        difficulty,
        dueDate: dueDate || null,
      });

      setTitle("");
      setDifficulty("EASY");
      setDueDate("");

      await onCreated();
    } catch (e: any) {
      alert(e?.message ?? "Erro ao criar task");
    } finally {
      setCreating(false);
    }
  }

  return (
    <GlassCard>
      <h3 className="text-sm font-semibold mb-3">Nova tarefa</h3>

      <div className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da tarefa"
          className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none"
          >
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={creating}
          className="w-full rounded-xl bg-cloudWhite text-twilight py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-70"
        >
          {creating ? "Criando..." : "Adicionar"}
        </button>
      </div>
    </GlassCard>
  );
}