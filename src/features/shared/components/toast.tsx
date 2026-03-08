"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type ToastType = "success" | "warning" | "info" | "error";

export type ToastItem = {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  durationMs?: number;
};

type ToastContextValue = {
  push: (t: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function uid() {
  return Math.random().toString(16).slice(2);
}

function typeStyles(type: ToastType) {
  const base =
    "rounded-2xl border p-4 shadow-[0_10px_22px_rgba(0,0,0,0.18)] backdrop-blur-sm text-[color:var(--color-ink)] bg-[rgba(242,228,198,0.96)]";

  if (type === "success") {
    return `${base} border-[rgba(47,143,91,0.22)]`;
  }

  if (type === "warning") {
    return `${base} border-[rgba(212,160,23,0.3)]`;
  }

  if (type === "error") {
    return `${base} border-[rgba(178,59,59,0.24)]`;
  }

  return `${base} border-[rgba(75,111,184,0.24)]`;
}

function accentStyles(type: ToastType) {
  if (type === "success") {
    return "bg-[rgba(47,143,91,0.14)] text-[color:var(--color-ink)]";
  }

  if (type === "warning") {
    return "bg-[rgba(212,160,23,0.16)] text-[color:var(--color-ink)]";
  }

  if (type === "error") {
    return "bg-[rgba(178,59,59,0.14)] text-[color:var(--color-ink)]";
  }

  return "bg-[rgba(75,111,184,0.14)] text-[color:var(--color-ink)]";
}

function iconByType(type: ToastType) {
  if (type === "success") return "✅";
  if (type === "warning") return "⚠️";
  if (type === "error") return "❌";
  return "ℹ️";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      push: (t) => {
        const id = uid();
        const item: ToastItem = {
          id,
          durationMs: 3000,
          ...t,
        };

        setToasts((prev) => [item, ...prev].slice(0, 5));

        const duration = Math.max(800, item.durationMs ?? 3000);
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((x) => x.id !== id));
        }, duration);
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed right-4 top-4 z-50 w-[360px] space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              typeStyles(t.type),
              "animate-[toast-in_.22s_ease-out]",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <div
                className={[
                  "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl shadow-[0_4px_8px_rgba(0,0,0,0.08)]",
                  accentStyles(t.type),
                ].join(" ")}
              >
                {iconByType(t.type)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold tracking-wide text-[color:var(--color-ink)]">
                  {t.title}
                </div>

                {t.message ? (
                  <div className="mt-1 text-xs leading-relaxed text-[color:var(--color-ink)]/70">
                    {t.message}
                  </div>
                ) : null}
              </div>

              <button
                onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
                className="ml-auto rounded-lg border border-black/10 bg-[rgba(255,255,255,0.28)] px-2 py-1 text-xs font-semibold text-[color:var(--color-ink)]/70 transition hover:bg-[rgba(255,255,255,0.46)]"
                aria-label="Fechar notificação"
                title="Fechar"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider />");
  return ctx;
}

