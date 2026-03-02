"use client";

import { useEffect, useMemo, useState } from "react";
import TopHud from "./TopHud";
import KanbanBoard from "./KanbanBoard";
import NewTaskCard from "./NewTaskCard";
import FiltersCard from "./FiltersCard";
import DailyGoalCard from "./DailyGoalCard";
import WeekTabs from "./WeekTabs";

import type { TaskUI, TaskApi, UserApi, DifficultyFilter } from "../_types";
import { mapTaskApiToUI } from "../_utils/map";

function todayKeyLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// segunda = 0, ..., domingo = 6
function weekStartLocalKey() {
  const now = new Date();
  const day = now.getDay(); // 0=Dom, 1=Seg...
  const diffToMonday = (day + 6) % 7;

  const monday = new Date(now);
  monday.setHours(12, 0, 0, 0); // evita edge de DST
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
  const day = new Date().getDay(); // 0=Dom
  // converte para 0=Seg ... 6=Dom
  return (day + 6) % 7;
}

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<UserApi | null>(null);
  const [tasks, setTasks] = useState<TaskUI[]>([]);
  const [levelUpPulse, setLevelUpPulse] = useState(0);

  const [filterQuery, setFilterQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] =
    useState<DifficultyFilter>("ALL");

  // ✅ Etapa 3: aba selecionada (0=Seg..6=Dom)
  const [selectedWeekday, setSelectedWeekday] = useState<number>(() =>
    weekdayIndexMon0()
  );

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

  function clearFilters() {
    setFilterQuery("");
    setFilterDifficulty("ALL");
  }

  // ✅ dayKey da aba selecionada (Seg..Dom) dentro da semana atual
  const selectedDayKey = useMemo(() => {
    const weekStart = weekStartLocalKey();
    return addDays(weekStart, selectedWeekday);
  }, [selectedWeekday]);

  const filteredTasks = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();

    // ✅ Etapa 3: só tasks do dia selecionado
    const byDay = tasks.filter((t) => t.dayKey === selectedDayKey);

    return byDay.filter((t) => {
      const matchQuery = q.length === 0 || t.title.toLowerCase().includes(q);
      const matchDifficulty =
        filterDifficulty === "ALL" || t.difficulty === filterDifficulty;

      return matchQuery && matchDifficulty;
    });
  }, [tasks, filterQuery, filterDifficulty, selectedDayKey]);

  // (opcional) se você quiser mostrar no HUD quantas tasks totais existem (sem filtrar por dia),
  // mantenha "tasks" no TopHud como está.

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

  // ✅ segurança
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

        <DailyGoalCard />
      </aside>

      <section className="col-span-12 lg:col-span-9 space-y-6">
        <TopHud user={user} tasks={tasks} levelUpPulse={levelUpPulse} />

        {/* ✅ Etapa 3: abas da semana */}
        <WeekTabs value={selectedWeekday} onChange={setSelectedWeekday} />

        <KanbanBoard
          tasks={filteredTasks}
          setTasks={setTasks}
          onNeedReload={loadAll}
          onLevelUp={() => setLevelUpPulse((v) => v + 1)}
        />

        {/* debugzinho útil (remove depois) */}
        <div className="text-xs text-white/40">
          Dia selecionado: <span className="text-white/60">{selectedDayKey}</span>{" "}
          • Hoje: <span className="text-white/60">{todayKeyLocal()}</span>
        </div>
      </section>
    </div>
  );
}