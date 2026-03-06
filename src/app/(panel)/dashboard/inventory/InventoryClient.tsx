"use client";

import { useEffect, useMemo, useState } from "react";
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

function LifeCard({
    life,
    maxLife,
}: {
    life: number;
    maxLife: number;
}) {
    return (
        <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] px-5 py-4 shadow-[0_10px_18px_rgba(0,0,0,0.08)]">
            <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink)]/60">
                Vida atual
            </div>
            <div className="mt-2 text-2xl font-bold text-[color:var(--color-ink)]">
                ❤️ {life}/{maxLife}
            </div>
        </div>
    );
}

function InventoryItemCard({
    row,
    busy,
    disabled,
    onUse,
}: {
    row: InventoryRow;
    busy: boolean;
    disabled: boolean;
    onUse: () => void;
}) {
    return (
        <section className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-5 shadow-[0_10px_18px_rgba(0,0,0,0.1)] transition hover:translate-y-[-2px] hover:shadow-[0_14px_24px_rgba(0,0,0,0.12)]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-[16px] font-bold tracking-wide text-[color:var(--color-ink)]">
                        {row.item.name}
                    </h3>

                    <p className="mt-1 text-sm text-[color:var(--color-ink)]/68">
                        Recupera{" "}
                        <span className="font-semibold text-[color:var(--color-ink)]">
                            +{row.item.healValue}
                        </span>{" "}
                        de vida.
                    </p>
                </div>

                <div className="shrink-0 rounded-xl border border-black/10 bg-[rgba(255,255,255,0.24)] px-3 py-2 text-sm font-bold text-[color:var(--color-ink)] shadow-[0_4px_8px_rgba(0,0,0,0.05)]">
                    x{row.quantity}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink)]/55">
                        Cura
                    </div>
                    <div className="mt-2 text-sm font-bold text-[color:var(--color-ink)]">
                        +{row.item.healValue}
                    </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink)]/55">
                        Preço
                    </div>
                    <div className="mt-2 text-sm font-bold text-[color:var(--color-ink)]">
                        🪙 {row.item.price}
                    </div>
                </div>
            </div>

            <button
                onClick={onUse}
                disabled={busy || disabled}
                className={[
                    "mt-4 w-full rounded-xl border py-3 text-sm font-semibold transition",
                    busy || disabled
                        ? "cursor-not-allowed border-black/10 bg-[rgba(0,0,0,0.05)] text-[color:var(--color-ink)]/40"
                        : "border-[rgba(47,143,91,0.25)] bg-[rgba(47,143,91,0.15)] text-[color:var(--color-ink)] hover:bg-[rgba(47,143,91,0.24)]",
                ].join(" ")}
            >
                {busy ? "Usando..." : "Usar"}
            </button>

            <div className="mt-3 text-[12px] text-[color:var(--color-ink)]/48">
                Tipo: {row.item.type}
            </div>
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

    const sorted = useMemo(() => {
        return [...rows].sort((a, b) => {
            if (b.item.healValue !== a.item.healValue) {
                return b.item.healValue - a.item.healValue;
            }
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
        return (
            <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.9)] p-6 text-[color:var(--color-ink)]/70 shadow-[0_8px_14px_rgba(0,0,0,0.1)]">
                Carregando inventário...
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
                        🎒 Inventário
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]/68">
                        Use seus itens para recuperar vida e continuar sua jornada.
                    </p>
                </div>

                <LifeCard life={life} maxLife={maxLife} />
            </header>

            {sorted.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-5 text-[color:var(--color-ink)]/68 shadow-[0_8px_14px_rgba(0,0,0,0.08)]">
                    Seu inventário está vazio. Compre itens na Loja.
                </div>
            ) : (
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {sorted.map((row) => {
                        const busy = busyItemId === row.item.id;
                        const disabled = row.quantity <= 0 || (me ? me.life >= me.maxLife : false);

                        return (
                            <InventoryItemCard
                                key={row.id}
                                row={row}
                                busy={busy}
                                disabled={disabled}
                                onUse={() => handleUse(row)}
                            />
                        );
                    })}
                </section>
            )}
        </div>
    );
}