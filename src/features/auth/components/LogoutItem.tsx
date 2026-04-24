"use client";

import { LogoutButton } from "@/features/auth/components/AuthButtons";

export default function LogoutItem() {
    return (
        <div className="shrink-0 px-3 pb-4 pt-2">
            <div className="mb-2 border-t border-(--color-border)/60 pt-3">
                <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-(--color-muted)">
                    Conta
                </div>
                <LogoutButton />
            </div>
        </div>
    );
}
