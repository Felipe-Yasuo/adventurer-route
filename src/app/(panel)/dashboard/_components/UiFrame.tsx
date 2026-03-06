import React from "react";

type UiFrameProps = {
    children: React.ReactNode;
    className?: string;
    frameSrc: string;
    paddingClassName?: string;
};

export default function UiFrame({
    children,
    className = "",
    frameSrc,
    paddingClassName = "p-6",
}: UiFrameProps) {
    return (
        <div className={["relative z-0", className].join(" ")}>
            {/* frame */}
            <img
                src={frameSrc}
                alt=""
                className="pointer-events-none select-none absolute inset-0 h-full w-full object-fill"
                draggable={false}
            />

            {/* conteúdo */}
            <div className={["relative", paddingClassName].join(" ")}>
                {children}
            </div>
        </div>
    );
}