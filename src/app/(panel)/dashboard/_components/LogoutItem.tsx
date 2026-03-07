"use client";

import { LogoutButton } from "./AuthButtons";

export default function LogoutItem() {
    return (
        <div className="mt-3 px-3 pb-3">
            <div
                className="
          rounded-2xl border border-black/10
          bg-[rgba(242,228,198,0.65)]
          p-3 shadow-[0_6px_10px_rgba(0,0,0,0.06)]
        "
            >
                <div className="mb-2 hidden md:block text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink)]/55">
                    Conta
                </div>

                <div className="flex justify-center md:justify-start">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}