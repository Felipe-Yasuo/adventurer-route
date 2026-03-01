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
    "rounded-2xl border border-white/10 bg-black/30 backdrop-blur shadow-lg p-4 text-cloudWhite";
  if (type === "success") return base;
  if (type === "warning") return base;
  if (type === "error") return base;
  return base;
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

      <div className="fixed right-4 top-4 z-50 w-[340px] space-y-3">
        {toasts.map((t) => (
          <div key={t.id} className={typeStyles(t.type)}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-lg">{iconByType(t.type)}</div>

              <div className="min-w-0">
                <div className="text-sm font-semibold">{t.title}</div>
                {t.message ? (
                  <div className="mt-1 text-xs text-white/70">{t.message}</div>
                ) : null}
              </div>

              <button
                onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
                className="ml-auto rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
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