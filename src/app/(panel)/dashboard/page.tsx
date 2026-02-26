"use client";

import { useEffect, useState } from "react";

type User = {
    level: number;
    xp: number;
    life: number;
    maxLife: number;
    gold: number;
    streakCount: number;
    avatarUrl?: string | null;
};

type Task = {
    id: string;
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    completed: boolean;
};

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
    const [loading, setLoading] = useState(false);

    async function loadData() {
        const [userRes, tasksRes] = await Promise.all([
            fetch("/api/me"),
            fetch("/api/tasks"),
        ]);

        const userData = await userRes.json();
        const tasksData = await tasksRes.json();

        setUser(userData);
        setTasks(tasksData);
    }

    useEffect(() => {
        loadData();
    }, []);

    async function createTask() {
        if (!title.trim()) return;

        setLoading(true);

        await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, difficulty }),
        });

        setTitle("");
        await loadData();
        setLoading(false);
    }

    async function completeTask(id: string) {
        await fetch(`/api/tasks/${id}/complete`, {
            method: "PATCH",
        });

        await loadData();
    }

    if (!user) return <div className="p-6">Carregando...</div>;

    return (
        <main className="min-h-screen p-6 space-y-6">
            <section className="rounded-2xl border p-4 flex items-center gap-4">
                {user.avatarUrl && (
                    <img
                        src={user.avatarUrl}
                        alt="avatar"
                        className="w-16 h-16 rounded-full border"
                    />
                )}

                <div>
                    <h2 className="text-xl font-bold">Level {user.level}</h2>
                    <p>XP: {user.xp}</p>
                    <p>Vida: {user.life}/{user.maxLife}</p>
                    <p>Gold: {user.gold}</p>
                    <p>Streak: {user.streakCount}</p>
                </div>
            </section>

            <section className="rounded-2xl border p-4 space-y-3">
                <h3 className="font-semibold">Criar Task</h3>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título da task"
                    className="border p-2 rounded w-full"
                />

                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="border p-2 rounded w-full"
                >
                    <option value="EASY">Fácil</option>
                    <option value="MEDIUM">Médio</option>
                    <option value="HARD">Difícil</option>
                </select>

                <button
                    onClick={createTask}
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Criar
                </button>
            </section>

            <section className="rounded-2xl border p-4 space-y-3">
                <h3 className="font-semibold">Tasks</h3>

                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex justify-between items-center border p-2 rounded"
                    >
                        <div>
                            <p className={task.completed ? "line-through" : ""}>
                                {task.title}
                            </p>
                            <small>{task.difficulty}</small>
                        </div>

                        {!task.completed && (
                            <button
                                onClick={() => completeTask(task.id)}
                                className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                                Concluir
                            </button>
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
}