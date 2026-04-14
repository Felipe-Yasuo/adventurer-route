"use client";

import { useEffect, useMemo, useState } from "react";
import type { TaskUI, Difficulty } from "@/features/tasks/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold tracking-wide text-(--color-muted)">
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
          <div>
            <h2 className="text-xl font-bold tracking-wide">
              Editar tarefa
            </h2>
            <p className="mt-1 text-sm text-(--color-muted)">
              Atualize os detalhes da sua missão.
            </p>
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

        <div className="mt-6 space-y-4">
          <div>
            <FieldLabel>Título</FieldLabel>
            <Input
              className="mt-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da tarefa"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Dificuldade</FieldLabel>
              <Select
                className="mt-2"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </Select>
            </div>

            <div>
              <FieldLabel>Data</FieldLabel>
              <Input
                className="mt-2"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
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
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
