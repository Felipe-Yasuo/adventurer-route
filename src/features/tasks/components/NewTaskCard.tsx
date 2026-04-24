"use client";

import { useState } from "react";
import type { TaskApi } from "@/features/tasks/types";
import NewTaskFrame from "@/features/tasks/components/NewTaskFrame";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

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

        <div className="grid grid-cols-2 gap-3">
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            <option value="EASY">🗡️ Fácil</option>
            <option value="MEDIUM">⚔️ Médio</option>
            <option value="HARD">🐉 Difícil</option>
          </Select>

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
