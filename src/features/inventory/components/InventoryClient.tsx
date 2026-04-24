"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/features/shared/components/toast";
import { useMe } from "@/features/shared/components/me-store";
import {
    visualForItemType,
    RARITY_STYLES,
} from "@/features/shop/utils/itemAssets";

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

function LifeBanner({ life, maxLife }: { life: number; maxLife: number }) {
    const pct = maxLife > 0 ? Math.min(100, (life / maxLife) * 100) : 0;
    const full = life >= maxLife && maxLife > 0;
    const low = pct <= 30 && life > 0;

    const fillClass = low
        ? "bg-linear-to-r from-red-600 to-red-400"
        : "bg-linear-to-r from-(--color-hard) via-red-500 to-red-400";

    return (
        <div className="inline-flex min-w-65 items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-bg)/80 px-4 py-3 shadow-[0_0_18px_-6px_rgba(230,60,60,0.4)]">
            <img
                src="/ui/stats/vida.png"
                alt=""
                className={[
                    "h-12 w-12 shrink-0 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]",
                    low ? "animate-pulse" : "",
                ].join(" ")}
            />
            <div className="flex-1 leading-tight">
                <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--color-muted)">
                        Sua vitalidade
                    </span>
                    <span className="text-sm font-bold text-(--color-ink)">
                        {life}/{maxLife}
                    </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full border border-black/50 bg-black/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
                    <div
                        className={[
                            "h-full rounded-full transition-[width] duration-500 ease-out shadow-[0_0_6px_rgba(230,60,60,0.55)]",
                            fillClass,
                        ].join(" ")}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <div className="mt-1 text-[10px] italic text-(--color-muted)">
                    {full
                        ? "Em pleno vigor."
                        : low
                        ? "Você sangra — beba algo, depressa."
                        : "Mantenha-se preparado."}
                </div>
            </div>
        </div>
    );
}

function InventoryItemCard({
    row,
    busy,
    reason,
    onUse,
}: {
    row: InventoryRow;
    busy: boolean;
    reason: "ok" | "full" | "empty";
    onUse: () => void;
}) {
    const visual = visualForItemType(row.item.type);
    const rarity = RARITY_STYLES[visual.rarity];
    const disabled = reason !== "ok";

    return (
        <section
            className={[
                "group relative flex flex-col rounded-2xl border-2 bg-(--color-surface) p-5 transition",
                rarity.ring,
                rarity.glow,
                disabled ? "opacity-80" : "hover:-translate-y-1 hover:border-(--color-gold)/70",
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
                <div className="inline-flex items-center rounded-lg border border-(--color-gold)/40 bg-(--color-gold)/10 px-2.5 py-1 text-xs font-bold text-(--color-gold)">
                    × {row.quantity}
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
                    className={[
                        "relative h-32 w-32 object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.55)] transition duration-300",
                        disabled ? "saturate-50 opacity-80" : "group-hover:scale-105 group-hover:-translate-y-1",
                    ].join(" ")}
                />
            </div>

            <div className="mt-3 text-center">
                <h3 className="font-serif text-lg italic text-(--color-ink)">
                    {row.item.name}
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
                    +{row.item.healValue}
                </span>
                <span className="text-(--color-muted)">de vida</span>
            </div>

            <button
                onClick={onUse}
                disabled={busy || disabled}
                className={[
                    "mt-4 w-full rounded-xl border-2 py-3 text-sm font-bold tracking-wide transition",
                    !disabled
                        ? "border-(--color-easy) bg-(--color-easy) text-(--color-bg) hover:brightness-110"
                        : "border-(--color-border) bg-(--color-surfaceAlt) text-(--color-muted) cursor-not-allowed",
                ].join(" ")}
                aria-label={`Usar ${row.item.name}`}
            >
                {busy
                    ? "Bebendo..."
                    : reason === "full"
                    ? "Vida em pleno vigor"
                    : reason === "empty"
                    ? "Sem unidades"
                    : "✦ Beber poção"}
            </button>
        </section>
    );
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
    const atFull = maxLife > 0 && life >= maxLife;

    const sorted = useMemo(() => {
        return [...rows].sort((a, b) => {
            if (b.item.healValue !== a.item.healValue) {
                return b.item.healValue - a.item.healValue;
            }
            return a.item.name.localeCompare(b.item.name);
        });
    }, [rows]);

    const totalItems = useMemo(
        () => rows.reduce((acc, r) => acc + r.quantity, 0),
        [rows]
    );

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
                title: "Vigor restaurado!",
                message: `+${result.healed} vida • ${result.usedItem.name} (restam ${result.remaining})`,
                durationMs: 3600,
                iconSrc: "/ui/stats/vida.png",
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
        return (
            <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-(--color-muted) shadow-(--shadow-card)">
                Abrindo sua mochila...
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
                            src="/ui/icons/inventario.png"
                            alt=""
                            className="h-16 w-16 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.55)]"
                        />
                        <div>
                            <div className="flex items-center gap-2 text-(--color-gold)">
                                <span className="text-xs" aria-hidden>◆</span>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                                    Mochila do Aventureiro
                                </span>
                                <span className="text-xs" aria-hidden>◆</span>
                            </div>
                            <h1 className="mt-1 font-serif text-3xl italic text-(--color-ink)">
                                {totalItems === 0
                                    ? "Bolsa silenciosa."
                                    : `${totalItems} ${totalItems === 1 ? "tesouro" : "tesouros"} a seu dispor.`}
                            </h1>
                            <p className="mt-1 max-w-md text-sm text-(--color-muted)">
                                Cada frasco é um segundo fôlego. Use com sabedoria — a próxima batalha não avisa.
                            </p>
                        </div>
                    </div>

                    <LifeBanner life={life} maxLife={maxLife} />
                </div>
            </header>

            {sorted.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-(--color-border) bg-(--color-surfaceAlt)/40 p-12 text-center">
                    <img
                        src="/ui/icons/inventario.png"
                        alt=""
                        className="h-24 w-24 object-contain opacity-70"
                    />
                    <div className="font-serif text-lg italic text-(--color-ink)/85">
                        Sua mochila está vazia.
                    </div>
                    <div className="max-w-sm text-xs text-(--color-muted)">
                        Todo herói começa com as mãos vazias. Passe pelo Mercado da Guilda e abasteça-se antes da próxima jornada.
                    </div>
                    <Link
                        href="/dashboard/shop"
                        className="mt-2 inline-flex items-center gap-2 rounded-xl border-2 border-(--color-gold) bg-(--color-gold) px-5 py-2.5 text-sm font-bold text-(--color-bg) transition hover:bg-(--color-goldDark) hover:border-(--color-goldDark)"
                    >
                        ✦ Visitar o Mercado
                    </Link>
                </div>
            ) : (
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {sorted.map((row) => {
                        const busy = busyItemId === row.item.id;
                        const reason: "ok" | "full" | "empty" =
                            row.quantity <= 0 ? "empty" : atFull ? "full" : "ok";

                        return (
                            <InventoryItemCard
                                key={row.id}
                                row={row}
                                busy={busy}
                                reason={reason}
                                onUse={() => handleUse(row)}
                            />
                        );
                    })}
                </section>
            )}
        </div>
    );
}
