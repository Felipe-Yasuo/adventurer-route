"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={[
                "flex w-full items-center justify-center gap-2 rounded-xl",
                "border border-(--color-hard)/40",
                "bg-(--color-hard)/10",
                "px-4 py-2.5 text-sm font-semibold text-(--color-ink)",
                "transition hover:bg-(--color-hard)/20 hover:border-(--color-hard)/60",
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
