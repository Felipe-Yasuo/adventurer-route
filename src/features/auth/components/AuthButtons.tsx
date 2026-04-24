"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={[
                "group relative flex w-full items-center gap-3 rounded-xl",
                "border border-(--color-hard)/40",
                "bg-gradient-to-r from-(--color-hard)/15 to-(--color-hard)/5",
                "px-3 py-2.5 text-sm font-semibold tracking-wide text-(--color-ink)",
                "transition hover:from-(--color-hard)/25 hover:to-(--color-hard)/10",
                "hover:border-(--color-gold)/60 hover:text-(--color-gold)",
                "hover:shadow-[0_0_16px_-4px_rgba(212,175,55,0.45)]",
                "active:scale-[0.98]",
            ].join(" ")}
            aria-label="Sair da conta"
            title="Sair"
        >
            <img
                src="/ui/icons/sair.png"
                alt=""
                className={[
                    "h-11 w-11 object-contain shrink-0 transition",
                    "drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]",
                    "group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.7)]",
                    "group-hover:-translate-x-0.5",
                ].join(" ")}
            />
            <span className="uppercase text-[13px]">Sair</span>
        </button>
    );
}
