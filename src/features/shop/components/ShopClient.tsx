"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/features/shared/components/toast";
import { useMe } from "@/features/shared/components/me-store";
import {
    visualForItemType,
    RARITY_STYLES,
} from "@/features/shop/utils/itemAssets";

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

function QtyStepper({
    value,
    onChange,
    disabled,
}: {
    value: number;
    onChange: (v: number) => void;
    disabled?: boolean;
}) {
    const btn =
        "grid h-9 w-9 place-items-center rounded-lg border border-(--color-border) bg-(--color-surfaceAlt) text-(--color-ink) font-bold transition hover:border-(--color-gold)/50 hover:text-(--color-gold) disabled:opacity-40 disabled:cursor-not-allowed";

    return (
        <div className="inline-flex items-center gap-2">
            <button
                type="button"
                onClick={() => onChange(Math.max(1, value - 1))}
                disabled={disabled || value <= 1}
                className={btn}
                aria-label="Diminuir quantidade"
            >
                −
            </button>
            <input
                type="number"
                min={1}
                value={value}
                onChange={(e) => onChange(Math.max(1, Number(e.target.value || 1)))}
                disabled={disabled}
                className="h-9 w-14 rounded-lg border border-(--color-border) bg-(--color-surfaceAlt) text-center text-sm font-bold text-(--color-ink) outline-none transition focus:border-(--color-gold)/60 disabled:opacity-60"
            />
            <button
                type="button"
                onClick={() => onChange(value + 1)}
                disabled={disabled}
                className={btn}
                aria-label="Aumentar quantidade"
            >
                +
            </button>
        </div>
    );
}

