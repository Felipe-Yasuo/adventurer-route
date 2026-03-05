"use client";

import { useEffect, useMemo, useState } from "react";
import GlassCard from "@/app/(panel)/dashboard/_components/GlassCard";
import { useMe } from "@/app/(panel)/dashboard/_components/me-store";
import { useToast } from "@/app/(panel)/dashboard/_components/toast";
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

export default function ProfileClient() {
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { me, setMe, reload } = useMe();

    // Avatar states
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

    // preview cleanup (evita leak de memória)
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    function onPick(f: File | null) {
        // limpa preview anterior
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

            // ✅ atualiza instantâneo no store
            setMe((prev) => (prev ? { ...prev, image: newImage } : prev));

            toast.push({
                type: "success",
                title: "Avatar atualizado! 🖼️",
                message: "Seu novo avatar já está no perfil.",
                durationMs: 3200,
            });

            // limpa seleção
            setFile(null);
            setPreview(null);

            // opcional: garante consistência total do store
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

    const lifePct = useMemo(() => {
        const life = me?.life ?? 0;
        const max = me?.maxLife ?? 0;
        if (max <= 0) return 0;
        return Math.max(0, Math.min(100, (life / max) * 100));
    }, [me?.life, me?.maxLife]);

    if (loading) return <div className="text-white/70">Carregando perfil...</div>;

    if (error) {
        return (
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-rose">Erro: {error}</p>
                <button
                    onClick={load}
                    className="mt-3 rounded-xl bg-cloudWhite px-4 py-2 text-sm font-semibold text-twilight"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    if (!me) {
        return (
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-white/70">
                Usuário não carregado.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-cloudWhite">🧙 Perfil</h1>
                    <p className="mt-1 text-sm text-white/60">Seu progresso e estatísticas.</p>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6">
                {/* Card principal */}
                <div className="col-span-12 lg:col-span-5">
                    <GlassCard>
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 bg-black/20 grid place-items-center">
                                {preview ? (
                                    <img src={preview} alt="Preview avatar" className="h-full w-full object-cover" />
                                ) : me.image ? (
                                    <Image
                                        src={me.image}
                                        alt="Avatar"
                                        width={64}
                                        height={64}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-cloudWhite font-semibold">{initials(me.name, me.email)}</span>
                                )}
                            </div>

                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-cloudWhite truncate">
                                    {me.name ?? "Sem nome"}
                                </div>
                                <div className="mt-1 text-xs text-white/60 truncate">{me.email ?? "Sem email"}</div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                                        LVL <span className="text-cloudWhite font-semibold">{me.level}</span>
                                    </span>
                                    <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                                        XP <span className="text-cloudWhite font-semibold">{me.xp}</span>
                                    </span>
                                    <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                                        💎 <span className="text-cloudWhite font-semibold">{me.gold}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="text-[11px] text-white/60 mb-2">
                                VIDA {me.life}/{me.maxLife}
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                <div className="h-full bg-roseSoft transition-all" style={{ width: `${lifePct}%` }} />
                            </div>
                        </div>

                        {/* Upload avatar */}
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-white/70">Trocar avatar</label>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(e) => onPick(e.target.files?.[0] ?? null)}
                                    className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none"
                                />
                                <p className="mt-1 text-[11px] text-white/40">png/jpg/webp • até 2MB</p>
                            </div>

                            <button
                                onClick={uploadAvatar}
                                disabled={!file || savingAvatar}
                                className="h-[44px] self-end rounded-xl bg-cloudWhite text-twilight px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-70"
                            >
                                {savingAvatar ? "Salvando..." : "Salvar avatar"}
                            </button>
                        </div>
                    </GlassCard>
                </div>

                {/* Stats */}
                <div className="col-span-12 lg:col-span-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassCard>
                            <div className="text-xs text-white/60">🔥 Streak</div>
                            <div className="mt-1 text-lg font-semibold text-cloudWhite">{me.streakCount}</div>
                            <div className="mt-2 text-[11px] text-white/40">Dias seguidos completando tasks</div>
                        </GlassCard>

                        <GlassCard>
                            <div className="text-xs text-white/60">✅ Tasks concluídas</div>
                            <div className="mt-1 text-lg font-semibold text-cloudWhite">{me.tasksCompletedTotal}</div>
                            <div className="mt-2 text-[11px] text-white/40">Total acumulado no jogo</div>
                        </GlassCard>

                        <GlassCard>
                            <div className="text-xs text-white/60">⚔️ Level</div>
                            <div className="mt-1 text-lg font-semibold text-cloudWhite">{me.level}</div>
                            <div className="mt-2 text-[11px] text-white/40">Progresso de XP define o level</div>
                        </GlassCard>

                        <GlassCard>
                            <div className="text-xs text-white/60">💠 XP</div>
                            <div className="mt-1 text-lg font-semibold text-cloudWhite">{me.xp}</div>
                            <div className="mt-2 text-[11px] text-white/40">Ganho ao completar tasks e quests</div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
}