"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/app/(panel)/dashboard/_components/toast";
import { useMe } from "@/app/(panel)/dashboard/_components/me-store";

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
        <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] px-5 py-4 shadow-[0_10px_18px_rgba(0,0,0,0.08)]">
            <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink)]/60">
                Seu Gold
            </div>
            <div className="mt-2 text-2xl font-bold text-[color:var(--color-ink)]">
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
        <section className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-5 shadow-[0_10px_18px_rgba(0,0,0,0.1)] transition hover:translate-y-[-2px] hover:shadow-[0_14px_24px_rgba(0,0,0,0.12)]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-[16px] font-bold tracking-wide text-[color:var(--color-ink)]">
                        {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-[color:var(--color-ink)]/68">
                        Restaura{" "}
                        <span className="font-semibold text-[color:var(--color-ink)]">
                            +{item.healValue}
                        </span>{" "}
                        de vida.
                    </p>
                </div>

                <div className="shrink-0 rounded-xl border border-black/10 bg-[rgba(255,255,255,0.26)] px-3 py-2 text-sm font-bold text-[color:var(--color-ink)] shadow-[0_4px_8px_rgba(0,0,0,0.05)]">
                    🪙 {item.price}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink)]/60">
                        Quantidade
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => onChangeQty(Math.max(1, Number(e.target.value || 1)))}
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[rgba(255,255,255,0.32)] px-4 py-3 text-sm text-[color:var(--color-ink)] outline-none transition focus:border-[rgba(212,160,23,0.45)] focus:bg-[rgba(255,255,255,0.48)]"
                    />
                </div>

                <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.24)] px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink)]/55">
                        Total
                    </div>
                    <div className="mt-2 text-sm font-bold text-[color:var(--color-ink)]">
                        🪙 {total}
                    </div>
                </div>
            </div>

            <button
                onClick={onBuy}
                disabled={busy}
                className="mt-4 w-full rounded-xl border border-[rgba(212,160,23,0.42)] bg-[rgba(212,160,23,0.18)] py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-[rgba(212,160,23,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {busy ? "Comprando..." : "Comprar"}
            </button>

            <div className="mt-3 text-[12px] text-[color:var(--color-ink)]/48">
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
            <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.9)] p-6 text-[color:var(--color-ink)]/70 shadow-[0_8px_14px_rgba(0,0,0,0.1)]">
                Carregando loja...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-[rgba(178,59,59,0.2)] bg-[rgba(242,228,198,0.9)] p-6 shadow-[0_8px_14px_rgba(0,0,0,0.08)]">
                <p className="text-[color:var(--color-ink)]">Erro: {error}</p>
                <button
                    onClick={loadAll}
                    className="mt-4 rounded-xl border border-black/10 bg-[rgba(255,255,255,0.28)] px-4 py-2 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-[rgba(255,255,255,0.45)]"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-6 shadow-[0_10px_18px_rgba(0,0,0,0.1)]">
                    <h1 className="text-2xl font-bold tracking-wide text-[color:var(--color-ink)]">
                        🛒 Loja
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]/68">
                        Compre itens para ajudar na sua jornada e recuperar vida.
                    </p>
                </div>

                <GoldCard gold={gold} />
            </header>

            {sorted.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-5 text-[color:var(--color-ink)]/68 shadow-[0_8px_14px_rgba(0,0,0,0.08)]">
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