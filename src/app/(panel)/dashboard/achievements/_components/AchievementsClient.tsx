"use client";

import { useEffect, useMemo, useState } from "react";
import GlassCard from "@/app/(panel)/dashboard/_components/GlassCard";

type AchievementApi = {
    id: string;
    code: string;
    title: string;
    description: string | null;
    type: string;
    target: number;
    rewardGold: number;
    rewardXp: number;
    unlocked: boolean;
    unlockedAt: string | null;
};


type Filter = "ALL" | "UNLOCKED" | "LOCKED";

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(json?.error ?? `Falha ao carregar ${url}`);
    }
    return json as T;
}

function formatPtBrDateTime(iso: string) {
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return iso;

    return dt.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    });
}

function statusFrom(a: AchievementApi) {
    return a.unlocked ? "UNLOCKED" : "LOCKED";
}

function StatusBadge({ status }: { status: "UNLOCKED" | "LOCKED" }) {
    const base =
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold border border-white/10";

    if (status === "UNLOCKED") {
        return <span className={`${base} bg-forest/20 text-cloudWhite`}>✅ desbloqueada</span>;
    }

    return <span className={`${base} bg-white/5 text-white/70`}>🔒 bloqueada</span>;
}

function FilterButton({
    active,
    children,
    onClick,
}: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={[
                "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                active
                    ? "bg-cloudWhite text-twilight border-black/10"
                    : "bg-black/20 text-white/70 border-white/10 hover:bg-black/30",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

export default function AchievementsClient() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [all, setAll] = useState<AchievementApi[]>([]);
    const [filter, setFilter] = useState<Filter>("ALL");

    async function loadAll() {
        setLoading(true);
        setError(null);

        try {
            const list = await fetchJson<AchievementApi[]>("/api/achievements");
            setAll(list);
        } catch (e: any) {
            setError(e?.message ?? "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    const counts = useMemo(() => {
        let unlocked = 0;
        let locked = 0;

        for (const a of all) {
            if (statusFrom(a) === "UNLOCKED") unlocked += 1;
            else locked += 1;
        }

        return { total: all.length, unlocked, locked };
    }, [all]);

    const filtered = useMemo(() => {
        if (filter === "ALL") return all;

        const want = filter === "UNLOCKED" ? "UNLOCKED" : "LOCKED";
        return all.filter((a) => statusFrom(a) === want);
    }, [all, filter]);

    const sorted = useMemo(() => {

        return [...filtered].sort((a, b) => {
            const sa = statusFrom(a);
            const sb = statusFrom(b);
            if (sa !== sb) return sa === "UNLOCKED" ? -1 : 1;

            if (sa === "UNLOCKED") {
                const da = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
                const db = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
                if (da !== db) return db - da; // mais recente primeiro
            }

            return a.title.localeCompare(b.title);
        });
    }, [filtered]);

    if (loading) return <div className="text-white/70">Carregando conquistas...</div>;

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
        <div className="space-y-6">
            <header className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-cloudWhite">🏆 Conquistas</h1>
                    <p className="mt-1 text-sm text-white/60">
                        Veja o que você já desbloqueou e o que ainda falta.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                    <div className="text-xs text-white/60">Resumo</div>
                    <div className="text-sm text-cloudWhite">
                        ✅ {counts.unlocked} • 🔒 {counts.locked} • Total {counts.total}
                    </div>
                </div>
            </header>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                <div className="flex flex-wrap gap-2">
                    <FilterButton active={filter === "ALL"} onClick={() => setFilter("ALL")}>
                        Todas ({counts.total})
                    </FilterButton>
                    <FilterButton active={filter === "UNLOCKED"} onClick={() => setFilter("UNLOCKED")}>
                        Desbloqueadas ({counts.unlocked})
                    </FilterButton>
                    <FilterButton active={filter === "LOCKED"} onClick={() => setFilter("LOCKED")}>
                        Bloqueadas ({counts.locked})
                    </FilterButton>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sorted.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-white/60">
                        Nenhuma conquista neste filtro.
                    </div>
                ) : (
                    sorted.map((a) => {
                        const status = statusFrom(a);

                        return (
                            <GlassCard key={a.id}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-cloudWhite truncate">{a.title}</p>
                                        <p className="mt-1 text-xs text-white/60">
                                            {a.description ?? "Sem descrição"}
                                        </p>
                                    </div>

                                    <div className="shrink-0">
                                        <StatusBadge status={status} />
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                                        <div className="text-xs text-white/60">Recompensa</div>
                                        <div className="text-sm font-semibold text-cloudWhite">
                                            +{a.rewardXp} XP • +{a.rewardGold} GOLD
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                                        <div className="text-xs text-white/60">Meta</div>
                                        <div className="text-sm font-semibold text-cloudWhite">{a.target}</div>
                                    </div>
                                </div>

                                <div className="mt-3 text-[11px] text-white/40">
                                    {status === "UNLOCKED" ? (
                                        <>
                                            Desbloqueada em:{" "}
                                            <span className="text-white/60">
                                                {a.unlockedAt ? formatPtBrDateTime(a.unlockedAt) : "—"}
                                            </span>
                                        </>
                                    ) : (
                                        <>Bloqueada (ainda não atingida)</>
                                    )}
                                </div>

                                <div className="mt-2 text-[11px] text-white/30">
                                    Código: {a.code} • Tipo: {a.type}
                                </div>
                            </GlassCard>
                        );
                    })
                )}
            </div>
        </div>
    );
}