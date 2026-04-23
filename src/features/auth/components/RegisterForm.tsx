"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import InputField from "./InputField";
import { registerSchema } from "@/features/auth/schemas/auth.schema";

export default function RegisterForm({
  onError,
  onSuccess,
  onClearMessages,
  onSwitchToLogin,
}: {
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
  onClearMessages: () => void;
  onSwitchToLogin: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClearMessages();

    const parsed = registerSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      onError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
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
        onError(json?.error ?? "Erro ao criar conta.");
        return;
      }

      const loginRes = await signIn("credentials", {
        email: normalizedEmail,
        password: validatedPassword,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (loginRes?.error) {
        onSuccess("Conta criada com sucesso! Agora faça login.");
        onSwitchToLogin();
        return;
      }

      router.push("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
  );
}
