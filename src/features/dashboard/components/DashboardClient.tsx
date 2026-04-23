"use client";

import { useEffect, useMemo, useState } from "react";
import TopHud from "@/features/shared/components/TopHud";
import KanbanBoard from "@/features/tasks/components/KanbanBoard";
import NewTaskCard from "@/features/tasks/components/NewTaskCard";
import QuestsCard from "@/features/quests/components/QuestsCard";

import type { TaskUI, TaskApi, DifficultyFilter, QuestApi } from "@/features/tasks/types";
import { mapTaskApiToUI } from "@/features/tasks/utils/map";

import { useMe } from "@/features/shared/components/me-store";

function todayKeyLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? `Falha ao carregar ${url}`);
  }
  return (await res.json()) as T;
}

export default function DashboardClient() {

  const { me, loading: meLoading, error: meError, reload: reloadMe } = useMe();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quests, setQuests] = useState<QuestApi[]>([]);

  const [tasksToday, setTasksToday] = useState<TaskUI[]>([]);


  const [levelUpPulse, setLevelUpPulse] = useState(0);

  const [filterQuery, setFilterQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyFilter>("ALL");


  const todayKey = useMemo(() => todayKeyLocal(), []);

  async function loadQuests() {
    const questsJson = await fetchJson<{ quests: QuestApi[] }>("/api/quests/today");
    setQuests(questsJson.quests ?? []);
  }

  async function loadToday() {
    const tasksJson = await fetchJson<TaskApi[]>(`/api/tasks?dayKey=${todayKey}`);
    setTasksToday(tasksJson.map(mapTaskApiToUI));
  }

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        reloadMe(), // ✅ atualiza HUD (gold/vida/xp/level)
        loadQuests(),
        loadToday(),
      ]);
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();

  }, []);

  const completedTotal = useMemo(() => {
    return tasksToday.filter((t) => t.completed).length;
  }, [tasksToday]);

  const todayTasksFiltered = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();

    return tasksToday.filter((t) => {
      const matchQuery = q.length === 0 || t.title.toLowerCase().includes(q);
      const matchDifficulty = filterDifficulty === "ALL" || t.difficulty === filterDifficulty;
      return matchQuery && matchDifficulty;
    });
  }, [tasksToday, filterQuery, filterDifficulty]);


  if (loading || meLoading) {
    return <div className="text-(--color-muted)">Carregando dashboard...</div>;
  }

  if (error || meError) {
    const msg = error ?? meError ?? "Erro desconhecido";
    return (
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
        <p className="text-(--color-hard)">Erro: {msg}</p>
        <button
          onClick={loadAll}
          className="mt-3 rounded-xl border border-(--color-gold)/60 bg-(--color-gold)/20 px-4 py-2 text-sm font-semibold text-(--color-gold) hover:bg-(--color-gold)/30"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 text-(--color-muted)">
        Usuário não carregado.
      </div>
    );
  }

  return (
    <div className="relative isolate flex flex-col gap-4 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-x-4 lg:gap-y-2 2xl:grid-cols-[380px_minmax(0,1fr)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-(image:--bg-texture) bg-repeat opacity-[0.01]"
      />
      <div className="order-1 lg:order-0 lg:col-start-2 lg:row-start-1">
        <TopHud
          user={me}
          completedTotal={completedTotal}
          levelUpPulse={levelUpPulse}
        />
      </div>

      <aside className="order-2 space-y-4 lg:order-0 lg:col-start-1 lg:row-start-1 lg:row-span-2">
        <NewTaskCard
          onCreated={async (created) => {
            const ui = mapTaskApiToUI(created);

            if (ui.dayKey === todayKey) {
              setTasksToday((prev) => [ui, ...prev]);
            }

            await Promise.all([reloadMe(), loadQuests()]);
          }}
        />

        <QuestsCard
          quests={quests}
          setQuests={setQuests}
          onLevelUp={() => setLevelUpPulse((v) => v + 1)}
        />
      </aside>

      <div className="order-3 lg:order-0 lg:col-start-2 lg:row-start-2">
        <KanbanBoard
          tasks={todayTasksFiltered}
          setTasks={setTasksToday}
          onNeedReload={loadAll}
          onQuestsReload={loadQuests}
          onLevelUp={() => setLevelUpPulse((v) => v + 1)}
        />
      </div>
    </div>
  );
}
