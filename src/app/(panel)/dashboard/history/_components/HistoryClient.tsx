"use client";

import { useEffect, useMemo, useState } from "react";
import DayReadOnlyList from "@/features/tasks/components/DayReadOnlyList";
import type { TaskApi, TaskUI } from "@/app/(panel)/dashboard/_types";
import { mapTaskApiToUI } from "@/app/(panel)/dashboard/_utils/map";

function todayKeyLocal() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
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

export default function HistoryClient() {
    const [selectedDate, setSelectedDate] = useState<string>(todayKeyLocal());
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

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <section className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.88)] p-6 shadow-[0_8px_14px_rgba(0,0,0,0.12)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[color:var(--color-ink)]">
                            Histórico
                        </h1>
                        <p className="mt-1 text-sm text-[color:var(--color-ink)]/65">
                            Consulte as tarefas de um dia específico.
                        </p>
                    </div>

                    <div className="w-full max-w-[260px]">
                        <label
                            htmlFor="history-date"
                            className="mb-2 block text-sm font-medium text-[color:var(--color-ink)]"
                        >
                            Selecionar data
                        </label>

                        <input
                            id="history-date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full rounded-xl border border-black/10 bg-[rgba(255,255,255,0.38)] px-4 py-3 text-sm text-[color:var(--color-ink)] outline-none transition focus:border-[rgba(212,160,23,0.45)] focus:bg-[rgba(255,255,255,0.5)]"
                        />
                    </div>
                </div>
            </section>

            {/* Resumo */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-4 shadow-[0_6px_10px_rgba(0,0,0,0.1)]">
                    <div className="text-sm text-[color:var(--color-ink)]/65">Total</div>
                    <div className="mt-1 text-2xl font-bold text-[color:var(--color-ink)]">
                        {total}
                    </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-4 shadow-[0_6px_10px_rgba(0,0,0,0.1)]">
                    <div className="text-sm text-[color:var(--color-ink)]/65">Concluídas</div>
                    <div className="mt-1 text-2xl font-bold text-[color:var(--color-ink)]">
                        {completed}
                    </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-4 shadow-[0_6px_10px_rgba(0,0,0,0.1)]">
                    <div className="text-sm text-[color:var(--color-ink)]/65">Ativas</div>
                    <div className="mt-1 text-2xl font-bold text-[color:var(--color-ink)]">
                        {active}
                    </div>
                </div>
            </section>

            {/* Conteúdo */}
            <section>
                {loading ? (
                    <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.88)] p-6 text-[color:var(--color-ink)]/70 shadow-[0_8px_14px_rgba(0,0,0,0.12)]">
                        Carregando histórico...
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-[rgba(178,59,59,0.2)] bg-[rgba(178,59,59,0.08)] p-6 text-[color:var(--color-ink)] shadow-[0_8px_14px_rgba(0,0,0,0.08)]">
                        <p>Erro: {error}</p>

                        <button
                            onClick={() => loadHistory(selectedDate)}
                            className="mt-4 rounded-xl border border-black/10 bg-[rgba(255,255,255,0.38)] px-4 py-2 text-sm font-semibold text-[color:var(--color-ink)] hover:bg-[rgba(255,255,255,0.55)]"
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : (
                    <DayReadOnlyList
                        title="Tarefas do dia selecionado"
                        dayKey={selectedDate}
                        tasks={tasks}
                    />
                )}
            </section>
        </div>
    );
}