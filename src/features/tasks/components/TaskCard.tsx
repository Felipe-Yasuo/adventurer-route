import type { TaskUI } from "@/features/tasks/types";
import { dateStatus } from "@/features/tasks/utils/date";

function difficultyBadge(difficulty: TaskUI["difficulty"]) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold border";

  if (difficulty === "EASY") {
    return `${base} bg-[rgba(47,143,91,0.12)] text-[color:var(--color-ink)] border-[rgba(47,143,91,0.18)]`;
  }

  if (difficulty === "MEDIUM") {
    return `${base} bg-[rgba(75,111,184,0.12)] text-[color:var(--color-ink)] border-[rgba(75,111,184,0.18)]`;
  }

  return `${base} bg-[rgba(178,59,59,0.12)] text-[color:var(--color-ink)] border-[rgba(178,59,59,0.18)]`;
}

export default function TaskCard({
  task,
  onOpen,
  onComplete,
  onDelete,
  completing,
}: {
  task: TaskUI;
  onOpen: () => void;
  onComplete: () => void;
  onDelete: () => void;
  completing?: boolean;
}) {
  const status = dateStatus(task.dueDate, task.completed);

  const titleClass = task.completed
    ? "text-[color:var(--color-ink)]/55 line-through"
    : "text-[color:var(--color-ink)]";

  return (
    <div
      className={[
        "w-full rounded-2xl border border-black/10 p-5 transition",
        "shadow-[0_6px_10px_rgba(0,0,0,0.15)]",
        status === "overdue"
          ? "bg-[rgba(178,59,59,0.15)] ring-1 ring-[rgba(178,59,59,0.35)]"
          : status === "today"
            ? "bg-[rgba(75,111,184,0.15)] ring-1 ring-[rgba(75,111,184,0.35)]"
            : "bg-[rgba(242,228,198,0.95)] hover:bg-[rgba(242,228,198,1)]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p
            className={[
              "truncate text-[15px] font-semibold tracking-wide",
              titleClass,
            ].join(" ")}
          >
            {task.title}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={difficultyBadge(task.difficulty)}>
              {task.difficulty.toLowerCase()}
            </span>
          </div>
        </button>

        <div className="flex flex-col items-end gap-2">
          {status === "overdue" && (
            <span className="mb-1 inline-flex items-center rounded-full border border-[rgba(178,59,59,0.2)] bg-[rgba(178,59,59,0.12)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-ink)]">
              ⏰ VENCIDA
            </span>
          )}

          {status === "today" && (
            <span className="mb-1 inline-flex items-center rounded-full border border-[rgba(75,111,184,0.2)] bg-[rgba(75,111,184,0.12)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-ink)]">
              🔔 HOJE
            </span>
          )}

          {status === "tomorrow" && (
            <span className="mb-1 inline-flex items-center rounded-full border border-[rgba(47,143,91,0.2)] bg-[rgba(47,143,91,0.12)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-ink)]">
              🌅 AMANHÃ
            </span>
          )}

          <div className="text-xs text-[color:var(--color-ink)]/65">
            {task.dueDate ? (
              <span className="rounded-lg border border-black/10 bg-[rgba(255,255,255,0.28)] px-2.5 py-1">
                📅 {task.dueDate}
              </span>
            ) : (
              <span className="rounded-lg border border-black/10 bg-[rgba(255,255,255,0.28)] px-2.5 py-1">
                sem data
              </span>
            )}
          </div>

          {!task.completed ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              disabled={!!completing}
              className="rounded-lg border border-[rgba(47,143,91,0.22)] bg-[rgba(47,143,91,0.15)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-ink)] transition hover:bg-[rgba(47,143,91,0.24)] disabled:opacity-60"
            >
              {completing ? "Concluindo..." : "Concluir"}
            </button>
          ) : (
            <span className="text-xs font-medium text-[color:var(--color-ink)]/55">
              ✅ concluída
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-lg border border-black/10 bg-[rgba(255,255,255,0.22)] px-2 py-1 text-xs text-[color:var(--color-ink)]/70 transition hover:bg-[rgba(255,255,255,0.38)]"
            title="Excluir"
            aria-label="Excluir tarefa"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

