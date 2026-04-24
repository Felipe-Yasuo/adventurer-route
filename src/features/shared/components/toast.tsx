"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type ToastType = "success" | "warning" | "info" | "error";

export type ToastItem = {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  durationMs?: number;
  iconSrc?: string;
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
    "rounded-2xl border p-4 shadow-(--shadow-cardStrong) backdrop-blur-sm text-(--color-ink) bg-(--color-surface)";

  if (type === "success") {
    return `${base} border-(--color-easy)/50`;
  }

  if (type === "warning") {
    return `${base} border-(--color-gold)/50`;
  }

  if (type === "error") {
    return `${base} border-(--color-hard)/50`;
  }

  return `${base} border-(--color-info)/50`;
}

function accentStyles(type: ToastType) {
  if (type === "success") {
    return "bg-(--color-easy)/20 text-(--color-easy) border border-(--color-easy)/40";
  }

  if (type === "warning") {
    return "bg-(--color-gold)/20 text-(--color-gold) border border-(--color-gold)/40";
  }

  if (type === "error") {
    return "bg-(--color-hard)/20 text-(--color-hard) border border-(--color-hard)/40";
  }

  return "bg-(--color-info)/20 text-(--color-info) border border-(--color-info)/40";
}

function titleColor(type: ToastType) {
  if (type === "success") return "text-(--color-easy)";
  if (type === "warning") return "text-(--color-gold)";
  if (type === "error") return "text-(--color-hard)";
  return "text-(--color-info)";
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
                  "mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl text-xl",
                  t.iconSrc ? "bg-(--color-bg) border border-(--color-border)" : accentStyles(t.type),
                ].join(" ")}
              >
                {t.iconSrc ? (
                  <img
                    src={t.iconSrc}
                    alt=""
                    className="h-10 w-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  />
                ) : (
                  iconByType(t.type)
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className={["text-sm font-bold tracking-wide", titleColor(t.type)].join(" ")}>
                  {t.title}
                </div>

                {t.message ? (
                  <div className="mt-1 text-xs leading-relaxed text-(--color-muted)">
                    {t.message}
                  </div>
                ) : null}
              </div>

              <button
                onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
                className="ml-auto rounded-lg border border-(--color-border) bg-(--color-surfaceAlt) px-2 py-1 text-xs font-semibold text-(--color-muted) transition hover:bg-(--color-bg) hover:text-(--color-ink)"
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

