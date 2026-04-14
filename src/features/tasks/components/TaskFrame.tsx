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
                "min-h-[380px] sm:min-h-[380px] 2xl:h-[760px] flex flex-col",
                "px-5 pt-5 pb-6",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}
