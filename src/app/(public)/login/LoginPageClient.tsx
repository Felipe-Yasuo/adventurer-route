"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  loginSchema,
  registerSchema,
} from "@/features/auth/schemas/auth.schema";

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

/* ── Reusable pieces ── */

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
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-parchment)]/50">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={[
          "w-full rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3",
          "text-sm text-[var(--color-parchment)] placeholder:text-white/25 outline-none transition",
          "focus:border-[var(--color-gold)]/30",
          "focus:bg-white/[0.06]",
          "focus:shadow-[0_0_0_3px_rgba(212,160,23,0.06)]",
        ].join(" ")}
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
      ? "border-[var(--color-danger)]/25 bg-[var(--color-danger)]/10 text-[var(--color-parchment)]/85"
      : "border-[var(--color-success)]/25 bg-[var(--color-success)]/10 text-[var(--color-parchment)]/85";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
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
        "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition",
        active
          ? "bg-[var(--color-gold)]/15 text-[var(--color-gold)] shadow-[0_0_12px_rgba(212,160,23,0.08)]"
          : "text-white/40 hover:text-white/60",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ── Main component ── */

export default function LoginPageClient({
  initialError,
}: {
  initialError: string | null;
}) {
  const { status } = useSession();
  const router = useRouter();
  const errorMsg = useMemo(() => humanizeError(initialError), [initialError]);

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

    const parsed = loginSchema.safeParse({ email, password });

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
        setInlineError(
          humanizeError(res.error) ?? "Email ou senha inválidos."
        );
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

    const parsed = registerSchema.safeParse({ name, email, password });

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

      router.push("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative flex min-h-screen bg-[#0a0704]">
      {/* ─── Left: background image ─── */}
      <div className="relative hidden w-[55%] lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/ui/frames/background-login.png')",
          }}
        />
        {/* Vignette edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0704]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0704]/60 via-transparent to-[#0a0704]/40" />

        {/* Branding overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/15 bg-black/30 px-4 py-2 backdrop-blur-md">
            <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-parchment)]/70">
              Adventurer Route
            </span>
          </div>
          <h2 className="mt-4 max-w-md font-[family-name:var(--font-serif)] text-3xl font-bold leading-snug text-[var(--color-parchment)]/90">
            Sua jornada começa aqui.
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-parchment)]/45">
            Organize missões, evolua seu personagem e transforme cada tarefa em
            uma conquista épica.
          </p>
        </div>
      </div>

      {/* ─── Right: form ─── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-16">
        {/* Mobile-only background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 lg:hidden"
          style={{
            backgroundImage: "url('/ui/frames/background-login.png')",
          }}
        />
        <div className="absolute inset-0 bg-[#0a0704]/80 lg:hidden" />

        <div className="relative z-10 w-full max-w-[400px]">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center lg:items-start">
            <img
              src="/ui/logo/adventurer-route.png"
              alt="Adventurer Route"
              className="h-16 w-auto object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
            />

            <h1 className="mt-5 text-2xl font-bold text-[var(--color-parchment)]">
              {mode === "login" ? "Bem-vindo de volta" : "Criar sua conta"}
            </h1>

            <p className="mt-2 text-sm text-[var(--color-parchment)]/40">
              {mode === "login"
                ? "Entre para continuar sua aventura."
                : "Comece sua jornada no Adventurer Route."}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex rounded-xl border border-white/[0.06] bg-white/[0.03] p-1">
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

          {/* Messages */}
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

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            disabled={busy || status === "loading"}
            className={[
              "flex w-full items-center justify-center gap-3 rounded-xl",
              "border border-white/[0.08] bg-white/[0.05] px-4 py-3",
              "text-sm font-semibold text-[var(--color-parchment)]/90",
              "transition hover:bg-white/[0.08]",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">
              ou
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Forms */}
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
                className={[
                  "w-full rounded-xl bg-[var(--color-goldDark)] px-4 py-3",
                  "text-sm font-semibold text-white transition",
                  "hover:brightness-110",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
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
                className={[
                  "w-full rounded-xl bg-[var(--color-success)] px-4 py-3",
                  "text-sm font-semibold text-white transition",
                  "hover:brightness-110",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              >
                {busy ? "Criando..." : "Criar conta"}
              </button>
            </form>
          )}

          {status === "loading" && (
            <p className="mt-4 text-center text-xs text-white/30">
              Verificando sessão...
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
