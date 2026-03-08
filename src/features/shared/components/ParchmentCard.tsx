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
                "rounded-2xl bg-[rgba(242,228,198,0.92)] text-(--color-ink)] shadow-lg",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}

