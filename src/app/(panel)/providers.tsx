"use client";

import { ToastProvider } from "./dashboard/_components/toast";
import { MeProvider } from "./dashboard/_components/me-store";

export default function PanelProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <MeProvider>{children}</MeProvider>
    </ToastProvider>
  );
}