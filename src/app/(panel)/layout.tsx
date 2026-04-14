import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import PanelProviders from "./providers";
import PanelShell from "@/features/shared/components/PanelShell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <PanelProviders>
      <PanelShell>{children}</PanelShell>
    </PanelProviders>
  );
}
