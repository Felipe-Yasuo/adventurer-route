"use client";

import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import type { TaskUI } from "./types";

type TaskApi = {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  dueDate: string | null;
  completed: boolean;
  completedAt: string | null;
};

function mapApiToUI(t: TaskApi): TaskUI {
  return {
    id: t.id,
    title: t.title,
    difficulty: t.difficulty,
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : null,
    completed: t.completed,
    description: null,
    tags: [],
  };
}

async function patchTask(id: string, payload: Partial<TaskUI>) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: payload.title,
      difficulty: payload.difficulty,

      dueDate: payload.dueDate ?? null,
      completed: payload.completed,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? "Falha ao salvar task");
  }

  return (await res.json()) as TaskApi;
}

function Column({
  title,
  tasks,
  onClickTask,
}: {
  title: string;
  tasks: TaskUI[];
  onClickTask: (t: TaskUI) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4 min-h-[520px]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-cloudWhite">{title}</h3>
        <span className="text-xs text-white/60">{tasks.length}</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onClickTask(task)} />
        ))}
      </div>
    </div>
  );
}

export default function KanbanBoard({
  tasks,
  setTasks,
  onNeedReload,
}: {
  tasks: TaskUI[];
  setTasks: React.Dispatch<React.SetStateAction<TaskUI[]>>;
  onNeedReload: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<TaskUI | null>(null);
  const [saving, setSaving] = useState(false);

  const active = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const done = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Column title="Tasks" tasks={active} onClickTask={setSelected} />
        <Column title="Concluídas" tasks={done} onClickTask={setSelected} />
      </div>

      <TaskModal
        open={!!selected}
        task={selected}
        saving={saving}
        onClose={() => (saving ? null : setSelected(null))}
        onSave={async (updated) => {
          if (!selected) return;

          setSaving(true);

          const prev = tasks;
          setTasks((p) => p.map((t) => (t.id === updated.id ? updated : t)));

          try {
            const apiTask = await patchTask(updated.id, updated);
            const normalized = mapApiToUI(apiTask);

            setTasks((p) => p.map((t) => (t.id === normalized.id ? normalized : t)));

            setSelected(null);

            await onNeedReload();
          } catch (e) {
            setTasks(prev);
            alert((e as any)?.message ?? "Erro ao salvar");
          } finally {
            setSaving(false);
          }
        }}
      />
    </>
  );
}