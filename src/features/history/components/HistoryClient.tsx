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
            <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-(--color-ink)">
                            Histórico
                        </h1>
                        <p className="mt-1 text-sm text-(--color-muted)">
                            Consulte as tarefas de um dia específico.
                        </p>
                    </div>

                    <div className="w-full max-w-[260px]">
                        <label
                            htmlFor="history-date"
                            className="mb-2 block text-sm font-medium text-(--color-ink)"
                        >
                            Selecionar data
                        </label>

                        <input
                            id="history-date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) px-4 py-3 text-sm text-(--color-ink) outline-none transition focus:border-(--color-gold) focus:bg-(--color-surface)"
                        />
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card)">
                    <div className="text-sm text-(--color-muted)">Total</div>
                    <div className="mt-1 text-2xl font-bold text-(--color-ink)">
                        {total}
                    </div>
                </div>

                <div className="rounded-2xl border border-(--color-easy)/30 bg-(--color-surface) p-4 shadow-(--shadow-card)">
                    <div className="text-sm text-(--color-muted)">Concluídas</div>
                    <div className="mt-1 text-2xl font-bold text-(--color-easy)">
                        {completed}
                    </div>
                </div>

                <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card)">
                    <div className="text-sm text-(--color-muted)">Ativas</div>
                    <div className="mt-1 text-2xl font-bold text-(--color-gold)">
                        {active}
                    </div>
                </div>
            </section>

            <section>
                {loading ? (
                    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-(--color-muted) shadow-(--shadow-card)">
                        Carregando histórico...
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
                        title="Tarefas do dia selecionado"
                        dayKey={selectedDate}
                        tasks={tasks}
                    />
                )}
            </section>
        </div>
    );
}
