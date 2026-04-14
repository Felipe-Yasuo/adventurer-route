"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function PanelShell({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const toggle = useCallback(() => setOpen((v) => !v), []);
    const close = useCallback(() => setOpen(false), []);

    return (
        <div className="min-h-screen lg:grid lg:grid-cols-[210px_1fr]">
            {/* Hamburger button — visible only below lg */}
            <button
                onClick={toggle}
                className="fixed top-3 left-3 z-50 grid h-10 w-10 place-items-center rounded-xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card) lg:hidden"
                aria-label="Menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-(--color-ink)"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    {open ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Overlay backdrop — mobile only */}
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={close}
                />
            )}

            {/* Sidebar: fixed drawer on mobile, static grid column on lg+ */}
            <aside
                className={[
                    "fixed top-0 left-0 z-40 h-screen transition-transform duration-200 ease-in-out",
                    "lg:sticky lg:z-auto lg:translate-x-0",
                    open ? "translate-x-0" : "-translate-x-full",
                ].join(" ")}
            >
                <Sidebar />
            </aside>

            <main className="min-w-0 p-3 pt-16 lg:p-4 lg:pt-4 xl:p-5 xl:pt-5">
                {children}
            </main>
        </div>
    );
}
