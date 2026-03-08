"use client";

import { useEffect, useMemo, useState } from "react";

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
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold border";

    if (status === "UNLOCKED") {
        return (
            <span className={`${base} border-[rgba(47,143,91,0.2)] bg-[rgba(47,143,91,0.12)] text-[color:var(--color-ink)]`}>
                ✅ desbloqueada
            </span>
        );
    }

    return (
        <span className={`${base} border-black/10 bg-[rgba(0,0,0,0.04)] text-[color:var(--color-ink)]/75`}>
            🔒 bloqueada
        </span>
    );
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
                "rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                active
                    ? "border-[rgba(212,160,23,0.35)] bg-[rgba(212,160,23,0.18)] text-[color:var(--color-ink)]"
                    : "border-black/10 bg-[rgba(255,255,255,0.24)] text-[color:var(--color-ink)]/75 hover:bg-[rgba(255,255,255,0.38)]",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function SummaryCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: string;
}) {
    return (
        <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-4 shadow-[0_8px_14px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-[rgba(255,255,255,0.22)] text-xl">
                    {icon}
                </div>

                <div>
                    <div className="text-sm text-[color:var(--color-ink)]/65">{label}</div>
                    <div className="text-xl font-bold text-[color:var(--color-ink)]">{value}</div>
                </div>
            </div>
        </div>
    );
}

function AchievementCard({ a }: { a: AchievementApi }) {
    const status = statusFrom(a);

    return (
        <section className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-5 shadow-[0_10px_18px_rgba(0,0,0,0.1)] transition hover:translate-y-[-2px] hover:shadow-[0_14px_24px_rgba(0,0,0,0.12)]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-[16px] font-bold tracking-wide text-[color:var(--color-ink)]">
                        {a.title}
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-ink)]/68">
                        {a.description ?? "Sem descrição"}
                    </p>
                </div>

                <div className="shrink-0">
                    <StatusBadge status={status} />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.24)] px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink)]/55">
                        Recompensa
                    </div>
                    <div className="mt-2 text-sm font-semibold text-[color:var(--color-ink)]">
                        +{a.rewardXp} XP • +{a.rewardGold} GOLD
                    </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.24)] px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink)]/55">
                        Meta
                    </div>
                    <div className="mt-2 text-sm font-semibold text-[color:var(--color-ink)]">
                        {a.target}
                    </div>
                </div>
            </div>

            <div className="mt-4 text-xs text-[color:var(--color-ink)]/58">
                {status === "UNLOCKED" ? (
                    <>
                        Desbloqueada em:{" "}
                        <span className="font-medium text-[color:var(--color-ink)]/75">
                            {a.unlockedAt ? formatPtBrDateTime(a.unlockedAt) : "—"}
                        </span>
                    </>
                ) : (
                    <>Bloqueada (ainda não atingida)</>
                )}
            </div>

            <div className="mt-2 text-[11px] text-[color:var(--color-ink)]/42">
                Código: {a.code} • Tipo: {a.type}
            </div>
        </section>
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
                if (da !== db) return db - da;
            }

            return a.title.localeCompare(b.title);
        });
    }, [filtered]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.9)] p-6 text-[color:var(--color-ink)]/70 shadow-[0_8px_14px_rgba(0,0,0,0.1)]">
                Carregando conquistas...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-[rgba(178,59,59,0.2)] bg-[rgba(242,228,198,0.9)] p-6 shadow-[0_8px_14px_rgba(0,0,0,0.08)]">
                <p className="text-[color:var(--color-ink)]">Erro: {error}</p>

                <button
                    onClick={loadAll}
                    className="mt-4 rounded-xl border border-black/10 bg-[rgba(255,255,255,0.28)] px-4 py-2 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-[rgba(255,255,255,0.45)]"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-6 shadow-[0_10px_18px_rgba(0,0,0,0.1)]">
                <h1 className="text-2xl font-bold tracking-wide text-[color:var(--color-ink)]">
                    🏆 Conquistas
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]/68">
                    Veja o que você já desbloqueou e o que ainda falta na sua jornada.
                </p>
            </header>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <SummaryCard label="Total" value={counts.total} icon="📚" />
                <SummaryCard label="Desbloqueadas" value={counts.unlocked} icon="✅" />
                <SummaryCard label="Bloqueadas" value={counts.locked} icon="🔒" />
            </section>

            <section className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-4 shadow-[0_8px_14px_rgba(0,0,0,0.08)]">
                <div className="flex flex-wrap gap-2">
                    <FilterButton active={filter === "ALL"} onClick={() => setFilter("ALL")}>
                        Todas ({counts.total})
                    </FilterButton>

                    <FilterButton
                        active={filter === "UNLOCKED"}
                        onClick={() => setFilter("UNLOCKED")}
                    >
                        Desbloqueadas ({counts.unlocked})
                    </FilterButton>

                    <FilterButton active={filter === "LOCKED"} onClick={() => setFilter("LOCKED")}>
                        Bloqueadas ({counts.locked})
                    </FilterButton>
                </div>
            </section>

            {sorted.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-5 text-[color:var(--color-ink)]/68 shadow-[0_8px_14px_rgba(0,0,0,0.08)]">
                    Nenhuma conquista neste filtro.
                </div>
            ) : (
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {sorted.map((a) => (
                        <AchievementCard key={a.id} a={a} />
                    ))}
                </section>
            )}
        </div>
    );
}

