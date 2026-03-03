"use client";

import GlassCard from "@/app/(panel)/dashboard/_components/GlassCard";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const { status } = useSession();
    const router = useRouter();
    const search = useSearchParams();
    const error = search.get("error");

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    return (
        <div className="min-h-[calc(100vh-80px)] grid place-items-center p-6">
            <div className="w-full max-w-md">
                <GlassCard>
                    <h1 className="text-lg font-semibold text-cloudWhite">Entrar</h1>
                    <p className="mt-1 text-sm text-white/60">
                        Faça login para acessar seu painel.
                    </p>

                    {error ? (
                        <div className="mt-4 rounded-xl border border-white/10 bg-rose/10 p-3 text-sm text-white/80">
                            Não foi possível entrar. Tente novamente.
                        </div>
                    ) : null}

                    <div className="mt-6">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            disabled={status === "loading"}
                            className="w-full rounded-xl bg-cloudWhite text-twilight py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-70"
                        >
                            {status === "loading" ? "Verificando..." : "Continuar com Google"}
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}