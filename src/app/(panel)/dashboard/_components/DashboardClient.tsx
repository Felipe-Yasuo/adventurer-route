"use client";

import { useEffect, useMemo, useState } from "react";
import TopHud from "./TopHud";
import KanbanBoard from "./KanbanBoard";
import NewTaskCard from "./NewTaskCard";
import FiltersCard from "./FiltersCard";
import WeekTabs from "./WeekTabs";
import DayReadOnlyList from "./DayReadOnlyList";
import QuestsCard from "./QuestsCard";

import type { TaskUI, TaskApi, UserApi, DifficultyFilter, QuestApi } from "../_types";
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

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? `Falha ao carregar ${url}`);
  }
  return (await res.json()) as T;
}

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quests, setQuests] = useState<QuestApi[]>([]);
  const [user, setUser] = useState<UserApi | null>(null);

  const [tasksToday, setTasksToday] = useState<TaskUI[]>([]);
  const [tasksSelected, setTasksSelected] = useState<TaskUI[]>([]);

  const [levelUpPulse, setLevelUpPulse] = useState(0);

  const [filterQuery, setFilterQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyFilter>("ALL");

  const [selectedWeekday, setSelectedWeekday] = useState<number>(() => weekdayIndexMon0());

  const todayKey = useMemo(() => todayKeyLocal(), []);
  const selectedDayKey = useMemo(() => {
    const weekStart = weekStartLocalKey();
    return addDays(weekStart, selectedWeekday);
  }, [selectedWeekday]);

  async function loadMeAndQuests() {
    const [meJson, questsJson] = await Promise.all([
      fetchJson<UserApi>("/api/me"),
      fetchJson<{ quests: QuestApi[] }>("/api/quests/today"),
    ]);

    setUser(meJson);
    setQuests(questsJson.quests ?? []);
  }

  async function loadToday() {
    const tasksJson = await fetchJson<TaskApi[]>(`/api/tasks?dayKey=${todayKey}`);
    setTasksToday(tasksJson.map(mapTaskApiToUI));
  }

  async function loadSelectedDay(dayKey: string) {
    if (dayKey === todayKey) {
      setTasksSelected(tasksToday);
      return;
    }

    const tasksJson = await fetchJson<TaskApi[]>(`/api/tasks?dayKey=${dayKey}`);
    setTasksSelected(tasksJson.map(mapTaskApiToUI));
  }

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadMeAndQuests(),
        loadToday(),
        loadSelectedDay(selectedDayKey),
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

  useEffect(() => {
    if (loading) return;

    (async () => {
      try {
        setError(null);
        await loadSelectedDay(selectedDayKey);
      } catch (e: any) {
        setError(e?.message ?? "Erro desconhecido");
      }
    })();
  }, [selectedDayKey]);

  useEffect(() => {
    if (selectedDayKey === todayKey) {
      setTasksSelected(tasksToday);
    }
  }, [tasksToday, selectedDayKey, todayKey]);

  function clearFilters() {
    setFilterQuery("");
    setFilterDifficulty("ALL");
  }

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
      </aside>

      <section className="col-span-12 lg:col-span-9 space-y-6">
        <TopHud user={user} completedTotal={completedTotal} levelUpPulse={levelUpPulse} />

        <WeekTabs value={selectedWeekday} onChange={setSelectedWeekday} />

        <KanbanBoard
          tasks={todayTasksFiltered}
          setTasks={setTasksToday}
          onNeedReload={loadAll}
          onLevelUp={() => setLevelUpPulse((v) => v + 1)}
        />

        <DayReadOnlyList
          title="Lista do dia selecionado (somente leitura)"
          dayKey={selectedDayKey}
          tasks={tasksSelected}
        />
      </section>
    </div>
  );
}