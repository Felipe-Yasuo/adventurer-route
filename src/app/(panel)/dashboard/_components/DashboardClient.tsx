"use client";

import { useEffect, useMemo, useState } from "react";
import TopHud from "./TopHud";
import KanbanBoard from "./KanbanBoard";
import NewTaskCard from "./NewTaskCard";
import FiltersCard from "./FiltersCard";
import DailyGoalCard from "./DailyGoalCard";
import type { TaskUI, TaskApi, UserApi, DifficultyFilter } from "../_types";
import { mapTaskApiToUI } from "../_utils/map";


export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<UserApi | null>(null);
  const [tasks, setTasks] = useState<TaskUI[]>([]);
  const [levelUpPulse, setLevelUpPulse] = useState(0);

  const [filterQuery, setFilterQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] =
    useState<DifficultyFilter>("ALL");

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const [meRes, tasksRes] = await Promise.all([
        fetch("/api/me", { cache: "no-store" }),
        fetch("/api/tasks", { cache: "no-store" }),
      ]);

      if (!meRes.ok) throw new Error("Falha ao carregar /api/me");
      if (!tasksRes.ok) throw new Error("Falha ao carregar /api/tasks");

      const meJson = (await meRes.json()) as UserApi;
      const tasksJson = (await tasksRes.json()) as TaskApi[];

      setUser(meJson);
      setTasks(tasksJson.map(mapTaskApiToUI));
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const filteredTasks = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();

    return tasks.filter((t) => {
      const matchQuery = q.length === 0 || t.title.toLowerCase().includes(q);
      const matchDifficulty =
        filterDifficulty === "ALL" || t.difficulty === filterDifficulty;

      return matchQuery && matchDifficulty;
    });
  }, [tasks, filterQuery, filterDifficulty]);

  function clearFilters() {
    setFilterQuery("");
    setFilterDifficulty("ALL");
  }

  if (loading) return <div className="text-white/70">Carregando dashboard...</div>;

  if (error) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
        <p className="text-rose">Erro: {error}</p>
        <button
          onClick={loadAll}
          className="mt-3 rounded-xl bg-cloudWhite px-4 py-2 text-sm font-semibold text-twilight"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-12 lg:col-span-3 space-y-6">
        <NewTaskCard onCreated={loadAll} />

        <FiltersCard
          query={filterQuery}
          onChangeQuery={setFilterQuery}
          difficulty={filterDifficulty}
          onChangeDifficulty={setFilterDifficulty}
          onClear={clearFilters}
        />

        <DailyGoalCard />
      </aside>

      <section className="col-span-12 lg:col-span-9 space-y-6">
        <TopHud user={user!} tasks={tasks} levelUpPulse={levelUpPulse} />

        <KanbanBoard
          tasks={filteredTasks}
          setTasks={setTasks}
          onNeedReload={loadAll}
          onLevelUp={() => {
            setLevelUpPulse((v) => v + 1);
          }}
        />
      </section>
    </div>
  );
}