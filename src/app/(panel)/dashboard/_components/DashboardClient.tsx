"use client";

import { useEffect, useMemo, useState } from "react";
import TopHud from "./TopHud";
import KanbanBoard from "./KanbanBoard";
import NewTaskCard from "./NewTaskCard";
import FiltersCard from "./FiltersCard";
import DailyGoalCard from "./DailyGoalCard";
import WeekTabs from "./WeekTabs";
import DayReadOnlyList from "./DayReadOnlyList";
import QuestsCard from "./QuestsCard";

import type {
  TaskUI,
  TaskApi,
  UserApi,
  DifficultyFilter,
  QuestApi,
} from "../_types";
import { mapTaskApiToUI } from "../_utils/map";

function todayKeyLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function weekStartLocalKey() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day + 6) % 7;

  const monday = new Date(now);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(now.getDate() - diffToMonday);

  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const d = String(monday.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(dayKey: string, days: number) {
  const [y, m, d] = dayKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setHours(12, 0, 0, 0);
  dt.setDate(dt.getDate() + days);

  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function weekdayIndexMon0() {
  const day = new Date().getDay();
  return (day + 6) % 7;
}

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quests, setQuests] = useState<QuestApi[]>([]);
  const [user, setUser] = useState<UserApi | null>(null);
  const [tasks, setTasks] = useState<TaskUI[]>([]);
  const [levelUpPulse, setLevelUpPulse] = useState(0);

  const [filterQuery, setFilterQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] =
    useState<DifficultyFilter>("ALL");

  const [selectedWeekday, setSelectedWeekday] = useState<number>(() =>
    weekdayIndexMon0()
  );

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const [meRes, tasksRes, questsRes] = await Promise.all([
        fetch("/api/me", { cache: "no-store" }),
        fetch("/api/tasks", { cache: "no-store" }),
        fetch("/api/quests/today", { cache: "no-store" }),
      ]);

      if (!meRes.ok) throw new Error("Falha ao carregar /api/me");
      if (!tasksRes.ok) throw new Error("Falha ao carregar /api/tasks");
      if (!questsRes.ok) throw new Error("Falha ao carregar /api/quests/today");

      const meJson = (await meRes.json()) as UserApi;
      const tasksJson = (await tasksRes.json()) as TaskApi[];
      const questsJson = (await questsRes.json()) as { quests: QuestApi[] };

      setUser(meJson);
      setTasks(tasksJson.map(mapTaskApiToUI));
      setQuests(questsJson.quests ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function clearFilters() {
    setFilterQuery("");
    setFilterDifficulty("ALL");
  }

  const todayKey = useMemo(() => todayKeyLocal(), []);
  const selectedDayKey = useMemo(() => {
    const weekStart = weekStartLocalKey();
    return addDays(weekStart, selectedWeekday);
  }, [selectedWeekday]);

  const completedTotal = useMemo(() => {
    return tasks.filter((t) => t.completed).length;
  }, [tasks]);

  const todayTasks = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();

    return tasks
      .filter((t) => t.dayKey === todayKey)
      .filter((t) => {
        const matchQuery = q.length === 0 || t.title.toLowerCase().includes(q);
        const matchDifficulty =
          filterDifficulty === "ALL" || t.difficulty === filterDifficulty;
        return matchQuery && matchDifficulty;
      });
  }, [tasks, todayKey, filterQuery, filterDifficulty]);

  const selectedDayTasks = useMemo(() => {
    return tasks.filter((t) => t.dayKey === selectedDayKey);
  }, [tasks, selectedDayKey]);

  if (loading) {
    return <div className="text-white/70">Carregando dashboard...</div>;
  }

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

  if (!user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-white/70">
        Usuário não carregado.
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

        <QuestsCard
          quests={quests}
          onNeedReload={loadAll}
          onLevelUp={() => setLevelUpPulse((v) => v + 1)}
        />

        <DailyGoalCard />
      </aside>

      <section className="col-span-12 lg:col-span-9 space-y-6">
        <TopHud
          user={user}
          completedTotal={completedTotal}
          levelUpPulse={levelUpPulse}
        />

        <WeekTabs value={selectedWeekday} onChange={setSelectedWeekday} />

        <KanbanBoard
          tasks={todayTasks}
          setTasks={setTasks}
          onNeedReload={loadAll}
          onLevelUp={() => setLevelUpPulse((v) => v + 1)}
        />

        <DayReadOnlyList
          title="Lista do dia selecionado (somente leitura)"
          dayKey={selectedDayKey}
          tasks={selectedDayTasks}
        />
      </section>
    </div>
  );
}