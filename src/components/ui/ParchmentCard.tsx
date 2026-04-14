import React from "react";

export default function ParchmentCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={[
                "rounded-2xl border border-(--color-border) bg-(--color-surface) text-(--color-ink) shadow-(--shadow-card)",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}
