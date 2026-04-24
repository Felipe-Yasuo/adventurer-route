"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useMe } from "@/features/shared/components/me-store";
import { useToast } from "@/features/shared/components/toast";
import { xpToNextLevel } from "@/server/game/progression/rules";

type MeApi = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    level: number;
    xp: number;
    gold: number;
    life: number;
    maxLife: number;
    streakCount: number;
    tasksCompletedTotal: number;
};

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error ?? `Falha ao carregar ${url}`);
    return json as T;
}

function initials(name?: string | null, email?: string | null) {
    const base = (name ?? email ?? "").trim();
    if (!base) return "??";
    const parts = base.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "??";
}

function StatCard({
    iconSrc,
    label,
    value,
    helper,
    tone = "default",
}: {
    iconSrc: string;
    label: string;
    value: string | number;
    helper: string;
    tone?: "default" | "fire" | "gold" | "easy" | "xp" | "danger";
}) {
    const toneBorder =
        tone === "fire"
            ? "border-orange-500/50"
            : tone === "gold"
            ? "border-(--color-gold)/50"
            : tone === "easy"
            ? "border-(--color-easy)/45"
            : tone === "xp"
            ? "border-purple-500/50"
            : tone === "danger"
            ? "border-(--color-hard)/45"
            : "border-(--color-border)";

    const toneGlow =
        tone === "fire"
            ? "shadow-[0_0_22px_-8px_rgba(249,115,22,0.55)]"
            : tone === "gold"
            ? "shadow-[0_0_22px_-8px_rgba(212,175,55,0.55)]"
            : tone === "easy"
            ? "shadow-[0_0_22px_-10px_rgba(34,197,94,0.5)]"
            : tone === "xp"
            ? "shadow-[0_0_22px_-8px_rgba(168,85,247,0.55)]"
            : tone === "danger"
            ? "shadow-[0_0_22px_-10px_rgba(230,60,60,0.5)]"
            : "shadow-(--shadow-card)";

    const valueColor =
        tone === "fire"
            ? "text-orange-400"
            : tone === "gold"
            ? "text-(--color-gold)"
            : tone === "easy"
            ? "text-(--color-easy)"
            : tone === "xp"
            ? "text-purple-300"
            : tone === "danger"
            ? "text-(--color-hard)"
            : "text-(--color-ink)";

    const iconGlow =
        tone === "fire"
            ? "drop-shadow-[0_0_10px_rgba(249,115,22,0.55)]"
            : tone === "gold"
            ? "drop-shadow-[0_0_10px_rgba(212,175,55,0.55)]"
            : tone === "xp"
            ? "drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]"
            : "drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]";

    return (
        <section
            className={[
                "flex items-start gap-4 rounded-2xl border-2 bg-(--color-surface) p-5 transition",
                toneBorder,
                toneGlow,
            ].join(" ")}
        >
            <img
                src={iconSrc}
                alt=""
                className={["h-14 w-14 shrink-0 object-contain", iconGlow].join(" ")}
            />

            <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(--color-muted)">
                    {label}
                </div>
                <div className={["mt-1 font-serif text-3xl italic leading-none", valueColor].join(" ")}>
                    {value}
                </div>
                <div className="mt-2 text-[11px] leading-relaxed text-(--color-mutedSoft)">
                    {helper}
                </div>
            </div>
        </section>
    );
}

