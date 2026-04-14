import React from "react";

export default function NewTaskFrame({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={[
                "w-full rounded-2xl",
                "border border-(--color-border)",
                "bg-(--color-surface)",
                "shadow-(--shadow-card)",
                "px-6 pt-6 pb-6",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}
