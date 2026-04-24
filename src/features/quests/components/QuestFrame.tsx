import React from "react";

export default function QuestFrame({
    children,
    className = "",
    title = "Contratos",
}: {
    children: React.ReactNode;
    className?: string;
    title?: string;
}) {
    return (
        <div
            className={[
                "relative w-full rounded-2xl",
                "border border-(--color-border)",
                "bg-(--color-surface)",
                "shadow-(--shadow-card)",
                "min-h-95 sm:min-h-125",
                "px-6 pt-14 pb-6",
                className,
            ].join(" ")}
        >
            <div className="absolute inset-x-0 top-0 flex justify-center">
                <span
                    className={[
                        "inline-flex items-center gap-2 rounded-b-xl px-6 py-2",
                        "bg-(--color-surfaceAlt) text-(--color-gold)",
                        "border border-(--color-border) border-t-0",
                        "font-serif text-base italic tracking-wide",
                        "shadow-[0_2px_8px_rgba(0,0,0,0.35)]",
                    ].join(" ")}
                >
                    <span className="text-[10px] opacity-70" aria-hidden>◆</span>
                    {title}
                    <span className="text-[10px] opacity-70" aria-hidden>◆</span>
                </span>
            </div>

            {children}
        </div>
    );
}
