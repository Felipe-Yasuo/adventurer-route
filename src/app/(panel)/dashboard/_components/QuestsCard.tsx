"use client";

import { useMemo, useState } from "react";
import GlassCard from "./GlassCard";
import { useToast } from "./toast";
import type { QuestApi } from "../_types";

type Tab = "DAILY" | "WEEKLY";

function pct(progress: number, target: number) {
    if (target <= 0) return 0;
    return Math.max(0, Math.min(100, (progress / target) * 100));
}

function statusBadge(q: QuestApi) {
    const base =
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold border border-white/10";

    if (q.status === "CLAIMED") return `${base} bg-forest/20 text-cloudWhite`;
    if (q.progress >= q.target) return `${base} bg-blueSoft/20 text-cloudWhite`;
    return `${base} bg-white/5 text-white/70`;
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

function TabButton({
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
    const [tab, setTab] = useState<Tab>("DAILY");

    const daily = useMemo(() => quests.filter((q) => q.type === "DAILY"), [quests]);
    const weekly = useMemo(() => quests.filter((q) => q.type === "WEEKLY"), [quests]);

    const shown = tab === "DAILY" ? daily : weekly;

    async function handleClaim(q: QuestApi) {
        try {
            const result = await claimQuestApi(q.id);
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

    return (
        <GlassCard>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold">Quests</h3>
                    <p className="mt-1 text-xs text-white/60">
                        {tab === "DAILY" ? "Missões de hoje" : "Missões da semana"}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">{shown.length}</span>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <TabButton active={tab === "DAILY"} onClick={() => setTab("DAILY")}>
                    Hoje ({daily.length})
                </TabButton>
                <TabButton active={tab === "WEEKLY"} onClick={() => setTab("WEEKLY")}>
                    Semana ({weekly.length})
                </TabButton>
            </div>

            <div className="mt-3 space-y-3">
                {shown.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                        Nenhuma quest {tab === "DAILY" ? "de hoje" : "da semana"}.
                    </div>
                ) : (
                    shown.map((q) => {
                        const done = q.progress >= q.target;
                        const claimed = q.status === "CLAIMED";
                        const p = pct(q.progress, q.target);

                        return (
                            <div
                                key={q.id}
                                className="rounded-2xl border border-white/10 bg-black/20 p-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-cloudWhite truncate">
                                                {q.title}
                                            </p>
                                            <span className={statusBadge(q)}>
                                                {claimed ? "resgatada" : done ? "completa" : "ativa"}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs text-white/60">{q.description}</p>

                                        <div className="mt-3">
                                            <div className="flex items-center justify-between text-xs text-white/70">
                                                <span>Progresso</span>
                                                <span className="text-white/80">
                                                    {Math.min(q.progress, q.target)}/{q.target}
                                                </span>
                                            </div>

                                            <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className="h-full bg-forest transition-all"
                                                    style={{ width: `${p}%` }}
                                                />
                                            </div>

                                            <div className="mt-2 text-[11px] text-white/50">
                                                Recompensa: +{q.rewardXp} XP • +{q.rewardGold} GOLD
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0">
                                        <button
                                            onClick={() => handleClaim(q)}
                                            disabled={!done || claimed}
                                            className={[
                                                "rounded-xl px-3 py-2 text-xs font-semibold border transition",
                                                !done || claimed
                                                    ? "bg-white/5 border-white/10 text-white/40 cursor-not-allowed"
                                                    : "bg-cloudWhite text-twilight border-black/10 hover:opacity-90",
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

            <p className="mt-3 text-[11px] text-white/40">
                * Conclua tasks no Kanban para avançar. Quando completar, resgate aqui.
            </p>
        </GlassCard>
    );
}