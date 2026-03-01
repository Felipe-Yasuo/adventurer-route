"use client";

import { useEffect, useMemo, useState } from "react";
import type { TaskUI, Difficulty } from "./types";

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
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-twilight shadow-2xl">
          {children}
        </div>
      </div>
    </div>
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
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-cloudWhite">
              Editar tarefa
            </h2>
            <p className="text-xs text-white/60">
              O modal serve apenas para editar (concluir é pelo card).
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={!!saving}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-white/70">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/70">Dificuldade</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-white/70">Data</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={!!saving}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!!saving}
            className="rounded-xl bg-cloudWhite px-4 py-2 text-sm font-semibold text-twilight hover:opacity-90 disabled:opacity-70"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}