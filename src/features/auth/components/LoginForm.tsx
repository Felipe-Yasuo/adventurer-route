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
          "w-full rounded-xl bg-[var(--color-goldDark)] px-4 py-3",
          "text-sm font-semibold text-white transition",
          "hover:brightness-110",
          "disabled:cursor-not-allowed disabled:opacity-60",
        ].join(" ")}
      >
        {busy ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
