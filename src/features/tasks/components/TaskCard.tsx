import type { TaskUI } from "@/features/tasks/types";
import { dateStatus } from "@/features/tasks/utils/date";

function difficultyBadge(difficulty: TaskUI["difficulty"]) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold border";

  if (difficulty === "EASY") {
    return `${base} bg-(--color-easy)/15 text-(--color-easy) border-(--color-easy)/40`;
  }

  if (difficulty === "MEDIUM") {
    return `${base} bg-(--color-medium)/15 text-(--color-medium) border-(--color-medium)/40`;
  }

  return `${base} bg-(--color-hard)/15 text-(--color-hard) border-(--color-hard)/40`;
}

function difficultyBorder(difficulty: TaskUI["difficulty"]) {
  if (difficulty === "EASY") return "border-l-(--color-easy)";
  if (difficulty === "MEDIUM") return "border-l-(--color-medium)";
  return "border-l-(--color-hard)";
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
    ? "text-(--color-muted) line-through"
    : "text-(--color-ink)";

  return (
    <div
      className={[
        "w-full rounded-xl border border-(--color-border) border-l-4 p-4 transition",
        "bg-(--color-surfaceAlt) hover:bg-(--color-surface)",
        "shadow-(--shadow-card)",
        difficultyBorder(task.difficulty),
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
            <span className="mb-1 inline-flex items-center rounded-full border border-(--color-hard)/40 bg-(--color-hard)/15 px-2.5 py-1 text-[11px] font-semibold text-(--color-hard)">
              ⏰ VENCIDA
            </span>
          )}

          {status === "today" && (
            <span className="mb-1 inline-flex items-center rounded-full border border-(--color-gold)/50 bg-(--color-gold)/15 px-2.5 py-1 text-[11px] font-semibold text-(--color-gold)">
              🔥 HOJE
            </span>
          )}

          {status === "tomorrow" && (
            <span className="mb-1 inline-flex items-center rounded-full border border-(--color-easy)/40 bg-(--color-easy)/15 px-2.5 py-1 text-[11px] font-semibold text-(--color-easy)">
              🌅 AMANHÃ
            </span>
          )}

          <div className="text-xs text-(--color-muted)">
            {task.dueDate ? (
              <span className="rounded-lg border border-(--color-border) bg-(--color-bg) px-2.5 py-1">
                📅 {task.dueDate}
              </span>
            ) : (
              <span className="rounded-lg border border-(--color-border) bg-(--color-bg) px-2.5 py-1">
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
              className="rounded-lg border border-(--color-easy)/50 bg-(--color-easy)/15 px-3 py-1.5 text-xs font-semibold text-(--color-easy) transition hover:bg-(--color-easy)/25 disabled:opacity-60"
            >
              {completing ? "Concluindo..." : "Concluir"}
            </button>
          ) : (
            <span className="text-xs font-medium text-(--color-muted)">
              ✅ concluída
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-lg border border-(--color-border) bg-(--color-bg) px-2 py-1 text-xs text-(--color-muted) transition hover:bg-(--color-surface) hover:text-(--color-ink)"
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
