"use client";

import { useEffect, useMemo, useState } from "react";
import type { TaskUI, Difficulty } from "../_types";

function ModalShell({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[rgba(20,12,8,0.58)] backdrop-blur-[2px]" />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-[28px] border border-black/10 bg-[rgba(242,228,198,0.98)] shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          {children}
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold tracking-wide text-[color:var(--color-ink)]/75">
      {children}
    </label>
  );
}

export default function TaskModal({
  open,
  task,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  task: TaskUI | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (updated: TaskUI) => void | Promise<void>;
}) {
  const initial = useMemo(() => task, [task]);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [dueDate, setDueDate] = useState<string>("");

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title);
    setDifficulty(initial.difficulty);
    setDueDate(initial.dueDate ?? "");
  }, [initial]);

  function handleSave() {
    if (!task) return;

    onSave({
      ...task,
      title: title.trim() || task.title,
      difficulty,
      dueDate: dueDate || null,
    });
  }

  return (
    <ModalShell open={open}>
      <div className="p-6 text-[color:var(--color-ink)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-wide">
              Editar tarefa
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-ink)]/65">
              Atualize os detalhes da sua missão.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={!!saving}
            className="rounded-xl border border-black/10 bg-[rgba(255,255,255,0.28)] px-3 py-2 text-sm font-semibold text-[color:var(--color-ink)]/75 transition hover:bg-[rgba(255,255,255,0.42)] disabled:opacity-50"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <FieldLabel>Título</FieldLabel>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da tarefa"
              className="mt-2 w-full rounded-xl border border-black/10 bg-[rgba(255,255,255,0.38)] px-4 py-3 text-sm text-[color:var(--color-ink)] outline-none transition placeholder:text-[color:var(--color-ink)]/40 focus:border-[rgba(212,160,23,0.45)] focus:bg-[rgba(255,255,255,0.5)]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Dificuldade</FieldLabel>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-[rgba(255,255,255,0.38)] px-4 py-3 text-sm text-[color:var(--color-ink)] outline-none transition focus:border-[rgba(212,160,23,0.45)] focus:bg-[rgba(255,255,255,0.5)]"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <FieldLabel>Data</FieldLabel>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-[rgba(255,255,255,0.38)] px-4 py-3 text-sm text-[color:var(--color-ink)] outline-none transition focus:border-[rgba(212,160,23,0.45)] focus:bg-[rgba(255,255,255,0.5)]"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            disabled={!!saving}
            className="rounded-xl border border-black/10 bg-[rgba(255,255,255,0.28)] px-4 py-3 text-sm font-semibold text-[color:var(--color-ink)]/80 transition hover:bg-[rgba(255,255,255,0.45)] disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={!!saving}
            className="rounded-xl border border-[rgba(212,160,23,0.42)] bg-[rgba(212,160,23,0.18)] px-5 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-[rgba(212,160,23,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}