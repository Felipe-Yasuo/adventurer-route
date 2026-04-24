import type { TaskUI } from "@/features/tasks/types";
import { DIFFICULTY_META } from "@/features/tasks/utils/difficultyAssets";

function badge(difficulty: TaskUI["difficulty"]) {
    const base =
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border tracking-wide";

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

function formatDayLabel(dayKey: string) {
    const dt = new Date(`${dayKey}T00:00:00`);
    if (Number.isNaN(dt.getTime())) return dayKey;
    return dt.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
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
                <div className="flex items-center gap-2">
                    <span className="text-(--color-gold) text-sm" aria-hidden>◆</span>
                    <div>
                        <h3 className="font-serif text-xl italic text-(--color-ink)">
                            {title}
                        </h3>
                        <p className="mt-0.5 text-xs capitalize text-(--color-muted)">
                            {formatDayLabel(dayKey)}
                        </p>
                    </div>
                </div>

                <span className="rounded-full border border-(--color-border) bg-(--color-surfaceAlt) px-3 py-1 text-sm font-semibold text-(--color-ink)">
                    {tasks.length}
                </span>
            </div>

            <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-2 scroll-dark">
                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-(--color-border) bg-(--color-surfaceAlt)/40 p-8 text-center">
                        <img
                            src="/ui/icons/historico.png"
                            alt=""
                            className="h-16 w-16 object-contain opacity-60"
                        />
                        <div className="font-serif text-sm italic text-(--color-ink)/85">
                            Nenhum registro neste dia.
                        </div>
                        <div className="text-xs text-(--color-muted)">
                            A crônica deste dia permaneceu em branco — nenhum contrato foi aberto.
                        </div>
                    </div>
                ) : (
                    tasks.map((t) => {
                        const meta = DIFFICULTY_META[t.difficulty];

                        return (
                            <div
                                key={t.id}
                                className={[
                                    "rounded-xl border border-(--color-border) border-l-4 bg-(--color-surfaceAlt) p-4 shadow-(--shadow-card) transition hover:border-(--color-gold)/30",
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
                                                <img
                                                    src={meta.icon}
                                                    alt=""
                                                    className="h-4 w-4 object-contain"
                                                />
                                                {meta.label}
                                            </span>

                                            {t.dueDate ? (
                                                <span className="inline-flex items-center gap-1 rounded-lg border border-(--color-border) bg-(--color-bg) px-2.5 py-1 text-xs text-(--color-muted)">
                                                    <span aria-hidden>📅</span>
                                                    {t.dueDate}
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
                                                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                                                t.completed
                                                    ? "border-(--color-easy)/40 bg-(--color-easy)/15 text-(--color-easy)"
                                                    : "border-(--color-gold)/40 bg-(--color-gold)/10 text-(--color-gold)",
                                            ].join(" ")}
                                        >
                                            {t.completed ? "✓ vitória" : "✦ pendente"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
