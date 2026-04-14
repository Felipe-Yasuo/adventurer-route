import React from "react";

export default function TasksFrame({
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
                "min-h-95 sm:min-h-95 2xl:h-160 flex flex-col",
                "px-5 pt-5 pb-6",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}
