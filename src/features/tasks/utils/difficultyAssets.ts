import type { Difficulty } from "@/features/tasks/types";

export const DIFFICULTY_META: Record<
    Difficulty,
    { icon: string; label: string }
> = {
    EASY: { icon: "/ui/dashboard/easy.png", label: "Fácil" },
    MEDIUM: { icon: "/ui/dashboard/medium.png", label: "Médio" },
    HARD: { icon: "/ui/dashboard/hard.png", label: "Difícil" },
};
