"use client";

import { useEffect, useMemo, useState } from "react";
import GlassCard from "@/app/(panel)/dashboard/_components/GlassCard";
import { useToast } from "@/app/(panel)/dashboard/_components/toast";
import { useMe } from "@/app/(panel)/dashboard/_components/me-store";

type InventoryRow = {
    id: string;
    quantity: number;
    item: {
        id: string;
        type: string;
        name: string;
        price: number;
        healValue: number;
    };
};

type MeApi = {
    gold: number;
    level: number;
    xp: number;
    life: number;
    maxLife: number;
    streakCount: number;
    tasksCompletedTotal: number;
};

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(json?.error ?? `Falha ao carregar ${url}`);
    }

    return json as T;
}

async function useItemApi(itemId: string) {
    const res = await fetch("/api/inventory/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(json?.error ?? "Falha ao usar item");
    }

    return json as {
        healed: number;
        user: { id: string; life: number; maxLife: number };
        usedItem: { id: string; name: string; healValue: number };
        remaining: number;
    };
}

export default function InventoryClient() {
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [rows, setRows] = useState<InventoryRow[]>([]);
    const { me, setMe, reload } = useMe();

    const [busyItemId, setBusyItemId] = useState<string | null>(null);

    async function loadAll() {
        setLoading(true);
        setError(null);

        try {
            const inv = await fetchJson<InventoryRow[]>("/api/inventory");
            setRows(inv);

            await reload();
        } catch (e: any) {
            setError(e?.message ?? "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    const life = me?.life ?? 0;
    const maxLife = me?.maxLife ?? 0;

    const lifePct =
        maxLife > 0 ? Math.max(0, Math.min(100, (life / maxLife) * 100)) : 0;

    const sorted = useMemo(() => {
        // mais úteis primeiro (cura maior), depois por nome
        return [...rows].sort((a, b) => {
            if (b.item.healValue !== a.item.healValue) return b.item.healValue - a.item.healValue;
            return a.item.name.localeCompare(b.item.name);
        });
    }, [rows]);

    async function handleUse(row: InventoryRow) {
        if (row.quantity <= 0) return;

        setBusyItemId(row.item.id);

        try {
            const result = await useItemApi(row.item.id);

            setMe((prev) =>
                prev ? { ...prev, life: result.user.life, maxLife: result.user.maxLife } : prev
            );
            setRows((prev) =>
                prev.map((r) =>
                    r.item.id === row.item.id ? { ...r, quantity: result.remaining } : r
                )
            );

            toast.push({
                type: "success",
                title: "Item usado! ❤️",
                message: `+${result.healed} vida • ${result.usedItem.name} (restam ${result.remaining})`,
                durationMs: 3600,
            });

        } catch (e: any) {
            toast.push({
                type: "error",
                title: "Erro ao usar item",
                message: e?.message ?? "Tente novamente",
                durationMs: 3400,
            });
        } finally {
            setBusyItemId(null);
        }
    }

    if (loading) {
        return <div className="text-white/70">Carregando inventário...</div>;
    }

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
                    <h1 className="text-xl font-semibold text-cloudWhite">🎒 Inventário</h1>
                    <p className="mt-1 text-sm text-white/60">
                        Use itens para recuperar vida.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 min-w-[220px]">
                    <div className="text-xs text-white/60 mb-2">
                        VIDA {life}/{maxLife}
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-roseSoft transition-all" style={{ width: `${lifePct}%` }} />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sorted.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-white/60">
                        Seu inventário está vazio. Compre itens na Loja.
                    </div>
                ) : (
                    sorted.map((row) => {
                        const busy = busyItemId === row.item.id;
                        const disabled = row.quantity <= 0 || (me ? me.life >= me.maxLife : false);

                        return (
                            <GlassCard key={row.id}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-cloudWhite truncate">
                                            {row.item.name}
                                        </p>
                                        <p className="mt-1 text-xs text-white/60">
                                            Cura: <span className="text-white/80">+{row.item.healValue}</span>
                                        </p>
                                    </div>

                                    <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-cloudWhite">
                                        x{row.quantity}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleUse(row)}
                                    disabled={busy || disabled}
                                    className={[
                                        "mt-4 w-full rounded-xl py-2 text-sm font-semibold border transition",
                                        busy || disabled
                                            ? "bg-white/5 border-white/10 text-white/40 cursor-not-allowed"
                                            : "bg-forest/40 border-white/10 text-cloudWhite hover:bg-forest/55",
                                    ].join(" ")}
                                >
                                    {busy ? "Usando..." : "Usar"}
                                </button>

                                <div className="mt-3 text-[11px] text-white/40">
                                    Tipo: {row.item.type} • Preço na loja: 💎 {row.item.price}
                                </div>
                            </GlassCard>
                        );
                    })
                )}
            </div>
        </div>
    );
}