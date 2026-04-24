"use client";

import { useEffect, useMemo, useState } from "react";
import DayReadOnlyList from "@/features/tasks/components/DayReadOnlyList";
import type { TaskApi, TaskUI } from "@/features/tasks/types";
import { mapTaskApiToUI } from "@/features/tasks/utils/map";

function todayKeyLocal() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function shiftDay(dayKey: string, delta: number) {
    const dt = new Date(`${dayKey}T00:00:00`);
    if (Number.isNaN(dt.getTime())) return dayKey;
    dt.setDate(dt.getDate() + delta);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
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

async function fetchTasksByDay(dayKey: string): Promise<TaskUI[]> {
    const res = await fetch(`/api/tasks?dayKey=${dayKey}`, {
        cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(json?.error ?? "Falha ao carregar histórico");
    }

    return (json as TaskApi[]).map(mapTaskApiToUI);
}

function StatCard({
    iconSrc,
    label,
    value,
    tone = "default",
}: {
    iconSrc: string;
    label: string;
    value: number;
    tone?: "default" | "easy" | "gold";
}) {
    const border =
        tone === "easy"
            ? "border-(--color-easy)/45"
            : tone === "gold"
            ? "border-(--color-gold)/45"
            : "border-(--color-border)";

    const glow =
        tone === "easy"
            ? "shadow-[0_0_18px_-8px_rgba(34,197,94,0.5)]"
            : tone === "gold"
            ? "shadow-[0_0_18px_-8px_rgba(212,175,55,0.55)]"
            : "shadow-(--shadow-card)";

    const valueColor =
        tone === "easy"
            ? "text-(--color-easy)"
            : tone === "gold"
            ? "text-(--color-gold)"
            : "text-(--color-ink)";

    return (
        <div
            className={[
                "flex items-center gap-4 rounded-2xl border-2 bg-(--color-surface) p-5 transition",
                border,
                glow,
            ].join(" ")}
        >
            <img
                src={iconSrc}
                alt=""
                className="h-12 w-12 shrink-0 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]"
            />
            <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(--color-muted)">
                    {label}
                </div>
                <div className={["mt-1 font-serif text-3xl italic leading-none", valueColor].join(" ")}>
                    {value}
                </div>
            </div>
        </div>
    );
}

export default function HistoryClient() {
    const today = todayKeyLocal();
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [tasks, setTasks] = useState<TaskUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadHistory(dayKey: string) {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchTasksByDay(dayKey);
            setTasks(data);
        } catch (e: any) {
            setError(e?.message ?? "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadHistory(selectedDate);
    }, [selectedDate]);

    const total = tasks.length;

    const completed = useMemo(() => {
        return tasks.filter((t) => t.completed).length;
    }, [tasks]);

    const active = total - completed;

    const completionPct = total > 0 ? (completed / total) * 100 : 0;
    const isToday = selectedDate === today;

    const verdict = useMemo(() => {
        if (total === 0) return "A crônica deste dia jamais foi escrita.";
        if (completionPct >= 100) return "Dia perfeito — todos os contratos honrados.";
        if (completionPct >= 50) return "Uma jornada respeitável. Siga adiante.";
        if (completionPct > 0) return "O dia começou — mas há contratos em aberto.";
        return "Nenhum feito registrado. O pergaminho jaz intocado.";
    }, [total, completionPct]);

    return (
        <div className="space-y-6">
            <header className="relative overflow-hidden rounded-2xl border border-(--color-border) bg-linear-to-br from-(--color-surface) via-(--color-surfaceAlt) to-(--color-surface) p-6 shadow-(--shadow-card)">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src="/ui/icons/historico.png"
                            alt=""
                            className="h-16 w-16 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.55)]"
                        />
                        <div>
                            <div className="flex items-center gap-2 text-(--color-gold)">
                                <span className="text-xs" aria-hidden>◆</span>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                                    Crônicas da Jornada
                                </span>
                                <span className="text-xs" aria-hidden>◆</span>
                            </div>
                            <h1 className="mt-1 font-serif text-3xl italic text-(--color-ink)">
                                Folhear o pergaminho.
                            </h1>
                            <p className="mt-1 max-w-xl text-sm text-(--color-muted)">
                                Cada dia é uma página. Revisite qualquer amanhecer e contemple os contratos travados.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-(--color-gold)/40 bg-(--color-bg)/80 p-4 shadow-[0_0_18px_-8px_rgba(212,175,55,0.55)]">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(--color-gold)">
                            ◆ Escolher dia
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedDate(shiftDay(selectedDate, -1))}
                                className="grid h-10 w-10 place-items-center rounded-lg border border-(--color-border) bg-(--color-surface) text-(--color-ink) transition hover:border-(--color-gold)/60 hover:text-(--color-gold)"
                                aria-label="Dia anterior"
                            >
                                ‹
                            </button>

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-44 rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-center text-sm font-semibold text-(--color-ink) outline-none transition focus:border-(--color-gold)/60"
                            />

                            <button
                                type="button"
                                onClick={() => setSelectedDate(shiftDay(selectedDate, +1))}
                                className="grid h-10 w-10 place-items-center rounded-lg border border-(--color-border) bg-(--color-surface) text-(--color-ink) transition hover:border-(--color-gold)/60 hover:text-(--color-gold)"
                                aria-label="Próximo dia"
                            >
                                ›
                            </button>
                        </div>

                        {!isToday ? (
                            <button
                                type="button"
                                onClick={() => setSelectedDate(today)}
                                className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--color-gold) transition hover:text-amber-300"
                            >
                                ◆ voltar a hoje
                            </button>
                        ) : (
                            <div className="mt-2 text-[11px] italic text-(--color-muted)">
                                Você está em <span className="font-semibold text-(--color-ink)/80 not-italic">hoje</span>.
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-bg)/50 p-4">
                    <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.22em]">
                        <span className="capitalize text-(--color-muted)">
                            {formatDayLabel(selectedDate)}
                        </span>
                        <span className="text-(--color-gold)">
                            {completed}/{total} honrados
                        </span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full border border-black/60 bg-black/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)]">
                        <div
                            className="h-full rounded-full bg-linear-to-r from-(--color-easy)/70 via-(--color-easy) to-emerald-300 shadow-[0_0_8px_rgba(34,197,94,0.55)] transition-[width] duration-500 ease-out"
                            style={{ width: `${completionPct}%` }}
                        />
                    </div>
                    <div className="mt-2 text-[11px] italic text-(--color-muted)">
                        {verdict}
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard
                    iconSrc="/ui/icons/historico.png"
                    label="Contratos do dia"
                    value={total}
                />
                <StatCard
                    iconSrc="/ui/stats/concluido.png"
                    label="Vitórias"
                    value={completed}
                    tone="easy"
                />
                <StatCard
                    iconSrc="/ui/stats/fogo.png"
                    label="Em aberto"
                    value={active}
                    tone="gold"
                />
            </section>

            <section>
                {loading ? (
                    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-(--color-muted) shadow-(--shadow-card)">
                        Desenrolando o pergaminho...
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-(--color-hard)/40 bg-(--color-surface) p-6 shadow-(--shadow-card)">
                        <p className="text-(--color-hard)">Erro: {error}</p>

                        <button
                            onClick={() => loadHistory(selectedDate)}
                            className="mt-4 rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) px-4 py-2 text-sm font-semibold text-(--color-ink) hover:bg-(--color-surface)"
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : (
                    <DayReadOnlyList
                        title="Registros do dia"
                        dayKey={selectedDate}
                        tasks={tasks}
                    />
                )}
            </section>
        </div>
    );
}
