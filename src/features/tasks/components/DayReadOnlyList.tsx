import type { TaskUI } from "@/features/tasks/types";

function badge(difficulty: TaskUI["difficulty"]) {
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

export default function DayReadOnlyList({
    title,
    dayKey,
    tasks,
}: {
    title: string;
    dayKey: string;
    tasks: TaskUI[];
}) {
    return (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-(--color-ink)">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm text-(--color-muted)">
                        Visualização do dia:{" "}
                        <span className="font-medium text-(--color-ink)">
                            {dayKey}
                        </span>
                    </p>
                </div>

                <span className="rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) px-3 py-1 text-sm font-semibold text-(--color-ink)">
                    {tasks.length}
                </span>
            </div>

            <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-2 scroll-dark">
                {tasks.length === 0 ? (
                    <div className="rounded-2xl border border-(--color-border) bg-(--color-surfaceAlt) p-4 text-sm text-(--color-muted)">
                        Nenhuma task nesse dia.
                    </div>
                ) : (
                    tasks.map((t) => (
                        <div
                            key={t.id}
                            className={[
                                "rounded-xl border border-(--color-border) border-l-4 bg-(--color-surfaceAlt) p-4 shadow-(--shadow-card)",
                                difficultyBorder(t.difficulty),
                            ].join(" ")}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p
                                        className={[
                                            "truncate text-[15px] font-semibold tracking-wide",
                                            t.completed
                                                ? "text-(--color-muted) line-through"
                                                : "text-(--color-ink)",
                                        ].join(" ")}
                                    >
                                        {t.title}
                                    </p>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className={badge(t.difficulty)}>
                                            {t.difficulty.toLowerCase()}
                                        </span>

                                        {t.dueDate ? (
                                            <span className="rounded-lg border border-(--color-border) bg-(--color-bg) px-2.5 py-1 text-xs text-(--color-muted)">
                                                📅 {t.dueDate}
                                            </span>
                                        ) : (
                                            <span className="rounded-lg border border-(--color-border) bg-(--color-bg) px-2.5 py-1 text-xs text-(--color-muted)">
                                                sem data
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    <span
                                        className={[
                                            "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                                            t.completed
                                                ? "border-(--color-easy)/40 bg-(--color-easy)/15 text-(--color-easy)"
                                                : "border-(--color-border) bg-(--color-bg) text-(--color-muted)",
                                        ].join(" ")}
                                    >
                                        {t.completed ? "✅ concluída" : "⏳ ativa"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
