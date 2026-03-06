import React from "react";
import UiFrame from "./UiFrame";

export default function QuestFrame({
    children,
    className = "",
    title = "Quests",
}: {
    children: React.ReactNode;
    className?: string;
    title?: string;
}) {
    return (
        <UiFrame
            frameSrc="/ui/frames/background-quest.png"
            className={["w-full", className].join(" ")}
            paddingClassName="px-11 pt-16 pb-14"
        >
            <div className="pointer-events-none absolute left-1/2 top-7 -translate-x-1/2">
                <div className="pointer-events-none absolute left-1/2 top-[34px] -translate-x-1/2">
                    <span
                        className={[
                            "text-sm font-extrabold uppercase tracking-wider",
                            "text-(--color-ink)]",
                            "drop-shadow-[0_1px_0_rgba(255,255,255,0.55)]",
                            "skew-x-[-2deg]"
                        ].join(" ")}
                    >
                        {title}
                    </span>
                </div>
            </div>

            {children}
        </UiFrame>
    );
}