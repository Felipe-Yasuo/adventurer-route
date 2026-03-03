"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import GlassCard from "@/app/(panel)/dashboard/_components/GlassCard";

type Mode = "login" | "register";

function humanizeError(code: string | null) {
    if (!code) return null;
    if (code === "CredentialsSignin") return "Email ou senha inválidos.";
    if (code === "OAuthCreateAccount") return "Não foi possível criar a conta com Google.";
    if (code === "OAuthAccountNotLinked")
        return "Esse email já existe com outro método. Entre com o método original.";
    return "Não foi possível entrar. Tente novamente.";
}

export default function LoginPage() {
    const { status } = useSession();
    const router = useRouter();
    const search = useSearchParams();

    const errorMsg = useMemo(() => humanizeError(search.get("error")), [search]);

    const [mode, setMode] = useState<Mode>("login");

    // login
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // register
    const [name, setName] = useState("");

    const [busy, setBusy] = useState(false);
    const [inlineError, setInlineError] = useState<string | null>(null);
    const [inlineOk, setInlineOk] = useState<string | null>(null);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    async function handleLoginCredentials(e: React.FormEvent) {
        e.preventDefault();
        setInlineError(null);
        setInlineOk(null);

        const em = email.trim().toLowerCase();
        if (!em || !password) {
            setInlineError("Preencha email e senha.");
            return;
        }

        setBusy(true);
        try {
            // redirect: false => a gente controla o erro e redireciona manualmente
            const res = await signIn("credentials", {
                email: em,
                password,
                redirect: false,
                callbackUrl: "/dashboard",
            });

            if (!res) {
                setInlineError("Falha ao entrar. Tente novamente.");
                return;
            }

            if (res.error) {
                setInlineError(humanizeError(res.error) ?? "Email ou senha inválidos.");
                return;
            }

            router.push(res.url ?? "/dashboard");
        } finally {
            setBusy(false);
        }
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setInlineError(null);
        setInlineOk(null);

        const nm = name.trim();
        const em = email.trim().toLowerCase();

        if (!em || !password) {
            setInlineError("Email e senha são obrigatórios.");
            return;
        }
        if (password.length < 8) {
            setInlineError("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        setBusy(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nm || undefined, email: em, password }),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                setInlineError(json?.error ?? "Erro ao criar conta.");
                return;
            }

            // ✅ cria conta e já faz login automático
            const loginRes = await signIn("credentials", {
                email: em,
                password,
                redirect: false,
                callbackUrl: "/dashboard",
            });

            if (loginRes?.error) {
                setInlineOk("Conta criada! Agora faça login.");
                setMode("login");
                return;
            }

            router.push(loginRes?.url ?? "/dashboard");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-80px)] grid place-items-center p-6">
            <div className="w-full max-w-md">
                <GlassCard>
                    <h1 className="text-lg font-semibold text-cloudWhite">
                        {mode === "login" ? "Entrar" : "Criar conta"}
                    </h1>

                    <p className="mt-1 text-sm text-white/60">
                        {mode === "login"
                            ? "Entre para acessar seu painel."
                            : "Crie sua conta para salvar seu progresso."}
                    </p>

                    {(errorMsg || inlineError) && (
                        <div className="mt-4 rounded-xl border border-white/10 bg-rose/10 p-3 text-sm text-white/80">
                            {inlineError ?? errorMsg}
                        </div>
                    )}

                    {inlineOk && (
                        <div className="mt-4 rounded-xl border border-white/10 bg-forest/10 p-3 text-sm text-white/80">
                            {inlineOk}
                        </div>
                    )}

                    {/* Google */}
                    <div className="mt-6">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            disabled={busy || status === "loading"}
                            className="w-full rounded-xl bg-cloudWhite text-twilight py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-70"
                        >
                            Continuar com Google
                        </button>
                    </div>

                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-xs text-white/40">ou</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    {/* Form */}
                    {mode === "login" ? (
                        <form onSubmit={handleLoginCredentials} className="space-y-3">
                            <div>
                                <label className="text-xs text-white/70">Email</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    autoComplete="email"
                                    className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
                                    placeholder="seuemail@gmail.com"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-white/70">Senha</label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    autoComplete="current-password"
                                    className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={busy}
                                className="w-full rounded-xl bg-blueSoft/80 text-twilight py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-70"
                            >
                                {busy ? "Entrando..." : "Entrar"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setInlineError(null);
                                    setInlineOk(null);
                                    setMode("register");
                                }}
                                className="w-full text-xs text-blueSoft hover:underline"
                            >
                                Não tem conta? Criar agora
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-3">
                            <div>
                                <label className="text-xs text-white/70">Nome (opcional)</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-white/70">Email</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    autoComplete="email"
                                    className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
                                    placeholder="seuemail@gmail.com"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-white/70">Senha</label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    autoComplete="new-password"
                                    className="mt-1 w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-sm outline-none focus:border-blueSoft/60"
                                    placeholder="mínimo 8 caracteres"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={busy}
                                className="w-full rounded-xl bg-forest/70 text-cloudWhite py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-70"
                            >
                                {busy ? "Criando..." : "Criar conta"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setInlineError(null);
                                    setInlineOk(null);
                                    setMode("login");
                                }}
                                className="w-full text-xs text-blueSoft hover:underline"
                            >
                                Já tenho conta — voltar para entrar
                            </button>
                        </form>
                    )}

                    {status === "loading" ? (
                        <p className="mt-4 text-xs text-white/50">Verificando sessão...</p>
                    ) : null}
                </GlassCard>
            </div>
        </div>
    );
}