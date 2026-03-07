"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/validators/auth";

type Mode = "login" | "register";

function humanizeError(code: string | null) {
    if (!code) return null;

    if (code === "EmailJaCadastrado") {
        return "Esse email já possui conta criada no site. Entre com email e senha.";
    }

    if (code === "CredentialsSignin") return "Email ou senha inválidos.";
    if (code === "OAuthCreateAccount") {
        return "Não foi possível criar a conta com Google.";
    }
    if (code === "OAuthAccountNotLinked") {
        return "Esse email já existe com outro método. Entre com o método original.";
    }

    return "Não foi possível entrar. Tente novamente.";
}

function InputField({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    autoComplete,
}: {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoComplete?: string;
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                {label}
            </label>

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className="
          w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3
          text-sm text-white placeholder:text-white/35 outline-none transition
          focus:border-[rgba(212,160,23,0.45)]
          focus:bg-black/35
          focus:shadow-[0_0_0_4px_rgba(212,160,23,0.08)]
        "
            />
        </div>
    );
}

function MessageBox({
    children,
    variant,
}: {
    children: React.ReactNode;
    variant: "error" | "success";
}) {
    const styles =
        variant === "error"
            ? "border-[rgba(178,59,59,0.28)] bg-[rgba(178,59,59,0.14)] text-white/85"
            : "border-[rgba(47,143,91,0.28)] bg-[rgba(47,143,91,0.14)] text-white/85";

    return (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>
            {children}
        </div>
    );
}

