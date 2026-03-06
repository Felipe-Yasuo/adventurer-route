"use client";

import { useState } from "react";
import type { TaskApi } from "../_types";
import NewTaskFrame from "./NewTaskFrame";

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

  return (await res.json()) as TaskApi;
}

function todayKeyLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function NewTaskCard({
  onCreated,
}: {
  onCreated: (task: TaskApi) => void | Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [dueDate, setDueDate] = useState<string>(todayKeyLocal());
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    const t = title.trim();
    if (!t) return alert("Digite um título.");

    setCreating(true);
    try {
      const created = await createTaskApi({
        title: t,
        difficulty,
        dueDate: dueDate || null,
      });

      setTitle("");
      setDifficulty("EASY");
      setDueDate(todayKeyLocal());

      await onCreated(created);
    } catch (e: any) {
      alert(e?.message ?? "Erro ao criar task");
    } finally {
      setCreating(false);
    }
  }

  return (
    <NewTaskFrame className="shadow-[0_12px_18px_rgba(0,0,0,0.18)]">
      <div className="space-y-4 text-[color:var(--color-ink)]">
        <div>
          <h3 className="text-lg font-bold">Nova tarefa</h3>
          <p className="mt-1 text-xs text-[color:var(--color-ink)]/60">
            Crie uma missão para sua jornada.
          </p>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da tarefa"
          className="w-full rounded-xl border border-black/10 bg-[rgba(255,255,255,0.38)] px-4 py-3 text-sm text-[color:var(--color-ink)] outline-none transition placeholder:text-[color:var(--color-ink)]/40 focus:border-[rgba(212,160,23,0.45)] focus:bg-[rgba(255,255,255,0.5)]"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="w-full rounded-xl border border-black/10 bg-[rgba(255,255,255,0.38)] px-4 py-3 text-sm text-[color:var(--color-ink)] outline-none transition focus:border-[rgba(212,160,23,0.45)] focus:bg-[rgba(255,255,255,0.5)]"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-[rgba(255,255,255,0.38)] px-4 py-3 text-sm text-[color:var(--color-ink)] outline-none transition focus:border-[rgba(212,160,23,0.45)] focus:bg-[rgba(255,255,255,0.5)]"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={creating}
          className="w-full rounded-xl border border-[rgba(212,160,23,0.4)] bg-[rgba(212,160,23,0.18)] py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-[rgba(212,160,23,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? "Criando..." : "Adicionar"}
        </button>
      </div>
    </NewTaskFrame>
  );
}