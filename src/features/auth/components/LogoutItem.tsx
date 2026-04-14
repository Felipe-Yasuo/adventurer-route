"use client";

import { LogoutButton } from "@/features/auth/components/AuthButtons";

export default function LogoutItem() {
    return (
        <div className="mt-3 px-3 pb-3">
            <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-3 shadow-(--shadow-card)">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--color-muted)">
                    Conta
                </div>

                <div className="flex justify-start">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}