function TabButton({
    active,
    children,
    onClick,
}: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                active
                    ? "bg-[rgba(242,228,198,0.95)] text-[color:var(--color-ink)] shadow-[0_6px_14px_rgba(0,0,0,0.22)]"
                    : "text-white/65 hover:bg-white/5 hover:text-white/85",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

export default function LoginPage() {
    const { status } = useSession();
    const router = useRouter();
    const search = useSearchParams();

    const errorMsg = useMemo(() => humanizeError(search.get("error")), [search]);

    const [mode, setMode] = useState<Mode>("login");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

        const parsed = loginSchema.safeParse({
            email,
            password,
        });

        if (!parsed.success) {
            setInlineError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
            return;
        }

        const { email: normalizedEmail, password: validatedPassword } = parsed.data;

        setBusy(true);
        try {
            const res = await signIn("credentials", {
                email: normalizedEmail,
                password: validatedPassword,
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

        const parsed = registerSchema.safeParse({
            name,
            email,
            password,
        });

        if (!parsed.success) {
            setInlineError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
            return;
        }

        const {
            name: normalizedName,
            email: normalizedEmail,
            password: validatedPassword,
        } = parsed.data;

        setBusy(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: normalizedName || undefined,
                    email: normalizedEmail,
                    password: validatedPassword,
                }),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok) {
                setInlineError(json?.error ?? "Erro ao criar conta.");
                return;
            }

            const loginRes = await signIn("credentials", {
                email: normalizedEmail,
                password: validatedPassword,
                redirect: false,
                callbackUrl: "/dashboard",
            });

            if (loginRes?.error) {
                setInlineOk("Conta criada com sucesso! Agora faça login.");
                setMode("login");
                return;
            }

            router.push(loginRes?.url ?? "/dashboard");
        } finally {
            setBusy(false);
        }
    }

    return (
        <main
            className="
        relative min-h-screen overflow-hidden
        bg-[radial-gradient(circle_at_top,rgba(212,160,23,0.10),transparent_28%),linear-gradient(to_bottom,rgba(10,7,6,0.72),rgba(10,7,6,0.88))]
      "
        >
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
                <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="hidden lg:block">
                        <div className="max-w-xl">
                            <div className="inline-flex rounded-full border border-[rgba(212,160,23,0.22)] bg-[rgba(212,160,23,0.10)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[rgba(242,228,198,0.9)]">
                                Adventurer Route
                            </div>

                            <h1 className="mt-6 text-5xl font-bold leading-[1.05] text-[rgba(242,228,198,0.98)]">
                                Transforme suas tarefas em uma jornada.
                            </h1>

                            <p className="mt-5 max-w-lg text-base leading-7 text-white/68">
                                Organize suas missões, evolua seu personagem, complete quests e
                                acompanhe seu progresso em um painel gamificado inspirado em RPG.
                            </p>

                            <div className="mt-8 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="text-xl">⚔️</div>
                                    <div className="mt-2 text-sm font-semibold text-[rgba(242,228,198,0.96)]">
                                        Tasks
                                    </div>
                                    <div className="mt-1 text-xs leading-5 text-white/58">
                                        Crie e conclua missões do dia.
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="text-xl">🧭</div>
                                    <div className="mt-2 text-sm font-semibold text-[rgba(242,228,198,0.96)]">
                                        Quests
                                    </div>
                                    <div className="mt-1 text-xs leading-5 text-white/58">
                                        Ganhe recompensas extras.
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="text-xl">🏆</div>
                                    <div className="mt-2 text-sm font-semibold text-[rgba(242,228,198,0.96)]">
                                        Progresso
                                    </div>
                                    <div className="mt-1 text-xs leading-5 text-white/58">
                                        Suba de nível e evolua.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto w-full max-w-md">
                        <div
                            className="
                rounded-[28px] border border-white/10
                bg-[linear-gradient(to_bottom,rgba(22,16,13,0.88),rgba(14,10,8,0.92))]
                p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]
                backdrop-blur-md sm:p-8
              "
                        >
                            <div className="mb-6 flex flex-col items-center text-center">
                                <img
                                    src="/ui/logo/adventurer-route.png"
                                    alt="Adventurer Route"
                                    className="h-20 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
                                />

                                <h2 className="mt-4 text-2xl font-bold tracking-wide text-[rgba(242,228,198,0.98)]">
                                    {mode === "login" ? "Entrar na jornada" : "Criar sua conta"}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-white/62">
                                    {mode === "login"
                                        ? "Acesse seu painel e continue sua aventura."
                                        : "Comece agora e salve sua progressão no mundo do Adventurer Route."}
                                </p>
                            </div>

                            <div className="mb-6 flex rounded-2xl border border-white/10 bg-black/20 p-1">
                                <TabButton
                                    active={mode === "login"}
                                    onClick={() => {
                                        setInlineError(null);
                                        setInlineOk(null);
                                        setMode("login");
                                    }}
                                >
                                    Entrar
                                </TabButton>

                                <TabButton
                                    active={mode === "register"}
                                    onClick={() => {
                                        setInlineError(null);
                                        setInlineOk(null);
                                        setMode("register");
                                    }}
                                >
                                    Criar conta
                                </TabButton>
                            </div>

                            {(errorMsg || inlineError) && (
                                <div className="mb-4">
                                    <MessageBox variant="error">
                                        {inlineError ?? errorMsg}
                                    </MessageBox>
                                </div>
                            )}

                            {inlineOk && (
                                <div className="mb-4">
                                    <MessageBox variant="success">{inlineOk}</MessageBox>
                                </div>
                            )}

                            <button
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                disabled={busy || status === "loading"}
                                className="
                  flex w-full items-center justify-center gap-3 rounded-2xl
                  border border-white/10 bg-[rgba(242,228,198,0.96)] px-4 py-3
                  text-sm font-semibold text-[color:var(--color-ink)]
                  transition hover:translate-y-[-1px] hover:bg-white
                  disabled:cursor-not-allowed disabled:opacity-70
                "
                            >
                                <span className="text-base">🌐</span>
                                Continuar com Google
                            </button>

                            <div className="my-5 flex items-center gap-3">
                                <div className="h-px flex-1 bg-white/10" />
                                <span className="text-xs uppercase tracking-[0.2em] text-white/35">
                                    ou
                                </span>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            {mode === "login" ? (
                                <form onSubmit={handleLoginCredentials} className="space-y-4">
                                    <InputField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={setEmail}
                                        autoComplete="email"
                                        placeholder="seuemail@gmail.com"
                                    />

                                    <InputField
                                        label="Senha"
                                        type="password"
                                        value={password}
                                        onChange={setPassword}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                    />

                                    <button
                                        type="submit"
                                        disabled={busy}
                                        className="
                      w-full rounded-2xl border border-[rgba(212,160,23,0.34)]
                      bg-[rgba(212,160,23,0.18)] px-4 py-3 text-sm font-semibold
                      text-[rgba(242,228,198,0.98)] transition
                      hover:bg-[rgba(212,160,23,0.28)]
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                                    >
                                        {busy ? "Entrando..." : "Entrar"}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <InputField
                                        label="Nome"
                                        value={name}
                                        onChange={setName}
                                        autoComplete="name"
                                        placeholder="Seu nome (opcional)"
                                    />

                                    <InputField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={setEmail}
                                        autoComplete="email"
                                        placeholder="seuemail@gmail.com"
                                    />

                                    <InputField
                                        label="Senha"
                                        type="password"
                                        value={password}
                                        onChange={setPassword}
                                        autoComplete="new-password"
                                        placeholder="mínimo 8 caracteres"
                                    />

                                    <button
                                        type="submit"
                                        disabled={busy}
                                        className="
                      w-full rounded-2xl border border-[rgba(47,143,91,0.32)]
                      bg-[rgba(47,143,91,0.20)] px-4 py-3 text-sm font-semibold
                      text-[rgba(242,228,198,0.98)] transition
                      hover:bg-[rgba(47,143,91,0.30)]
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                                    >
                                        {busy ? "Criando..." : "Criar conta"}
                                    </button>
                                </form>
                            )}

                            {status === "loading" && (
                                <p className="mt-4 text-center text-xs text-white/45">
                                    Verificando sessão...
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}