function ShopItemCard({
    item,
    quantity,
    busy,
    canAfford,
    onChangeQty,
    onBuy,
}: {
    item: ShopItem;
    quantity: number;
    busy: boolean;
    canAfford: boolean;
    onChangeQty: (value: number) => void;
    onBuy: () => void;
}) {
    const visual = visualForItemType(item.type);
    const rarity = RARITY_STYLES[visual.rarity];
    const total = item.price * quantity;

    return (
        <section
            className={[
                "group relative flex flex-col rounded-2xl border-2 bg-(--color-surface) p-5 transition",
                rarity.ring,
                rarity.glow,
                "hover:-translate-y-1 hover:border-(--color-gold)/70",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-2">
                <span
                    className={[
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
                        rarity.chip,
                    ].join(" ")}
                >
                    {rarity.label}
                </span>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-(--color-gold)/40 bg-(--color-gold)/10 px-2.5 py-1 text-sm font-bold text-(--color-gold)">
                    <img
                        src="/ui/stats/gold.png"
                        alt=""
                        className="h-5 w-5 object-contain"
                    />
                    {item.price}
                </div>
            </div>

            <div className="relative mt-3 flex items-center justify-center">
                <div
                    className="absolute inset-0 m-auto h-28 w-28 rounded-full bg-(--color-gold)/10 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100"
                    aria-hidden
                />
                <img
                    src={visual.icon}
                    alt=""
                    className="relative h-36 w-36 object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.55)] transition duration-300 group-hover:scale-105 group-hover:-translate-y-1"
                />
            </div>

            <div className="mt-3 text-center">
                <h3 className="font-serif text-lg italic text-(--color-ink)">
                    {item.name}
                </h3>
                <p className="mt-1 text-xs italic leading-relaxed text-(--color-muted)">
                    “{visual.flavor}”
                </p>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-(--color-easy)/30 bg-(--color-easy)/10 px-3 py-2 text-sm">
                <img
                    src="/ui/stats/vida.png"
                    alt=""
                    className="h-5 w-5 object-contain"
                />
                <span className="font-semibold text-(--color-easy)">
                    +{item.healValue}
                </span>
                <span className="text-(--color-muted)">de vida</span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-(--color-border)/60 pt-4">
                <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-(--color-muted)">
                        Quantidade
                    </div>
                    <div className="mt-1.5">
                        <QtyStepper
                            value={quantity}
                            onChange={onChangeQty}
                            disabled={busy}
                        />
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-(--color-muted)">
                        Total
                    </div>
                    <div
                        className={[
                            "mt-1 inline-flex items-center gap-1 text-base font-bold",
                            canAfford ? "text-(--color-gold)" : "text-(--color-hard)",
                        ].join(" ")}
                    >
                        <img
                            src="/ui/stats/gold.png"
                            alt=""
                            className="h-5 w-5 object-contain"
                        />
                        {total}
                    </div>
                </div>
            </div>

            <button
                onClick={onBuy}
                disabled={busy || !canAfford}
                className={[
                    "mt-4 w-full rounded-xl border-2 py-3 text-sm font-bold tracking-wide transition",
                    canAfford
                        ? "border-(--color-gold) bg-(--color-gold) text-(--color-bg) hover:bg-(--color-goldDark) hover:border-(--color-goldDark)"
                        : "border-(--color-border) bg-(--color-surfaceAlt) text-(--color-muted) cursor-not-allowed",
                    "disabled:opacity-60",
                ].join(" ")}
            >
                {busy
                    ? "Adquirindo..."
                    : canAfford
                    ? "✦ Adquirir"
                    : "Gold insuficiente"}
            </button>
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
                title: "Negócio fechado!",
                message: `${item.name} × ${quantity} — −${result.totalCost} GOLD`,
                durationMs: 3500,
                iconSrc: "/ui/stats/gold.png",
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
                Abrindo as portas da guilda...
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
            <header className="relative overflow-hidden rounded-2xl border border-(--color-border) bg-linear-to-br from-(--color-surface) via-(--color-surfaceAlt) to-(--color-surface) p-6 shadow-(--shadow-card)">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src="/ui/icons/loja.png"
                            alt=""
                            className="h-16 w-16 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.55)]"
                        />
                        <div>
                            <div className="flex items-center gap-2 text-(--color-gold)">
                                <span className="text-xs" aria-hidden>◆</span>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                                    Mercado da Guilda
                                </span>
                                <span className="text-xs" aria-hidden>◆</span>
                            </div>
                            <h1 className="mt-1 font-serif text-3xl italic text-(--color-ink)">
                                Bem-vindo, aventureiro.
                            </h1>
                            <p className="mt-1 max-w-md text-sm text-(--color-muted)">
                                Frascos forjados no laboratório do mestre alquimista — tudo que seu corpo cansado exige entre as jornadas.
                            </p>
                        </div>
                    </div>

                    <div className="inline-flex shrink-0 items-center gap-3 rounded-2xl border border-(--color-gold)/40 bg-(--color-bg)/80 px-5 py-3 shadow-[0_0_18px_-6px_rgba(212,175,55,0.55)]">
                        <img
                            src="/ui/stats/gold.png"
                            alt=""
                            className="h-10 w-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                        />
                        <div className="leading-tight">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--color-muted)">
                                Sua bolsa
                            </div>
                            <div className="text-2xl font-bold text-(--color-gold)">
                                {gold}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {sorted.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-(--color-border) bg-(--color-surfaceAlt)/40 p-10 text-center">
                    <img
                        src="/ui/icons/loja.png"
                        alt=""
                        className="h-20 w-20 object-contain opacity-60"
                    />
                    <div className="font-serif text-base italic text-(--color-ink)/85">
                        As prateleiras estão vazias.
                    </div>
                    <div className="text-xs text-(--color-muted)">
                        O mestre alquimista saiu em expedição — volte em breve.
                    </div>
                </div>
            ) : (
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {sorted.map((item) => {
                        const q = qty[item.id] ?? 1;
                        const busy = busyItemId === item.id;
                        const total = item.price * q;
                        const canAfford = gold >= total;

                        return (
                            <ShopItemCard
                                key={item.id}
                                item={item}
                                quantity={q}
                                busy={busy}
                                canAfford={canAfford}
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
