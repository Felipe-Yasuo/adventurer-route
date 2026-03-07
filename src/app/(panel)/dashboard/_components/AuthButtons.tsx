"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={[
                "flex w-full items-center justify-center gap-2 rounded-xl",
                "border border-[rgba(178,59,59,0.18)]",
                "bg-[rgba(178,59,59,0.10)]",
                "px-4 py-2.5 text-sm font-semibold text-[color:var(--color-ink)]",
                "transition hover:bg-[rgba(178,59,59,0.18)]",
                "hover:shadow-[0_6px_12px_rgba(0,0,0,0.08)]",
                "active:scale-[0.98]",
            ].join(" ")}
            aria-label="Sair da conta"
            title="Sair"
        >
            <img
                src="/ui/icons/sair.png"
                alt=""
                className="h-5 w-5 object-contain"
            />
            <span className="hidden md:inline">Sair</span>
        </button>
    );
}