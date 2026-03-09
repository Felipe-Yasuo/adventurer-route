import React from "react";
import UiFrame from "@/components/ui/UiFrame";

export default function NewTaskFrame({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <UiFrame
            frameSrc="/ui/frames/background-new-task.jpg"
            className={["w-full", className].join(" ")}
            paddingClassName="px-10 pt-10 pb-10 sm:px-8 sm:py-8"
        >
            {children}
        </UiFrame>
    );
}

