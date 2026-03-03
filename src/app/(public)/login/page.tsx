"use client";

import GlassCard from "@/app/(panel)/dashboard/_components/GlassCard";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] grid place-items-center p-6">
            <div className="w-full max-w-md">
                <GlassCard>
                    <h1 className="text-lg font-semibold text-cloudWhite">Entrar</h1>
                    <p className="mt-1 text-sm text-white/60">
                        Faça login para acessar seu painel.
                    </p>

                    <div className="mt-6">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            className="w-full rounded-xl bg-cloudWhite text-twilight py-2 text-sm font-semibold hover:opacity-90"
                        >
                            Continuar com Google
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}