export type ItemVisual = {
    icon: string;
    flavor: string;
    rarity: "common" | "rare" | "epic";
};

const FALLBACK: ItemVisual = {
    icon: "/ui/stats/vida.png",
    flavor: "Um item misterioso, com efeitos desconhecidos.",
    rarity: "common",
};

const REGISTRY: Record<string, ItemVisual> = {
    POTION_SMALL: {
        icon: "/ui/shop/small-potion.png",
        flavor: "Um gole basta para aguentar o próximo embate.",
        rarity: "common",
    },
    POTION_MEDIUM: {
        icon: "/ui/shop/medium-potion.png",
        flavor: "Tônico de guilda, forjado para aventureiros persistentes.",
        rarity: "rare",
    },
    POTION_LARGE: {
        icon: "/ui/shop/large-potion.png",
        flavor: "Selo de cera do mestre alquimista. Restaura o vigor por completo.",
        rarity: "epic",
    },
};

export function visualForItemType(type: string): ItemVisual {
    return REGISTRY[type] ?? FALLBACK;
}

export const RARITY_STYLES: Record<
    ItemVisual["rarity"],
    { ring: string; label: string; chip: string; glow: string }
> = {
    common: {
        ring: "border-(--color-border)",
        label: "Comum",
        chip: "bg-(--color-surfaceAlt) text-(--color-muted) border-(--color-border)",
        glow: "",
    },
    rare: {
        ring: "border-(--color-info)/50",
        label: "Rara",
        chip: "bg-(--color-info)/15 text-(--color-info) border-(--color-info)/40",
        glow: "shadow-[0_0_20px_-6px_rgba(59,130,246,0.55)]",
    },
    epic: {
        ring: "border-(--color-gold)/60",
        label: "Épica",
        chip: "bg-(--color-gold)/15 text-(--color-gold) border-(--color-gold)/45",
        glow: "shadow-[0_0_24px_-6px_rgba(212,175,55,0.6)]",
    },
};
