"use client";

import { ToastProvider } from "./dashboard/_components/toast";

export default function PanelProviders({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}