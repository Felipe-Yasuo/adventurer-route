import type { TaskUI } from "../_types";

function badge(difficulty: TaskUI["difficulty"]) {
    const base =
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold border border-white/10";
    if (difficulty === "EASY") return `${base} bg-forest/20 text-cloudWhite`;
    if (difficulty === "MEDIUM") return `${base} bg-blueSoft/20 text-cloudWhite`;
    return `${base} bg-rose/20 text-cloudWhite`;
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
        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-cloudWhite">{title}</h3>
                    <p className="mt-1 text-xs text-white/60">
                        Visualização do dia: <span className="text-white/70">{dayKey}</span>
                    </p>
                </div>

                <span className="text-xs text-white/60">{tasks.length}</span>
            </div>

            <div className="mt-3 space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {tasks.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                        Nenhuma task nesse dia.
                    </div>
                ) : (
                    tasks.map((t) => (
                        <div
                            key={t.id}
                            className="rounded-2xl border border-white/10 bg-black/20 p-3"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p
                                        className={[
                                            "text-sm font-semibold truncate",
                                            t.completed ? "text-white/50 line-through" : "text-cloudWhite",
                                        ].join(" ")}
                                    >
                                        {t.title}
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">
                                        <span className={badge(t.difficulty)}>
                                            {t.difficulty.toLowerCase()}
                                        </span>

                                        {t.dueDate ? (
                                            <span className="text-xs text-white/50">
                                                📅 {t.dueDate}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-white/50">sem data</span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-xs text-white/60 shrink-0">
                                    {t.completed ? "✅ concluída" : "⏳ ativa"}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <p className="mt-3 text-[11px] text-white/40">
                * Essa lista é somente leitura. O Kanban acima é sempre o “HOJE”.
            </p>
        </div>
    );
}