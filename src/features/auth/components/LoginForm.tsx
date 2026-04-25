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
    </form>
  );
}
