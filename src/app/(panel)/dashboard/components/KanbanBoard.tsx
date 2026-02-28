"use client";

import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import type { TaskUI } from "./types";

const initialTasks: TaskUI[] = [
  {
    id: "1",
    title: "Estudar React",
    description: "Revisar hooks + componentização",
    difficulty: "MEDIUM",
    dueDate: "2026-02-28",
    completed: false,
    tags: ["react", "ui"],
  },
  {
    id: "2",
    title: "Montar modal de editar task",
    description: "Abrir ao clicar na task",
    difficulty: "EASY",
    dueDate: null,
    completed: false,
    tags: ["dashboard"],
  },
  {
    id: "3",
    title: "Organizar commits da etapa 11",
    description: "Separar em commits pequenos e claros",
    difficulty: "EASY",
    dueDate: null,
    completed: true,
    tags: ["git"],
  },
];

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

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<TaskUI[]>(initialTasks);
  const [selected, setSelected] = useState<TaskUI | null>(null);

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
        onClose={() => setSelected(null)}
        onSave={(updated) => {
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          setSelected(null);
        }}
      />
    </>
  );
}