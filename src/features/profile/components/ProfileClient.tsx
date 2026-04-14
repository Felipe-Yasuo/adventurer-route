"use client";

import { useEffect, useMemo, useState } from "react";
import { useMe } from "@/features/shared/components/me-store";
import { useToast } from "@/features/shared/components/toast";
import Image from "next/image";

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
    icon,
    label,
    value,
    helper,
    valueColor = "text-(--color-ink)",
}: {
    icon: string;
    label: string;
    value: string | number;
    helper: string;
    valueColor?: string;
}) {
    return (
        <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)">
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) text-xl">
                    {icon}
                </div>

                <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                        {label}
                    </div>
                    <div className={["mt-1 text-2xl font-bold", valueColor].join(" ")}>
                        {value}
                    </div>
                    <div className="mt-2 text-[12px] leading-relaxed text-(--color-mutedSoft)">
                        {helper}
                    </div>
                </div>
            </div>
        </section>
    );
}

function InfoBadge({
    label,
    value,
    icon,
    valueColor = "text-(--color-ink)",
}: {
    label: string;
    value: string | number;
    icon: string;
    valueColor?: string;
}) {
    return (
        <div className="rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) px-3 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-(--color-muted)">
                {icon} {label}
            </div>
            <div className={["mt-1 text-sm font-bold", valueColor].join(" ")}>
                {value}
            </div>
        </div>
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
                title: "Avatar atualizado! 🖼️",
                message: "Seu novo avatar já está no perfil.",
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

    const lifeText = useMemo(() => {
        return `${me?.life ?? 0}/${me?.maxLife ?? 0}`;
    }, [me?.life, me?.maxLife]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-(--color-muted) shadow-(--shadow-card)">
                Carregando perfil...
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
            <header className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)">
                <h1 className="text-2xl font-bold tracking-wide text-(--color-ink)">
                    🧙 Perfil
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-(--color-muted)">
                    Veja suas informações, acompanhe seus status e personalize seu avatar.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]">
                <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-(--color-border) bg-(--color-surfaceAlt)">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : me.image ? (
                                <Image
                                    src={me.image}
                                    alt="Avatar"
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-xl font-bold text-(--color-ink)">
                                    {initials(me.name, me.email)}
                                </span>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-2xl font-bold tracking-wide text-(--color-ink)">
                                {me.name ?? "Sem nome"}
                            </h2>

                            <p className="mt-1 truncate text-sm text-(--color-muted)">
                                {me.email ?? "Sem email"}
                            </p>

                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <InfoBadge label="Level" value={me.level} icon="⚔️" valueColor="text-(--color-gold)" />
                                <InfoBadge label="XP" value={me.xp} icon="✨" />
                                <InfoBadge label="Gold" value={me.gold} icon="🪙" valueColor="text-(--color-gold)" />
                                <InfoBadge label="Life" value={lifeText} icon="❤️" valueColor="text-(--color-hard)" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-surfaceAlt) p-4">
                        <div className="text-sm font-semibold text-(--color-ink)">
                            Atualizar avatar
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                                    Selecionar imagem
                                </label>

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(e) => onPick(e.target.files?.[0] ?? null)}
                                    className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-sm text-(--color-ink) outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-(--color-gold) file:px-3 file:py-2 file:text-sm file:font-semibold file:text-(--color-bg) hover:file:bg-(--color-goldDark)"
                                />

                                <p className="mt-2 text-[11px] text-(--color-mutedSoft)">
                                    png, jpg ou webp • até 2MB
                                </p>
                            </div>

                            <button
                                onClick={uploadAvatar}
                                disabled={!file || savingAvatar}
                                className="h-[48px] rounded-xl border border-(--color-gold) bg-(--color-gold) px-5 py-3 text-sm font-semibold text-(--color-bg) transition hover:bg-(--color-goldDark) hover:border-(--color-goldDark) disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {savingAvatar ? "Salvando..." : "Salvar avatar"}
                            </button>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <StatCard
                        icon="🔥"
                        label="Streak"
                        value={me.streakCount}
                        helper="Dias seguidos completando tarefas."
                        valueColor="text-(--color-hard)"
                    />

                    <StatCard
                        icon="✅"
                        label="Tasks concluídas"
                        value={me.tasksCompletedTotal}
                        helper="Total acumulado de tarefas finalizadas."
                        valueColor="text-(--color-easy)"
                    />

                    <StatCard
                        icon="⚔️"
                        label="Level"
                        value={me.level}
                        helper="Seu nível sobe conforme o XP acumulado."
                        valueColor="text-(--color-gold)"
                    />

                    <StatCard
                        icon="✨"
                        label="XP"
                        value={me.xp}
                        helper="Ganho ao completar tarefas, quests e desafios."
                    />
                </section>
            </div>
        </div>
    );
}
