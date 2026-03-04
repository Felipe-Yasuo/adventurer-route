import GlassCard from "@/app/(panel)/dashboard/_components/GlassCard";

type ShopItem = {
    id: string;
    type: string;
    name: string;
    price: number;
    healValue: number;
};

async function getShopItems(): Promise<ShopItem[]> {
    const res = await fetch(`${process.env.NEXTAUTH_URL ?? ""}/api/shop`, {

        cache: "no-store",
    });

    if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Erro ao carregar loja");
    }

    return res.json();
}

export default async function ShopPage() {
    let items: ShopItem[] = [];
    let error: string | null = null;

    try {
        items = await getShopItems();
    } catch (e: any) {
        error = e?.message ?? "Erro desconhecido";
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-xl font-semibold text-cloudWhite">🛒 Loja</h1>
                <p className="mt-1 text-sm text-white/60">
                    Compre itens usando seu GOLD.
                </p>
            </header>

            {error ? (
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <p className="text-rose">Erro: {error}</p>
                    <p className="mt-1 text-sm text-white/60">
                        Tente recarregar a página.
                    </p>
                </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.length === 0 && !error ? (
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-white/60">
                        Nenhum item disponível no momento.
                    </div>
                ) : (
                    items.map((item) => (
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

                            <div className="mt-4 text-[11px] text-white/40">
                                Tipo: {item.type}
                            </div>
                        </GlassCard>
                    ))
                )}
            </div>
        </div>
    );
}