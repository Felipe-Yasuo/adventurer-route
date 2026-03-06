import type { TaskUI } from "../_types";

function badge(difficulty: TaskUI["difficulty"]) {
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
        <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.9)] p-5 shadow-[0_10px_18px_rgba(0,0,0,0.12)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-[color:var(--color-ink)]">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm text-[color:var(--color-ink)]/65">
                        Visualização do dia:{" "}
                        <span className="font-medium text-[color:var(--color-ink)]">
                            {dayKey}
                        </span>
                    </p>
                </div>

                <span className="rounded-xl border border-black/10 bg-[rgba(255,255,255,0.28)] px-3 py-1 text-sm font-semibold text-[color:var(--color-ink)]/75">
                    {tasks.length}
                </span>
            </div>

            <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-2">
                {tasks.length === 0 ? (
                    <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.28)] p-4 text-sm text-[color:var(--color-ink)]/70">
                        Nenhuma task nesse dia.
                    </div>
                ) : (
                    tasks.map((t) => (
                        <div
                            key={t.id}
                            className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.32)] p-4 shadow-[0_4px_8px_rgba(0,0,0,0.08)]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p
                                        className={[
                                            "truncate text-[15px] font-semibold tracking-wide",
                                            t.completed
                                                ? "text-[color:var(--color-ink)]/55 line-through"
                                                : "text-[color:var(--color-ink)]",
                                        ].join(" ")}
                                    >
                                        {t.title}
                                    </p>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className={badge(t.difficulty)}>
                                            {t.difficulty.toLowerCase()}
                                        </span>

                                        {t.dueDate ? (
                                            <span className="rounded-lg border border-black/10 bg-[rgba(255,255,255,0.22)] px-2.5 py-1 text-xs text-[color:var(--color-ink)]/65">
                                                📅 {t.dueDate}
                                            </span>
                                        ) : (
                                            <span className="rounded-lg border border-black/10 bg-[rgba(255,255,255,0.22)] px-2.5 py-1 text-xs text-[color:var(--color-ink)]/65">
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
                                                ? "border-[rgba(47,143,91,0.2)] bg-[rgba(47,143,91,0.12)] text-[color:var(--color-ink)]"
                                                : "border-black/10 bg-[rgba(0,0,0,0.04)] text-[color:var(--color-ink)]/70",
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