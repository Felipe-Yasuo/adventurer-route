"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import TaskCard from "@/features/tasks/components/TaskCard";
import TaskModal from "@/features/tasks/components/TaskModal";
import TasksFrame from "@/features/tasks/components/TaskFrame";
import type { TaskUI } from "@/features/tasks/types";
import type { TaskApi, CompleteResponse } from "@/features/tasks/types";
import { isOverdue } from "@/features/tasks/utils/date";
import { useToast } from "@/features/shared/components/toast";
import { useMe } from "@/features/shared/components/me-store";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import type { FloatingTextItem } from "@/components/animations/FloatingText";

function mapApiToUI(t: TaskApi): TaskUI {
  return {
    id: t.id,
    title: t.title,
    difficulty: t.difficulty,
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : null,
    completed: t.completed,
    description: null,
    tags: [],
    dayKey: t.dayKey,
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

function EmptyState({ variant }: { variant: "active" | "done" }) {
  const copy =
    variant === "active"
      ? {
          icon: "/ui/icons/regras.png",
          title: "O pergaminho está em branco.",
          sub: "Inscreva sua primeira missão e a jornada começa.",
        }
      : {
          icon: "/ui/stats/concluido.png",
          title: "Nenhuma vitória registrada… ainda.",
          sub: "Conclua uma missão para ver seu feito aqui.",
        };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-(--color-border) bg-(--color-surfaceAlt)/40 px-6 py-10 text-center">
      <img
        src={copy.icon}
        alt=""
        className="h-16 w-16 object-contain opacity-70 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
      />
      <div className="font-serif text-base italic text-(--color-ink)/85">
        {copy.title}
      </div>
      <div className="text-xs text-(--color-muted)">{copy.sub}</div>
    </div>
  );
}

function Column({
  title,
  variant,
  tasks,
  onOpenTask,
  onCompleteTask,
  onDeleteTask,
  completingId,
  checkmarkId,
  floatingByTask,
}: {
  title: string;
  variant: "active" | "done";
  tasks: TaskUI[];
  onOpenTask: (t: TaskUI) => void;
  onCompleteTask: (t: TaskUI) => void;
  onDeleteTask: (t: TaskUI) => void;
  completingId: string | null;
  checkmarkId: string | null;
  floatingByTask: Record<string, FloatingTextItem[]>;
}) {
  const enableScroll = tasks.length > 2;

  return (
    <div className="space-y-2 ">
      <div className="flex items-center justify-between px-3">
        <h3 className="flex items-center gap-2 text-2xl font-bold tracking-wide text-(--color-ink)">
          <span className="text-(--color-gold) text-sm" aria-hidden>
            ◆
          </span>
          {title}
        </h3>
        <span className="rounded-full border border-(--color-border) bg-(--color-surfaceAlt) px-3 py-0.5 text-sm font-semibold text-(--color-muted)">
          {tasks.length}
        </span>
      </div>


      <TasksFrame className="h-125 flex flex-col">
        <div
          className={[
            "flex-1 min-h-0 pr-2 pt-2 scroll-dark",
            enableScroll ? "overflow-y-auto" : "overflow-y-hidden",
          ].join(" ")}
        >
          {tasks.length === 0 ? (
            <EmptyState variant={variant} />
          ) : (
            <StaggerContainer className="space-y-3">
              <AnimatePresence initial={false}>
                {tasks.map((task) => (
                  <StaggerItem key={task.id}>
                    <TaskCard
                      task={task}
                      onOpen={() => onOpenTask(task)}
                      onComplete={() => onCompleteTask(task)}
                      onDelete={() => onDeleteTask(task)}
                      completing={completingId === task.id}
                      showCheckmark={checkmarkId === task.id}
                      floatingItems={floatingByTask[task.id]}
                    />
                  </StaggerItem>
                ))}
              </AnimatePresence>
            </StaggerContainer>
          )}
        </div>
      </TasksFrame>
    </div>
  );
}


export default function KanbanBoard({
  tasks,
  setTasks,
  onNeedReload,
  onQuestsReload,
  onLevelUp,
}: {
  tasks: TaskUI[];
  setTasks: React.Dispatch<React.SetStateAction<TaskUI[]>>;
  onNeedReload: () => Promise<void>;
  onQuestsReload: () => Promise<void>;
  onLevelUp: () => void;
}) {
  const [selected, setSelected] = useState<TaskUI | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [checkmarkId, setCheckmarkId] = useState<string | null>(null);
  const [floatingByTask, setFloatingByTask] = useState<Record<string, FloatingTextItem[]>>({});

  const toast = useToast();

  const { setMe } = useMe();

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
        message: task.completed
          ? "Concluída removida do histórico visual."
          : "Tarefa removida.",
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

  function pushFloatingForTask(taskId: string, items: FloatingTextItem[]) {
    setFloatingByTask((prev) => ({ ...prev, [taskId]: items }));
    window.setTimeout(() => {
      setFloatingByTask((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
    }, 3200);
  }

  async function handleComplete(task: TaskUI) {
    if (task.completed) return;
    setCompletingId(task.id);
    setCheckmarkId(task.id);

    try {
      const [result] = await Promise.all([
        completeTask(task.id),
        new Promise<void>((r) => window.setTimeout(r, 600)),
      ]);

      setCheckmarkId(null);

      if ((result as any).user) {
        const u = (result as any).user;
        setMe((prev) => (prev ? { ...prev, ...u } : u));
      }

      const xp = result.rewards?.xp ?? 0;
      const gold = result.rewards?.gold ?? 0;

      const items: FloatingTextItem[] = [];
      if (xp > 0) items.push({ id: `${task.id}-xp-${Date.now()}`, text: `+${xp} XP`, color: "var(--color-gold)" });
      if (gold > 0) items.push({ id: `${task.id}-gold-${Date.now()}`, text: `+${gold} GOLD`, color: "var(--color-gold)" });
      if (items.length > 0) pushFloatingForTask(task.id, items);

      await new Promise<void>((r) => window.setTimeout(r, 1400));

      setFloatingByTask((prev) => {
        const next = { ...prev };
        delete next[task.id];
        return next;
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t))
      );

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

      await onQuestsReload();
    } catch (e: any) {
      setCheckmarkId(null);
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
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Column
          title="Missões"
          variant="active"
          tasks={active}
          onOpenTask={setSelected}
          onCompleteTask={handleComplete}
          onDeleteTask={handleDelete}
          completingId={completingId}
          checkmarkId={checkmarkId}
          floatingByTask={floatingByTask}
        />

        <Column
          title="Vitórias"
          variant="done"
          tasks={done}
          onOpenTask={setSelected}
          onCompleteTask={handleComplete}
          onDeleteTask={handleDelete}
          completingId={completingId}
          checkmarkId={checkmarkId}
          floatingByTask={floatingByTask}
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
