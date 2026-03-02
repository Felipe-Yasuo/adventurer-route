"use client";

import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import type { TaskUI } from "../_types";
import { useToast } from "./toast";
import { isOverdue } from "../_utils/date";

type TaskApi = {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  dueDate: string | null;
  completed: boolean;
  completedAt: string | null;
};

type CompleteResponse = {
  rewards?: { xp: number; gold: number };
  leveledUp?: number;
  achievements?: {
    unlocked?: Array<{ code: string; title: string; rewardGold: number; rewardXp: number }>;
    totalRewardGold?: number;
    totalRewardXp?: number;
  };
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
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? "Falha ao salvar task");
  }

  return (await res.json()) as TaskApi;
}

async function deleteTask(id: string) {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? "Falha ao deletar task");
  }

  return true;
}


async function completeTask(id: string): Promise<CompleteResponse> {
  const res = await fetch(`/api/tasks/${id}/complete`, { method: "PATCH" });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? "Falha ao concluir task");
  }

  return (await res.json()) as CompleteResponse;
}

function Column({
  title,
  tasks,
  onOpenTask,
  onCompleteTask,
  onDeleteTask,
  completingId,
}: {
  title: string;
  tasks: TaskUI[];
  onOpenTask: (t: TaskUI) => void;
  onCompleteTask: (t: TaskUI) => void;
  onDeleteTask: (t: TaskUI) => void;
  completingId: string | null;
}) {
  const enableScroll = tasks.length > 6;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4 h-[520px] flex flex-col">
      <div className="mb-3 flex items-center justify-between shrink-0">
        <h3 className="text-sm font-semibold text-cloudWhite">{title}</h3>
        <span className="text-xs text-white/60">{tasks.length}</span>
      </div>

      <div
        className={[
          "space-y-3 pr-1",
          "flex-1",
          enableScroll ? "overflow-y-auto" : "overflow-y-hidden",
        ].join(" ")}
      >
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            Nenhuma tarefa encontrada com esses filtros.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpen={() => onOpenTask(task)}
              onComplete={() => onCompleteTask(task)}
              onDelete={() => onDeleteTask(task)}
              completing={completingId === task.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
export default function KanbanBoard({
  tasks,
  setTasks,
  onNeedReload,
  onLevelUp,
}: {
  tasks: TaskUI[];
  setTasks: React.Dispatch<React.SetStateAction<TaskUI[]>>;
  onNeedReload: () => Promise<void>;
  onLevelUp: () => void;
}) {

  const [selected, setSelected] = useState<TaskUI | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const active = useMemo(() => {
    const onlyActive = tasks.filter((t) => !t.completed);

    return [...onlyActive].sort((a, b) => {
      const aOver = isOverdue(a.dueDate, a.completed);
      const bOver = isOverdue(b.dueDate, b.completed);

      if (aOver !== bOver) return aOver ? -1 : 1;

      const aHas = !!a.dueDate;
      const bHas = !!b.dueDate;
      if (aHas !== bHas) return aHas ? -1 : 1;

      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);

      return a.title.localeCompare(b.title);
    });
  }, [tasks]);


  const done = useMemo(() => tasks.filter((t) => t.completed), [tasks]);
  const toast = useToast();

  async function handleSaveEdit(updated: TaskUI) {
    if (!selected) return;

    setSavingEdit(true);

    const prev = tasks;
    setTasks((p) => p.map((t) => (t.id === updated.id ? updated : t)));

    try {
      const apiTask = await patchTask(updated.id, updated);
      const normalized = mapApiToUI(apiTask);

      setTasks((p) => p.map((t) => (t.id === normalized.id ? normalized : t)));
      setSelected(null);
    } catch (e) {
      setTasks(prev);
      alert((e as any)?.message ?? "Erro ao salvar edição");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(task: TaskUI) {

    const prev = tasks;
    setTasks((p) => p.filter((t) => t.id !== task.id));

    try {
      await deleteTask(task.id);

      toast.push({
        type: "success",
        title: "Tarefa excluída",
        message: task.completed ? "Concluída removida do histórico visual." : "Tarefa removida.",
      });

      await onNeedReload();
    } catch (e: any) {
      setTasks(prev);
      toast.push({
        type: "error",
        title: "Erro ao excluir",
        message: e?.message ?? "Tente novamente",
      });
    }
  }

  async function handleComplete(task: TaskUI) {
    if (task.completed) return;
    setCompletingId(task.id);

    try {
      const result = await completeTask(task.id);

      const xp = result.rewards?.xp ?? 0;
      const gold = result.rewards?.gold ?? 0;


      toast.push({
        type: "success",
        title: "Tarefa concluída!",
        message: `+${xp} XP • +${gold} GOLD`,
      });

      const leveledUp = result.leveledUp ?? 0;
      if (leveledUp > 0) {
        onLevelUp();
        toast.push({
          type: "info",
          title: "LEVEL UP! ✨",
          message: `Você subiu ${leveledUp} nível(is)!`,
          durationMs: 3400,
        });
      }

      const unlocked = result.achievements?.unlocked ?? [];
      if (unlocked.length > 0) {
        const shown = unlocked.slice(0, 2).map((a) => `🏆 ${a.title}`).join(" • ");
        const more = unlocked.length > 2 ? ` +${unlocked.length - 2}` : "";

        toast.push({
          type: "success",
          title: "Conquista desbloqueada!",
          message: `${shown}${more}`,
          durationMs: 4200,
        });
      }

      await onNeedReload();
    } catch (e: any) {
      toast.push({
        type: "error",
        title: "Erro ao concluir",
        message: e?.message ?? "Tente novamente",
        durationMs: 3200,
      });
    } finally {
      setCompletingId(null);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Column
          title="Tasks"
          tasks={active}
          onOpenTask={setSelected}
          onCompleteTask={handleComplete}
          onDeleteTask={handleDelete}
          completingId={completingId}
        />

        <Column
          title="Concluídas"
          tasks={done}
          onOpenTask={setSelected}
          onCompleteTask={handleComplete}
          onDeleteTask={handleDelete}
          completingId={completingId}
        />
      </div>

      <TaskModal
        open={!!selected}
        task={selected}
        saving={savingEdit}
        onClose={() => (savingEdit ? null : setSelected(null))}
        onSave={handleSaveEdit}
      />
    </>
  );
}