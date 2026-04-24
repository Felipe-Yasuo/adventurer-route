"use client";

import { useEffect, useMemo, useState } from "react";
import type { AchievementApi, AchievementFilter } from "@/features/achievements/types";

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
                "rounded-xl border-2 px-4 py-2.5 text-sm font-semibold tracking-wide transition",
                active
                    ? "border-(--color-gold) bg-(--color-gold)/15 text-(--color-gold) shadow-[0_0_14px_-4px_rgba(212,175,55,0.6)]"
                    : "border-(--color-border) bg-(--color-surfaceAlt) text-(--color-muted) hover:border-(--color-gold)/40 hover:text-(--color-gold)",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function SummaryCard({
    iconSrc,
    label,
    value,
    total,
    tone = "default",
}: {
    iconSrc: string;
    label: string;
    value: number;
    total?: number;
    tone?: "default" | "gold" | "muted";
}) {
    const border =
        tone === "gold"
            ? "border-(--color-gold)/50"
            : tone === "muted"
            ? "border-(--color-border)"
            : "border-(--color-border)";

    const glow =
        tone === "gold"
            ? "shadow-[0_0_20px_-8px_rgba(212,175,55,0.5)]"
            : "shadow-(--shadow-card)";

    const valueColor =
        tone === "gold" ? "text-(--color-gold)" : "text-(--color-ink)";

    return (
        <div
            className={[
                "flex items-center gap-4 rounded-2xl border-2 bg-(--color-surface) p-5 transition",
                border,
                glow,
            ].join(" ")}
        >
            <img
                src={iconSrc}
                alt=""
                className="h-14 w-14 shrink-0 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)]"
            />
            <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(--color-muted)">
                    {label}
                </div>
                <div className={["mt-1 font-serif text-3xl italic leading-none", valueColor].join(" ")}>
                    {value}
                    {typeof total === "number" ? (
                        <span className="ml-1 text-lg text-(--color-muted) not-italic">
                            /{total}
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function AchievementCard({ a }: { a: AchievementApi }) {
    const unlocked = statusFrom(a) === "UNLOCKED";
    const iconSrc = unlocked
        ? "/ui/achievements/unlocked.png"
        : "/ui/achievements/locked.png";

    return (
        <section
            className={[
                "group relative flex flex-col rounded-2xl border-2 bg-(--color-surface) p-5 transition",
                unlocked
                    ? "border-(--color-gold)/55 shadow-[0_0_22px_-8px_rgba(212,175,55,0.55)] hover:-translate-y-1 hover:border-(--color-gold)/80"
                    : "border-(--color-border) shadow-(--shadow-card) hover:-translate-y-0.5 hover:border-(--color-border)",
            ].join(" ")}
        >
            {unlocked ? (
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-(--color-gold)/10 blur-3xl"
                />
            ) : null}

            <div className="relative flex items-start gap-4">
                <div className="relative shrink-0">
                    <div
                        aria-hidden
                        className={[
                            "absolute inset-0 m-auto h-20 w-20 rounded-full blur-xl transition",
                            unlocked
                                ? "bg-(--color-gold)/25 opacity-80"
                                : "bg-transparent opacity-0",
                        ].join(" ")}
                    />
                    <img
                        src={iconSrc}
                        alt=""
                        className={[
                            "relative h-20 w-20 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] transition",
                            unlocked
                                ? "group-hover:scale-105"
                                : "saturate-50 opacity-80 group-hover:opacity-95",
                        ].join(" ")}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div
                        className={[
                            "text-[10px] font-semibold uppercase tracking-[0.22em]",
                            unlocked ? "text-(--color-gold)" : "text-(--color-muted)",
                        ].join(" ")}
                    >
                        {unlocked ? "◆ Conquistado" : "◇ Por desbloquear"}
                    </div>

                    <h3
                        className={[
                            "mt-1 font-serif text-lg italic",
                            unlocked ? "text-(--color-ink)" : "text-(--color-ink)/75",
                        ].join(" ")}
                    >
                        {a.title}
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-(--color-muted)">
                        {a.description ?? "Feito misterioso aguarda um herói."}
                    </p>
                </div>
            </div>

            <div className="relative mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-(--color-border) bg-(--color-bg)/50 px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-(--color-muted)">
                        Recompensa
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                        <span className="text-(--color-gold)">+{a.rewardXp}</span>
                        <span className="text-[10px] text-(--color-muted)">XP</span>
                        <span className="mx-0.5 text-(--color-muted)">·</span>
                        <img
                            src="/ui/stats/gold.png"
                            alt=""
                            className="h-4 w-4 object-contain"
                        />
                        <span className="text-(--color-gold)">+{a.rewardGold}</span>
                    </div>
                </div>

                <div className="rounded-xl border border-(--color-border) bg-(--color-bg)/50 px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-(--color-muted)">
                        Meta
                    </div>
                    <div className="mt-1 text-sm font-semibold text-(--color-ink)">
                        {a.target}
                    </div>
                </div>
            </div>

            <div className="relative mt-3 border-t border-(--color-border)/50 pt-3 text-[11px] italic">
                {unlocked ? (
                    <span className="text-(--color-muted)">
                        Selada em{" "}
                        <span className="font-semibold text-(--color-ink)/85 not-italic">
                            {a.unlockedAt ? formatPtBrDateTime(a.unlockedAt) : "—"}
                        </span>
                    </span>
                ) : (
                    <span className="text-(--color-muted)">
                        Ainda aguarda seu feito.
                    </span>
                )}
            </div>
        </section>
    );
}

export default function AchievementsClient() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [all, setAll] = useState<AchievementApi[]>([]);
    const [filter, setFilter] = useState<AchievementFilter>("ALL");

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

    const progressPct = counts.total > 0 ? (counts.unlocked / counts.total) * 100 : 0;

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
            <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-(--color-muted) shadow-(--shadow-card)">
                Consultando o mural da guilda...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-(--color-hard)/40 bg-(--color-surface) p-6 shadow-(--shadow-card)">
                <p className="text-(--color-hard)">Erro: {error}</p>

                <button
                    onClick={loadAll}
                    className="mt-4 rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) px-4 py-2 text-sm font-semibold text-(--color-ink) transition hover:bg-(--color-surface)"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="relative overflow-hidden rounded-2xl border border-(--color-border) bg-linear-to-br from-(--color-surface) via-(--color-surfaceAlt) to-(--color-surface) p-6 shadow-(--shadow-card)">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src="/ui/icons/conquistas.png"
                            alt=""
                            className="h-16 w-16 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.55)]"
                        />
                        <div>
                            <div className="flex items-center gap-2 text-(--color-gold)">
                                <span className="text-xs" aria-hidden>◆</span>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                                    Feitos Lendários
                                </span>
                                <span className="text-xs" aria-hidden>◆</span>
                            </div>
                            <h1 className="mt-1 font-serif text-3xl italic text-(--color-ink)">
                                Seu mural de glórias.
                            </h1>
                            <p className="mt-1 max-w-xl text-sm text-(--color-muted)">
                                Cada conquista é um selo gravado no pergaminho — prova de que sua saga avança.
                            </p>
                        </div>
                    </div>

                    <div className="min-w-72 rounded-2xl border border-(--color-gold)/40 bg-(--color-bg)/80 px-5 py-3 shadow-[0_0_18px_-6px_rgba(212,175,55,0.55)]">
                        <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--color-muted)">
                                Progresso da jornada
                            </span>
                            <span className="text-sm font-bold text-(--color-gold)">
                                {counts.unlocked}/{counts.total}
                            </span>
                        </div>
                        <div className="mt-2 h-3 overflow-hidden rounded-full border border-black/60 bg-black/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)]">
                            <div
                                className="h-full rounded-full bg-linear-to-r from-(--color-gold)/70 via-(--color-gold) to-amber-300 shadow-[0_0_8px_rgba(212,175,55,0.7)] transition-[width] duration-500 ease-out"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <div className="mt-1 text-[10px] italic text-(--color-muted)">
                            {progressPct >= 100
                                ? "Lenda completa — todos os selos em seu brasão."
                                : counts.unlocked === 0
                                ? "Sua jornada mal começou. Complete missões e desperte os selos."
                                : "A glória se acumula. Siga em frente."}
                        </div>
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <SummaryCard
                    iconSrc="/ui/icons/conquistas.png"
                    label="Total de feitos"
                    value={counts.total}
                />
                <SummaryCard
                    iconSrc="/ui/achievements/unlocked.png"
                    label="Desbloqueados"
                    value={counts.unlocked}
                    total={counts.total}
                    tone="gold"
                />
                <SummaryCard
                    iconSrc="/ui/achievements/locked.png"
                    label="Por conquistar"
                    value={counts.locked}
                    tone="muted"
                />
            </section>

            <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card)">
                <div className="flex flex-wrap gap-2">
                    <FilterButton active={filter === "ALL"} onClick={() => setFilter("ALL")}>
                        Todos ({counts.total})
                    </FilterButton>

                    <FilterButton
                        active={filter === "UNLOCKED"}
                        onClick={() => setFilter("UNLOCKED")}
                    >
                        Desbloqueados ({counts.unlocked})
                    </FilterButton>

                    <FilterButton active={filter === "LOCKED"} onClick={() => setFilter("LOCKED")}>
                        Bloqueados ({counts.locked})
                    </FilterButton>
                </div>
            </section>

            {sorted.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-(--color-border) bg-(--color-surfaceAlt)/40 p-10 text-center">
                    <img
                        src="/ui/achievements/locked.png"
                        alt=""
                        className="h-20 w-20 object-contain opacity-60"
                    />
                    <div className="font-serif text-base italic text-(--color-ink)/85">
                        Nenhum feito nesta categoria.
                    </div>
                    <div className="text-xs text-(--color-muted)">
                        Mude o filtro ou siga cumprindo missões — os selos aparecem quando menos se espera.
                    </div>
                </div>
            ) : (
                <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {sorted.map((a) => (
                        <AchievementCard key={a.id} a={a} />
                    ))}
                </section>
            )}
        </div>
    );
}
