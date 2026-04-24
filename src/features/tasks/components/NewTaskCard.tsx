"use client";

import { useState } from "react";
import type { TaskApi } from "@/features/tasks/types";
import NewTaskFrame from "@/features/tasks/components/NewTaskFrame";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DIFFICULTY_META } from "@/features/tasks/utils/difficultyAssets";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

const DIFFICULTY_ORDER: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

const DIFFICULTY_RING: Record<Difficulty, string> = {
  EASY: "border-(--color-easy) bg-(--color-easy)/10 shadow-[0_0_10px_-2px_rgba(34,197,94,0.45)]",
  MEDIUM: "border-(--color-medium) bg-(--color-medium)/10 shadow-[0_0_10px_-2px_rgba(234,179,8,0.45)]",
  HARD: "border-(--color-hard) bg-(--color-hard)/10 shadow-[0_0_10px_-2px_rgba(230,60,60,0.5)]",
};

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
    <NewTaskFrame>
      <div className="space-y-4 text-(--color-ink)">
        <div>
          <h3 className="text-lg font-bold">Nova missão</h3>
          <p className="mt-1 text-xs text-(--color-muted)">
            Inscreva um contrato no pergaminho.
          </p>
        </div>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nome da missão..."
        />

        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--color-muted)">
            Dificuldade
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTY_ORDER.map((d) => {
              const meta = DIFFICULTY_META[d];
              const selected = difficulty === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  aria-pressed={selected}
                  aria-label={`Dificuldade ${meta.label}`}
                  className={[
                    "group flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition",
                    selected
                      ? DIFFICULTY_RING[d]
                      : "border-(--color-border) bg-(--color-bg) hover:bg-(--color-surfaceAlt) hover:border-(--color-border)",
                  ].join(" ")}
                >
                  <img
                    src={meta.icon}
                    alt=""
                    className={[
                      "h-10 w-10 object-contain transition",
                      selected
                        ? "scale-105 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                        : "opacity-70 group-hover:opacity-100",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "text-[11px] font-semibold tracking-wide",
                      selected ? "text-(--color-ink)" : "text-(--color-muted)",
                    ].join(" ")}
                  >
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--color-muted)">
            Prazo
          </div>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Button
          variant="primary"
          className="w-full py-3"
          onClick={handleCreate}
          disabled={creating}
        >
          {creating ? "Forjando..." : "Inscrever missão"}
        </Button>
      </div>
    </NewTaskFrame>
  );
}
