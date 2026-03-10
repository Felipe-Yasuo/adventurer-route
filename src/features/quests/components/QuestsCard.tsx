"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/features/shared/components/toast";
import type { QuestApi } from "@/features/tasks/types";
import { useMe } from "@/features/shared/components/me-store";
import QuestFrame from "@/features/quests/components/QuestFrame";

type Tab = "DAILY" | "WEEKLY";

function pct(progress: number, target: number) {
    if (target <= 0) return 0;
    return Math.max(0, Math.min(100, (progress / target) * 100));
}


async function claimQuestApi(id: string) {
    const res = await fetch(`/api/quests/${id}/claim`, { method: "POST" });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(json?.error ?? "Falha ao resgatar quest");
    }

    return json as {
        rewards?: { xp: number; gold: number };
        leveledUp?: number;
        user?: any;
        quest?: QuestApi;
    };
}


export default function QuestsCard({
    quests,
    onNeedReload,
    onLevelUp,
}: {
    quests: QuestApi[];
    onNeedReload: () => Promise<void>;
    onLevelUp: () => void;
}) {
    const toast = useToast();
    const { setMe } = useMe(); // ✅ NOVO
    const [tab, setTab] = useState<Tab>("DAILY");

    const daily = useMemo(() => quests.filter((q) => q.type === "DAILY"), [quests]);
    const weekly = useMemo(() => quests.filter((q) => q.type === "WEEKLY"), [quests]);

    const shown = tab === "DAILY" ? daily : weekly;

    const shownSorted = useMemo(() => {
        function rank(q: QuestApi) {
            const done = q.progress >= q.target;
            const claimed = q.status === "CLAIMED";
            if (done && !claimed) return 0;
            if (!done && !claimed) return 1;
            return 2;
        }

        return [...shown].sort((a, b) => {
            const ra = rank(a);
            const rb = rank(b);
            if (ra !== rb) return ra - rb;

            const pa = a.target > 0 ? a.progress / a.target : 0;
            const pb = b.target > 0 ? b.progress / b.target : 0;
            return pb - pa;
        });
    }, [shown]);

    async function handleClaim(q: QuestApi) {
        try {
            const result = await claimQuestApi(q.id);

            if (result.user) {
                setMe((prev) => (prev ? { ...prev, ...result.user } : result.user));
            }

            const xp = result.rewards?.xp ?? 0;
            const gold = result.rewards?.gold ?? 0;

            toast.push({
                type: "success",
                title: "Recompensa resgatada! 🎁",
                message: `+${xp} XP • +${gold} GOLD`,
                durationMs: 3500,
            });

            const leveledUp = result.leveledUp ?? 0;
            if (leveledUp > 0) {
                onLevelUp();
                toast.push({
                    type: "info",
                    title: "LEVEL UP! ✨",
                    message: `Você subiu ${leveledUp} nível(is)!`,
                    durationMs: 3400,
                });
            }

            await onNeedReload();
        } catch (e: any) {
            toast.push({
                type: "error",
                title: "Erro ao resgatar",
                message: e?.message ?? "Tente novamente",
                durationMs: 3200,
            });
        }
    }

    const enableQuestScroll = shownSorted.length > 2;

    return (
        <QuestFrame>
            <div className="text-[color:var(--color-ink)]">
                <div className="mt-12 grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setTab("DAILY")}
                        className={[
                            "rounded-xl border px-4 py-2 text-sm font-semibold transition",
                            tab === "DAILY"
                                ? "bg-[rgba(242,228,198,0.95)] border-black/15 shadow-sm"
                                : "bg-[rgba(255,255,255,0.35)] border-black/10 hover:bg-[rgba(255,255,255,0.5)]",
                        ].join(" ")}
                    >
                        Hoje ({daily.length})
                    </button>

                    <button
                        onClick={() => setTab("WEEKLY")}
                        className={[
                            "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                            tab === "WEEKLY"
                                ? "bg-[rgba(242,228,198,0.95)] border-black/15 shadow-sm"
                                : "bg-[rgba(255,255,255,0.35)] border-black/10 hover:bg-[rgba(255,255,255,0.5)]",
                        ].join(" ")}
                    >
                        Semana ({weekly.length})
                    </button>
                </div>

                <div
                    className={[
                        "mt-4 space-y-3 pr-2",
                        enableQuestScroll ? "max-h-[360px] overflow-y-auto" : "overflow-y-hidden",
                    ].join(" ")}
                >
                    {shown.length === 0 ? (
                        <div className="rounded-xl border border-black/10 bg-[rgba(255,255,255,0.35)] p-4 text-sm text-[color:var(--color-ink)]/70">
                            Nenhuma quest {tab === "DAILY" ? "de hoje" : "da semana"}.
                        </div>
                    ) : (
                        shownSorted.map((q) => {
                            const done = q.progress >= q.target;
                            const claimed = q.status === "CLAIMED";
                            const p = pct(q.progress, q.target);

                            return (
                                <div
                                    key={q.id}
                                    className={[
                                        "rounded-2xl border p-4",
                                        "bg-[rgba(242,228,198,0.92)] border-black/10",
                                        done && !claimed ? "ring-1 ring-[rgba(75,111,184,0.25)]" : "",
                                    ].join(" ")}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-base font-bold leading-tight text-[color:var(--color-ink)] break-words">
                                                    {q.title}
                                                </p>
                                            </div>

                                            <span
                                                className={[
                                                    "shrink-0 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold border",
                                                    claimed
                                                        ? "bg-[rgba(47,143,91,0.18)] border-[rgba(47,143,91,0.25)]"
                                                        : done
                                                            ? "bg-[rgba(75,111,184,0.16)] border-[rgba(75,111,184,0.25)]"
                                                            : "bg-[rgba(0,0,0,0.05)] border-black/10",
                                                ].join(" ")}
                                            >
                                                {claimed ? "resgatada" : done ? "✅ completa" : "ativa"}
                                            </span>
                                        </div>

                                        <p className="text-sm leading-relaxed text-[color:var(--color-ink)]/72">
                                            {q.description}
                                        </p>

                                        <div>
                                            <div className="flex items-center justify-between text-sm text-[color:var(--color-ink)]/72">
                                                <span>Progresso</span>
                                                <span className="font-semibold">
                                                    {Math.min(q.progress, q.target)}/{q.target}
                                                </span>
                                            </div>

                                            <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/10">
                                                <div
                                                    className="h-full bg-[rgba(47,143,91,0.75)] transition-all"
                                                    style={{ width: `${p}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="text-sm leading-relaxed text-[color:var(--color-ink)]/65">
                                            Recompensa: +{q.rewardXp} XP • +{q.rewardGold} GOLD
                                        </div>

                                        <div className="pt-1">
                                            <button
                                                onClick={() => handleClaim(q)}
                                                disabled={!done || claimed}
                                                className={[
                                                    "w-full rounded-xl px-3 py-3 text-sm font-semibold border transition",
                                                    !done || claimed
                                                        ? "bg-[rgba(0,0,0,0.05)] border-black/10 text-[color:var(--color-ink)]/35 cursor-not-allowed"
                                                        : "bg-[rgba(212,160,23,0.20)] border-[rgba(212,160,23,0.35)] text-[color:var(--color-ink)] hover:bg-[rgba(212,160,23,0.28)]",
                                                ].join(" ")}
                                            >
                                                {claimed ? "Resgatada" : done ? "Resgatar" : "Em progresso"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </QuestFrame>
    );
}

