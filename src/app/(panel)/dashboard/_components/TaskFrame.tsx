import React from "react";
import UiFrame from "./UiFrame";

export default function TasksFrame({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <UiFrame
            frameSrc="/ui/frames/background-tasks.png"
            className={["w-full", "h-[560px] flex flex-col drop-shadow-[0_12px_18px_rgba(0,0,0,0.25)]", className].join(" ")}

            paddingClassName="px-12 pt-12 pb-16"
        >
            {children}
        </UiFrame>
    );
}