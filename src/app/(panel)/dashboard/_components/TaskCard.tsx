import type { TaskUI } from "./types";

function difficultyBadge(difficulty: TaskUI["difficulty"]) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold border";

  if (difficulty === "EASY")
    return `${base} bg-forest/20 text-cloudWhite border-white/10`;
  if (difficulty === "MEDIUM")
    return `${base} bg-blueSoft/20 text-cloudWhite border-white/10`;
  return `${base} bg-rose/20 text-cloudWhite border-white/10`;
}

export default function TaskCard({
  task,
  onOpen,
  onComplete,
  completing,
}: {
  task: TaskUI;
  onOpen: () => void;
  onComplete: () => void;
  completing?: boolean;
}) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 shadow-lg backdrop-blur hover:bg-black/30 transition">
      <div className="flex items-start justify-between gap-3">
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p className="text-sm font-semibold text-cloudWhite truncate">
            {task.title}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={difficultyBadge(task.difficulty)}>
              {task.difficulty.toLowerCase()}
            </span>
          </div>
        </button>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-white/50">
            {task.dueDate ? (
              <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                📅 {task.dueDate}
              </span>
            ) : (
              <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                sem data
              </span>
            )}
          </div>

          {!task.completed ? (
            <button
              onClick={onComplete}
              disabled={!!completing}
              className="rounded-lg bg-forest/40 border border-white/10 px-3 py-1 text-xs font-semibold text-cloudWhite hover:bg-forest/55 disabled:opacity-60"
            >
              {completing ? "Concluindo..." : "Concluir"}
            </button>
          ) : (
            <span className="text-xs text-white/60">✅ concluída</span>
          )}
        </div>
      </div>
    </div>
  );
}