export default function ProfileClient() {
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { me, setMe, reload } = useMe();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [savingAvatar, setSavingAvatar] = useState(false);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const meJson = await fetchJson<MeApi>("/api/me");
            setMe(meJson);
        } catch (e: any) {
            setError(e?.message ?? "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (me) {
            setLoading(false);
            return;
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    function onPick(f: File | null) {
        if (preview) URL.revokeObjectURL(preview);

        setFile(f);

        if (!f) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(f);
        setPreview(url);
    }

    async function uploadAvatar() {
        if (!file) return;

        setSavingAvatar(true);
        try {
            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch("/api/profile/avatar", {
                method: "POST",
                body: fd,
            });

            const json = await res.json().catch(() => null);
            if (!res.ok) throw new Error(json?.error ?? "Falha ao salvar avatar");

            const newImage = json?.user?.image as string | null;

            setMe((prev) => (prev ? { ...prev, image: newImage } : prev));

            toast.push({
                type: "success",
                title: "Emblema atualizado!",
                message: "Seu novo retrato já foi gravado no pergaminho.",
                durationMs: 3200,
            });

            setFile(null);
            setPreview(null);

            await reload?.();
        } catch (e: any) {
            toast.push({
                type: "error",
                title: "Erro ao atualizar avatar",
                message: e?.message ?? "Tente novamente",
                durationMs: 3400,
            });
        } finally {
            setSavingAvatar(false);
        }
    }

    const xpNeeded = useMemo(() => (me ? xpToNextLevel(me.level) : 100), [me]);
    const xpPct = useMemo(() => {
        if (!me) return 0;
        return Math.max(0, Math.min(100, (me.xp / xpNeeded) * 100));
    }, [me, xpNeeded]);

    const lifePct = useMemo(() => {
        if (!me || me.maxLife <= 0) return 0;
        return Math.max(0, Math.min(100, (me.life / me.maxLife) * 100));
    }, [me]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-(--color-muted) shadow-(--shadow-card)">
                Abrindo o pergaminho de identidade...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-(--color-hard)/40 bg-(--color-surface) p-6 shadow-(--shadow-card)">
                <p className="text-(--color-hard)">Erro: {error}</p>
                <button
                    onClick={load}
                    className="mt-4 rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) px-4 py-2 text-sm font-semibold text-(--color-ink) transition hover:bg-(--color-surface)"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    if (!me) {
        return (
            <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-(--color-muted) shadow-(--shadow-card)">
                Usuário não carregado.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="relative overflow-hidden rounded-2xl border border-(--color-border) bg-linear-to-br from-(--color-surface) via-(--color-surfaceAlt) to-(--color-surface) p-6 shadow-(--shadow-card)">
                <div className="flex items-center gap-4">
                    <img
                        src="/ui/icons/profile.png"
                        alt=""
                        className="h-16 w-16 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.55)]"
                    />
                    <div>
                        <div className="flex items-center gap-2 text-(--color-gold)">
                            <span className="text-xs" aria-hidden>◆</span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                                Pergaminho de Identidade
                            </span>
                            <span className="text-xs" aria-hidden>◆</span>
                        </div>
                        <h1 className="mt-1 font-serif text-3xl italic text-(--color-ink)">
                            Seu brasão.
                        </h1>
                        <p className="mt-1 max-w-xl text-sm text-(--color-muted)">
                            Onde sua história ganha rosto — acompanhe seus feitos, forje seu emblema e deixe sua marca na guilda.
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]">
                <section className="relative overflow-hidden rounded-2xl border-2 border-(--color-gold)/40 bg-linear-to-br from-(--color-surface) via-(--color-surfaceAlt) to-(--color-surface) p-6 shadow-[0_0_28px_-10px_rgba(212,175,55,0.55)]">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-(--color-gold)/10 blur-3xl"
                    />

                    <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                        <div className="relative shrink-0">
                            <div
                                aria-hidden
                                className="absolute -inset-2 rounded-full bg-(--color-gold)/15 blur-xl"
                            />
                            <div className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-full border-4 border-(--color-gold)/60 bg-(--color-bg) shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Prévia"
                                        className="h-full w-full object-cover"
                                    />
                                ) : me.image ? (
                                    <Image
                                        src={me.image}
                                        alt="Avatar"
                                        width={112}
                                        height={112}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="font-serif text-3xl italic text-(--color-gold)">
                                        {initials(me.name, me.email)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(--color-gold)">
                                Aventureiro · Nível {me.level}
                            </div>

                            <h2 className="mt-1 truncate font-serif text-3xl italic text-(--color-ink)">
                                {me.name ?? "Sem nome"}
                            </h2>

                            <p className="mt-1 truncate text-sm text-(--color-muted)">
                                {me.email ?? "Sem email"}
                            </p>

                            <div className="mt-4">
                                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em]">
                                    <span className="text-(--color-muted)">Experiência</span>
                                    <span className="text-(--color-ink)">
                                        {me.xp}/{xpNeeded}
                                    </span>
                                </div>
                                <div className="mt-2 h-3 overflow-hidden rounded-full border border-black/60 bg-black/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)]">
                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-(--color-gold)/70 via-(--color-gold) to-amber-300 shadow-[0_0_10px_rgba(212,175,55,0.7)] transition-[width] duration-500 ease-out"
                                        style={{ width: `${xpPct}%` }}
                                    />
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em]">
                                    <span className="text-(--color-muted)">Vitalidade</span>
                                    <span className="text-(--color-ink)">
                                        {me.life}/{me.maxLife}
                                    </span>
                                </div>
                                <div className="mt-2 h-3 overflow-hidden rounded-full border border-black/60 bg-black/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)]">
                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-(--color-hard) via-red-500 to-red-400 shadow-[0_0_8px_rgba(230,60,60,0.55)] transition-[width] duration-500 ease-out"
                                        style={{ width: `${lifePct}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-6 rounded-2xl border border-(--color-border) bg-(--color-bg)/60 p-4">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-(--color-gold)">
                            <span aria-hidden>◆</span>
                            Forjar novo emblema
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
                            <div>
                                <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--color-muted)">
                                    Selecionar retrato
                                </label>

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(e) => onPick(e.target.files?.[0] ?? null)}
                                    className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-sm text-(--color-ink) outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-(--color-gold) file:px-3 file:py-2 file:text-sm file:font-semibold file:text-(--color-bg) hover:file:bg-(--color-goldDark)"
                                />

                                <p className="mt-2 text-[11px] text-(--color-mutedSoft)">
                                    png, jpg ou webp · até 2 MB
                                </p>
                            </div>

                            <button
                                onClick={uploadAvatar}
                                disabled={!file || savingAvatar}
                                className="h-12 rounded-xl border-2 border-(--color-gold) bg-(--color-gold) px-5 text-sm font-bold tracking-wide text-(--color-bg) transition hover:bg-(--color-goldDark) hover:border-(--color-goldDark) disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {savingAvatar ? "Selando..." : "✦ Selar emblema"}
                            </button>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard
                        iconSrc="/ui/stats/fogo.png"
                        label="Streak"
                        value={me.streakCount}
                        helper="Dias consecutivos honrando seus contratos."
                        tone="fire"
                    />

                    <StatCard
                        iconSrc="/ui/stats/concluido.png"
                        label="Vitórias"
                        value={me.tasksCompletedTotal}
                        helper="Total de missões cumpridas em sua saga."
                        tone="easy"
                    />

                    <StatCard
                        iconSrc="/ui/profile/level.png"
                        label="Nível"
                        value={me.level}
                        helper="A coroa cresce com a experiência acumulada."
                        tone="gold"
                    />

                    <StatCard
                        iconSrc="/ui/profile/xp.png"
                        label="Experiência"
                        value={me.xp}
                        helper="Ganha a cada feito — missões, quests e desafios."
                        tone="xp"
                    />
                </section>
            </div>
        </div>
    );
}
