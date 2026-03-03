import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import PanelProviders from "./providers";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  return <PanelProviders>{children}</PanelProviders>;
}