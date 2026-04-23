"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import LoginBrandingPanel from "@/features/auth/components/LoginBrandingPanel";
import TabButton from "@/features/auth/components/TabButton";
import MessageBox from "@/features/auth/components/MessageBox";
import GoogleButton from "@/features/auth/components/GoogleButton";
import LoginForm from "@/features/auth/components/LoginForm";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { humanizeError } from "@/features/auth/utils/humanizeError";

type Mode = "login" | "register";

export default function LoginPageClient({
  initialError,
}: {
  initialError: string | null;
}) {
  const { status } = useSession();
  const router = useRouter();
  const errorMsg = useMemo(() => humanizeError(initialError), [initialError]);

  const [mode, setMode] = useState<Mode>("login");
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [inlineOk, setInlineOk] = useState<string | null>(null);

  const clearMessages = () => {
    setInlineError(null);
    setInlineOk(null);
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <main className="relative flex min-h-screen bg-[#0a0704]">
      <LoginBrandingPanel />

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
                clearMessages();
                setMode("login");
              }}
            >
              Entrar
            </TabButton>

            <TabButton
              active={mode === "register"}
              onClick={() => {
                clearMessages();
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
          <GoogleButton disabled={status === "loading"} />

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
            <LoginForm
              onError={setInlineError}
              onClearMessages={clearMessages}
            />
          ) : (
            <RegisterForm
              onError={setInlineError}
              onSuccess={setInlineOk}
              onClearMessages={clearMessages}
              onSwitchToLogin={() => setMode("login")}
            />
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
