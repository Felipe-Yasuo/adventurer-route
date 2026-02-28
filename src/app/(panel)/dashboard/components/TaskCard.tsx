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
  onClick,
}: {
  task: TaskUI;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-white/10 bg-black/20 p-4 shadow-lg backdrop-blur hover:bg-black/30 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-cloudWhite truncate">
            {task.title}
          </p>

          {task.description ? (
            <p className="mt-1 text-xs text-white/60 line-clamp-2">
              {task.description}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={difficultyBadge(task.difficulty)}>
              {task.difficulty.toLowerCase()}
            </span>

            {task.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

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
      </div>
    </button>
  );
}