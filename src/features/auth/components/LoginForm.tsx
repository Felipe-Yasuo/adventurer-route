"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import InputField from "./InputField";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { humanizeError } from "@/features/auth/utils/humanizeError";

export default function LoginForm({
  onError,
  onClearMessages,
}: {
  onError: (msg: string) => void;
  onClearMessages: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClearMessages();

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      onError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
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
        onError("Falha ao entrar. Tente novamente.");
        return;
      }

      if (res.error) {
        onError(humanizeError(res.error) ?? "Email ou senha inválidos.");
        return;
      }

      router.push(res.url ?? "/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          "group relative w-full rounded-xl border-2 border-[var(--color-gold)] bg-[var(--color-gold)] px-4 py-3.5",
          "text-sm font-bold uppercase tracking-[0.18em] text-[#0a0704] transition",
          "hover:bg-[var(--color-goldDark)] hover:border-[var(--color-goldDark)]",
          "shadow-[0_0_18px_-6px_rgba(212,175,55,0.6)]",
          "disabled:cursor-not-allowed disabled:opacity-60",
        ].join(" ")}
      >
        {busy ? "Selando..." : "✦ Abrir o portão"}
      </button>

      <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]/70">
              ◆ Conta de demonstração
            </p>
            <div className="mt-2 space-y-0.5">
              <p className="truncate text-xs text-[var(--color-parchment)]/50">
                <span className="text-[var(--color-parchment)]/30">Email</span>{" "}
                admin@example.com
              </p>
              <p className="text-xs text-[var(--color-parchment)]/50">
                <span className="text-[var(--color-parchment)]/30">Senha</span>{" "}
                123456789
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail("admin@example.com");
              setPassword("123456789");
            }}
            className={[
              "shrink-0 rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10",
              "px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]",
              "transition hover:border-[var(--color-gold)]/50 hover:bg-[var(--color-gold)]/20",
            ].join(" ")}
          >
            Preencher
          </button>
        </div>
      </div>
    </form>
  );
}
