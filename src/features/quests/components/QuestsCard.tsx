"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/features/shared/components/toast";
import type { QuestApi } from "@/features/tasks/types";
import { useMe } from "@/features/shared/components/me-store";
import QuestFrame from "@/features/quests/components/QuestFrame";
import AnimatedProgress from "@/components/animations/AnimatedProgress";
import GoldParticles from "@/components/animations/GoldParticles";
import FloatingText, { type FloatingTextItem } from "@/components/animations/FloatingText";

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
    setQuests,
    onLevelUp,
}: {
    quests: QuestApi[];
    setQuests: React.Dispatch<React.SetStateAction<QuestApi[]>>;
    onLevelUp: () => void;
}) {
    const toast = useToast();
    const { setMe } = useMe();
    const [tab, setTab] = useState<Tab>("DAILY");
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [flashId, setFlashId] = useState<string | null>(null);
    const [floatByQuest, setFloatByQuest] = useState<Record<string, FloatingTextItem[]>>({});

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

    function pushFloatingForQuest(questId: string, items: FloatingTextItem[]) {
        setFloatByQuest((prev) => ({ ...prev, [questId]: items }));
        window.setTimeout(() => {
            setFloatByQuest((prev) => {
                const next = { ...prev };
                delete next[questId];
                return next;
            });
        }, 3200);
    }

    async function handleClaim(q: QuestApi) {
        if (claimingId) return;

        setClaimingId(q.id);
        setFlashId(q.id);
        window.setTimeout(() => setFlashId((id) => (id === q.id ? null : id)), 750);

        pushFloatingForQuest(q.id, [
            { id: `${q.id}-xp-${Date.now()}`, text: `+${q.rewardXp} XP`, color: "var(--color-gold)" },
            { id: `${q.id}-gold-${Date.now()}`, text: `+${q.rewardGold} GOLD`, color: "var(--color-gold)" },
        ]);

        try {
            const [result] = await Promise.all([
                claimQuestApi(q.id),
                new Promise<void>((r) => window.setTimeout(r, 1600)),
            ]);

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

            setQuests((prev) =>
                prev.map((item) =>
                    item.id === q.id ? { ...item, status: "CLAIMED" as const } : item
                )
            );
        } catch (e: any) {
            toast.push({
                type: "error",
                title: "Erro ao resgatar",
                message: e?.message ?? "Tente novamente",
                durationMs: 3200,
            });
        } finally {
            window.setTimeout(() => setClaimingId((id) => (id === q.id ? null : id)), 900);
        }
    }

    return (
        <QuestFrame>
            <div className="text-(--color-ink)">
                <div className="mt-6 grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setTab("DAILY")}
                        className={[
                            "rounded-xl border px-4 py-2 text-sm font-semibold transition",
                            tab === "DAILY"
                                ? "bg-(--color-surfaceAlt) border-(--color-gold)/60 text-(--color-gold)"
                                : "bg-(--color-bg) border-(--color-border) text-(--color-muted) hover:bg-(--color-surfaceAlt) hover:text-(--color-ink)",
                        ].join(" ")}
                    >
                        Hoje ({daily.length})
                    </button>

                    <button
                        onClick={() => setTab("WEEKLY")}
                        className={[
                            "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                            tab === "WEEKLY"
                                ? "bg-(--color-surfaceAlt) border-(--color-gold)/60 text-(--color-gold)"
                                : "bg-(--color-bg) border-(--color-border) text-(--color-muted) hover:bg-(--color-surfaceAlt) hover:text-(--color-ink)",
                        ].join(" ")}
                    >
                        Semana ({weekly.length})
                    </button>
                </div>

                <div
                    className="mt-4 space-y-3 pr-2 scroll-dark max-h-100 overflow-y-auto"
                >
                    {shown.length === 0 ? (
                        <div className="rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) p-4 text-sm text-(--color-muted)">
                            Nenhuma quest {tab === "DAILY" ? "de hoje" : "da semana"}.
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {shownSorted.map((q) => {
                                const done = q.progress >= q.target;
                                const claimed = q.status === "CLAIMED";
                                const p = pct(q.progress, q.target);
                                const flashing = flashId === q.id;
                                const claimable = done && !claimed;
                                const floatingItems = floatByQuest[q.id] ?? [];

                                return (
                                    <motion.div
                                        key={q.id}
                                        layout
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.28, ease: "easeOut" }}
                                        className={[
                                            "relative rounded-2xl border p-4 bg-(--color-surfaceAlt)",
                                            claimable
                                                ? "border-(--color-gold)/60"
                                                : "border-(--color-border)",
                                            flashing ? "gold-flash" : "",
                                        ].join(" ")}
                                        style={{ willChange: "transform, opacity" }}
                                    >
                                        <GoldParticles active={flashing} />
                                        <FloatingText items={floatingItems} />

                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-base font-bold leading-tight text-(--color-ink) wrap-break-word">
                                                        {q.title}
                                                    </p>
                                                </div>

                                                <span
                                                    className={[
                                                        "shrink-0 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold border",
                                                        claimed
                                                            ? "bg-(--color-easy)/15 border-(--color-easy)/40 text-(--color-easy)"
                                                            : done
                                                                ? "bg-(--color-gold)/15 border-(--color-gold)/40 text-(--color-gold)"
                                                                : "bg-(--color-bg) border-(--color-border) text-(--color-muted)",
                                                    ].join(" ")}
                                                >
                                                    {claimed ? "resgatada" : done ? "✅ completa" : "ativa"}
                                                </span>
                                            </div>

                                            <p className="text-sm leading-relaxed text-(--color-muted)">
                                                {q.description}
                                            </p>

                                            <div>
                                                <div className="flex items-center justify-between text-sm text-(--color-muted)">
                                                    <span>Progresso</span>
                                                    <span className="font-semibold text-(--color-ink)">
                                                        {Math.min(q.progress, q.target)}/{q.target}
                                                    </span>
                                                </div>

                                                <div className="mt-2">
                                                    <AnimatedProgress value={p} />
                                                </div>
                                            </div>

                                            <div className="text-sm leading-relaxed text-(--color-muted)">
                                                Recompensa: <span className="text-(--color-gold) font-semibold">+{q.rewardXp} XP • +{q.rewardGold} GOLD</span>
                                            </div>

                                            <div className="pt-1">
                                                <button
                                                    onClick={() => handleClaim(q)}
                                                    disabled={!claimable || claimingId === q.id}
                                                    className={[
                                                        "w-full rounded-xl px-3 py-3 text-sm font-semibold border transition",
                                                        !claimable
                                                            ? "bg-(--color-bg) border-(--color-border) text-(--color-muted) cursor-not-allowed opacity-60"
                                                            : "bg-(--color-gold) border-(--color-gold) text-(--color-bg) hover:bg-(--color-goldDark) hover:border-(--color-goldDark)",
                                                        claimable && claimingId !== q.id ? "quest-claim-glow" : "",
                                                    ].join(" ")}
                                                >
                                                    {claimed ? "Resgatada" : done ? (claimingId === q.id ? "Resgatando..." : "Resgatar") : "Em progresso"}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

            </div>
        </QuestFrame>
    );
}
