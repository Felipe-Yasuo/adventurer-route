import PanelProviders from "./providers";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <PanelProviders>{children}</PanelProviders>;
}