"use client";

import { LogoutButton } from "./AuthButtons";

export default function LogoutItem() {
    return (
        <div className="mt-3 px-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs text-white/60 mb-2 hidden md:block">
                    Conta
                </div>

                <div className="flex justify-center md:justify-start">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}