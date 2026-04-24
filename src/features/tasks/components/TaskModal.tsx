"use client";

import { useEffect, useMemo, useState } from "react";
import type { TaskUI, Difficulty } from "@/features/tasks/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DIFFICULTY_META } from "@/features/tasks/utils/difficultyAssets";

const DIFFICULTY_ORDER: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

const DIFFICULTY_RING: Record<Difficulty, string> = {
  EASY: "border-(--color-easy) bg-(--color-easy)/10 shadow-[0_0_10px_-2px_rgba(34,197,94,0.45)]",
  MEDIUM: "border-(--color-medium) bg-(--color-medium)/10 shadow-[0_0_10px_-2px_rgba(234,179,8,0.45)]",
  HARD: "border-(--color-hard) bg-(--color-hard)/10 shadow-[0_0_10px_-2px_rgba(230,60,60,0.5)]",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--color-muted)">
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
    <Modal open={open}>
      <div className="p-6 text-(--color-ink)">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="text-(--color-gold) text-sm"
              aria-hidden
            >
              ◆
            </span>
            <div>
              <h2 className="font-serif text-2xl italic tracking-wide text-(--color-gold)">
                Editar missão
              </h2>
              <p className="mt-1 text-sm text-(--color-muted)">
                Ajuste os termos do contrato.
              </p>
            </div>
          </div>

          <Button
            variant="close"
            onClick={onClose}
            disabled={!!saving}
            aria-label="Fechar modal"
          >
            ✕
          </Button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <FieldLabel>Nome da missão</FieldLabel>
            <Input
              className="mt-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da missão..."
            />
          </div>

          <div>
            <FieldLabel>Dificuldade</FieldLabel>
            <div className="mt-2 grid grid-cols-3 gap-2">
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
                      "group flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition",
                      selected
                        ? DIFFICULTY_RING[d]
                        : "border-(--color-border) bg-(--color-bg) hover:bg-(--color-surfaceAlt)",
                    ].join(" ")}
                  >
                    <img
                      src={meta.icon}
                      alt=""
                      className={[
                        "h-12 w-12 object-contain transition",
                        selected
                          ? "scale-105 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                          : "opacity-70 group-hover:opacity-100",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "text-xs font-semibold tracking-wide",
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
            <FieldLabel>Prazo</FieldLabel>
            <Input
              className="mt-2"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={!!saving}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!!saving}
          >
            {saving ? "Selando..." : "Selar alterações"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
