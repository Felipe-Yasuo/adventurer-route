"use client";

import { useEffect, useState } from "react";
import TopHud from "./TopHud";
import KanbanBoard from "./KanbanBoard";
import NewTaskCard from "./NewTaskCard";
import FiltersCard from "./FiltersCard";
import DailyGoalCard from "./DailyGoalCard";
import type { TaskUI } from "./types";

type UserApi = {
  level: number;
  xp: number;
  life: number;
  maxLife: number;
  gold: number;
  streakCount: number;
  avatarUrl?: string | null;
  penalties?: any;
};

type TaskApi = {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  dueDate: string | null;
  completed: boolean;
  completedAt: string | null;
};

function mapTaskApiToUI(t: TaskApi): TaskUI {
  return {
    id: t.id,
    title: t.title,
    difficulty: t.difficulty,
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : null,
    completed: t.completed,
    description: null,
    tags: [],
  };
}

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserApi | null>(null);
  const [tasks, setTasks] = useState<TaskUI[]>([]);

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
        <FiltersCard />
        <DailyGoalCard />
      </aside>

      <section className="col-span-12 lg:col-span-9 space-y-6">
        <TopHud user={user!} tasks={tasks} />
        <KanbanBoard tasks={tasks} setTasks={setTasks} onNeedReload={loadAll} />
      </section>
    </div>
  );
}