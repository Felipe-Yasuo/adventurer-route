"use client";

import { ToastProvider } from "@/features/shared/components/toast";
import { MeProvider } from "@/features/shared/components/me-store";

export default function PanelProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <MeProvider>{children}</MeProvider>
    </ToastProvider>
  );
}