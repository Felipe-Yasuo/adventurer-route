"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/features/shared/components/toast";
import { useMe } from "@/features/shared/components/me-store";

type ShopItem = {
    id: string;
    type: string;
    name: string;
    price: number;
    healValue: number;
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

function GoldCard({ gold }: { gold: number }) {
    return (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) px-5 py-4 shadow-(--shadow-card)">
            <div className="text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                Seu Gold
            </div>
            <div className="mt-2 text-2xl font-bold text-(--color-gold)">
                🪙 {gold}
            </div>
        </div>
    );
}

function ShopItemCard({
    item,
    quantity,
    busy,
    onChangeQty,
    onBuy,
}: {
    item: ShopItem;
    quantity: number;
    busy: boolean;
    onChangeQty: (value: number) => void;
    onBuy: () => void;
}) {
    const total = item.price * quantity;

    return (
        <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card) transition hover:-translate-y-0.5 hover:border-(--color-gold)/40">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-[16px] font-bold tracking-wide text-(--color-ink)">
                        {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-(--color-muted)">
                        Restaura{" "}
                        <span className="font-semibold text-(--color-easy)">
                            +{item.healValue}
                        </span>{" "}
                        de vida.
                    </p>
                </div>

                <div className="shrink-0 rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) px-3 py-2 text-sm font-bold text-(--color-gold)">
                    🪙 {item.price}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                        Quantidade
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => onChangeQty(Math.max(1, Number(e.target.value || 1)))}
                        className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) px-4 py-3 text-sm text-(--color-ink) outline-none transition focus:border-(--color-gold) focus:bg-(--color-surface)"
                    />
                </div>

                <div className="rounded-2xl border border-(--color-border) bg-(--color-surfaceAlt) px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                        Total
                    </div>
                    <div className="mt-2 text-sm font-bold text-(--color-gold)">
                        🪙 {total}
                    </div>
                </div>
            </div>

            <button
                onClick={onBuy}
                disabled={busy}
                className="mt-4 w-full rounded-xl border border-(--color-gold) bg-(--color-gold) py-3 text-sm font-semibold text-(--color-bg) transition hover:bg-(--color-goldDark) hover:border-(--color-goldDark) disabled:cursor-not-allowed disabled:opacity-60"
            >
                {busy ? "Comprando..." : "Comprar"}
            </button>

            <div className="mt-3 text-[12px] text-(--color-mutedSoft)">
                Tipo: {item.type}
            </div>
        </section>
    );
}

export default function ShopClient() {
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [items, setItems] = useState<ShopItem[]>([]);
    const { me, setMe, reload } = useMe();

    const [qty, setQty] = useState<Record<string, number>>({});
    const [busyItemId, setBusyItemId] = useState<string | null>(null);

    async function loadAll() {
        setLoading(true);
        setError(null);

        try {
            const shop = await fetchJson<ShopItem[]>("/api/shop");
            setItems(shop);

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
            await reload();
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
        return (
            <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-(--color-muted) shadow-(--shadow-card)">
                Carregando loja...
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
            <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)">
                    <h1 className="text-2xl font-bold tracking-wide text-(--color-ink)">
                        🛒 Loja
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-(--color-muted)">
                        Compre itens para ajudar na sua jornada e recuperar vida.
                    </p>
                </div>

                <GoldCard gold={gold} />
            </header>

            {sorted.length === 0 ? (
                <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 text-(--color-muted) shadow-(--shadow-card)">
                    Nenhum item disponível no momento.
                </div>
            ) : (
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {sorted.map((item) => {
                        const q = qty[item.id] ?? 1;
                        const busy = busyItemId === item.id;

                        return (
                            <ShopItemCard
                                key={item.id}
                                item={item}
                                quantity={q}
                                busy={busy}
                                onChangeQty={(value) =>
                                    setQty((prev) => ({
                                        ...prev,
                                        [item.id]: value,
                                    }))
                                }
                                onBuy={() => handleBuy(item)}
                            />
                        );
                    })}
                </section>
            )}
        </div>
    );
}
