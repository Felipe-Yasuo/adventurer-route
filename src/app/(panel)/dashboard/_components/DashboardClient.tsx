"use client";

import { useEffect, useMemo, useState } from "react";
import TopHud from "./TopHud";
import KanbanBoard from "./KanbanBoard";
import NewTaskCard from "./NewTaskCard";
import QuestsCard from "./QuestsCard";

import type { TaskUI, TaskApi, DifficultyFilter, QuestApi } from "../_types";
import { mapTaskApiToUI } from "../_utils/map";

import { useMe } from "@/app/(panel)/dashboard/_components/me-store";

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
    return <div className="text-white/70">Carregando dashboard...</div>;
  }

  if (error || meError) {
    const msg = error ?? meError ?? "Erro desconhecido";
    return (
      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
        <p className="text-rose">Erro: {msg}</p>
        <button
          onClick={loadAll}
          className="mt-3 rounded-xl bg-cloudWhite px-4 py-2 text-sm font-semibold text-twilight"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-white/70">
        Usuário não carregado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
      <aside className="space-y-6">
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
          onNeedReload={loadAll}
          onLevelUp={() => setLevelUpPulse((v) => v + 1)}
        />
      </aside>

      <section className="space-y-6">
        <TopHud
          user={me}
          completedTotal={completedTotal}
          levelUpPulse={levelUpPulse}
        />

        <KanbanBoard
          tasks={todayTasksFiltered}
          setTasks={setTasksToday}
          onNeedReload={loadAll}
          onLevelUp={() => setLevelUpPulse((v) => v + 1)}
        />
      </section>
    </div>
  );
}