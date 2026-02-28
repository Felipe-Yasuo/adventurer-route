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
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/90 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function TaskModal({
  open,
  task,
  onClose,
  onSave,
}: {
  open: boolean;
  task: TaskUI | null;
  onClose: () => void;
  onSave: (updated: TaskUI) => void;
}) {
  const initial = useMemo(() => task, [task]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string>("");
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [dueDate, setDueDate] = useState<string>("");
  const [tagsText, setTagsText] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title);
    setDescription(initial.description ?? "");
    setDifficulty(initial.difficulty);
    setDueDate(initial.dueDate ?? "");
    setTagsText(initial.tags.join(", "));
    setCompleted(initial.completed);
  }, [initial]);

  function handleSave() {
    if (!task) return;

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      ...task,
      title: title.trim() || task.title,
      description: description.trim() || null,
      difficulty,
      dueDate: dueDate || null,
      tags,
      completed,
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
              Clique em salvar para aplicar as alterações.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
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

          <div>
            <label className="text-xs text-white/70">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full min-h-[110px] rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
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

          <div>
            <label className="text-xs text-white/70">Tags</label>
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="ex: react, estudo"
              className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-3">
            <div>
              <p className="text-sm font-semibold text-cloudWhite">
                Concluída ✅
              </p>
              <p className="text-xs text-white/60">
                Ative para mover a task para “Concluídas”.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCompleted((v) => !v)}
              className={[
                "relative h-8 w-14 rounded-full border transition",
                completed
                  ? "bg-forest/40 border-white/10"
                  : "bg-white/10 border-white/10",
              ].join(" ")}
              aria-pressed={completed}
            >
              <span
                className={[
                  "absolute top-1 h-6 w-6 rounded-full bg-cloudWhite shadow transition",
                  completed ? "left-7" : "left-1",
                ].join(" ")}
              />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-cloudWhite px-4 py-2 text-sm font-semibold text-twilight hover:opacity-90"
          >
            Salvar
          </button>
        </div>
      </div>
    </ModalShell>
  );
}