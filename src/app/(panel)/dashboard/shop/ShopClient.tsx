"use client";

import { useEffect, useMemo, useState } from "react";
import GlassCard from "@/app/(panel)/dashboard/_components/GlassCard";
import { useToast } from "@/app/(panel)/dashboard/_components/toast";

type ShopItem = {
    id: string;
    type: string;
    name: string;
    price: number;
    healValue: number;
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

async function buyItemApi(itemId: string, quantity: number) {
    const res = await fetch("/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(json?.error ?? "Falha ao comprar item");
    }

    return json as {
        user: { id: string; gold: number };
        inventoryItem: { id: string; quantity: number; item: { id: string; name: string } };
        totalCost: number;
    };
}

export default function ShopClient() {
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [items, setItems] = useState<ShopItem[]>([]);
    const [me, setMe] = useState<MeApi | null>(null);

    // quantidade por item
    const [qty, setQty] = useState<Record<string, number>>({});
    const [busyItemId, setBusyItemId] = useState<string | null>(null);

    async function loadAll() {
        setLoading(true);
        setError(null);

        try {
            const [shop, meJson] = await Promise.all([
                fetchJson<ShopItem[]>("/api/shop"),
                fetchJson<MeApi>("/api/me"),
            ]);

            setItems(shop);
            setMe(meJson);

            // inicializa qty=1 para itens novos
            setQty((prev) => {
                const next = { ...prev };
                for (const it of shop) {
                    if (!next[it.id]) next[it.id] = 1;
                }
                return next;
            });
        } catch (e: any) {
            setError(e?.message ?? "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    const gold = me?.gold ?? 0;

    const sorted = useMemo(() => {
        return [...items].sort((a, b) => a.price - b.price);
    }, [items]);

    async function handleBuy(item: ShopItem) {
        const quantity = Math.max(1, Number(qty[item.id] ?? 1));
        const total = item.price * quantity;

        if (gold < total) {
            toast.push({
                type: "warning",
                title: "Gold insuficiente",
                message: `Você tem ${gold} e precisa de ${total}.`,
                durationMs: 3200,
            });
            return;
        }

        setBusyItemId(item.id);

        try {
            const result = await buyItemApi(item.id, quantity);

            toast.push({
                type: "success",
                title: "Compra realizada! 🛒",
                message: `${item.name} x${quantity} • -${result.totalCost} GOLD`,
                durationMs: 3500,
            });


            setMe((prev) => (prev ? { ...prev, gold: result.user.gold } : prev));


            const meJson = await fetchJson<MeApi>("/api/me");
            setMe(meJson);

        } catch (e: any) {
            toast.push({
                type: "error",
                title: "Erro na compra",
                message: e?.message ?? "Tente novamente",
                durationMs: 3400,
            });
        } finally {
            setBusyItemId(null);
        }
    }

    if (loading) {
        return <div className="text-white/70">Carregando loja...</div>;
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
                    <h1 className="text-xl font-semibold text-cloudWhite">🛒 Loja</h1>
                    <p className="mt-1 text-sm text-white/60">
                        Compre itens usando seu GOLD.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                    <div className="text-xs text-white/60">Seu GOLD</div>
                    <div className="text-lg font-semibold text-cloudWhite">💎 {gold}</div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sorted.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-white/60">
                        Nenhum item disponível no momento.
                    </div>
                ) : (
                    sorted.map((item) => {
                        const q = qty[item.id] ?? 1;
                        const total = item.price * q;
                        const busy = busyItemId === item.id;

                        return (
                            <GlassCard key={item.id}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-cloudWhite truncate">
                                            {item.name}
                                        </p>
                                        <p className="mt-1 text-xs text-white/60">
                                            Cura: <span className="text-white/80">+{item.healValue}</span>
                                        </p>
                                    </div>

                                    <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-cloudWhite">
                                        💎 {item.price}
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-white/70">Qtd</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={q}
                                            onChange={(e) =>
                                                setQty((prev) => ({
                                                    ...prev,
                                                    [item.id]: Math.max(1, Number(e.target.value || 1)),
                                                }))
                                            }
                                            className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
                                        />
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                                        <div className="text-xs text-white/60">Total</div>
                                        <div className="text-sm font-semibold text-cloudWhite">💎 {total}</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleBuy(item)}
                                    disabled={busy}
                                    className="mt-4 w-full rounded-xl bg-cloudWhite text-twilight py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-70"
                                >
                                    {busy ? "Comprando..." : "Comprar"}
                                </button>

                                <div className="mt-3 text-[11px] text-white/40">Tipo: {item.type}</div>
                            </GlassCard>
                        );
                    })
                )}
            </div>
        </div>
    );
}