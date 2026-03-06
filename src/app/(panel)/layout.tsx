import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PanelProviders from "./providers";
import Sidebar from "@/app/(panel)/dashboard/_components/Sidebar";

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
      <div className="min-h-screen">
        {/* mobile topbar */}
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-black/10 bg-[rgba(242,228,198,0.96)] px-4 py-3 md:hidden">
          <span className="text-sm font-bold text-[color:var(--color-ink)]">
            Adventurer Route
          </span>
        </div>

        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[92px_1fr] xl:grid-cols-[260px_1fr]">
          {/* sidebar desktop/tablet */}
          <aside className="hidden md:block md:sticky md:top-0 md:h-screen md:border-r md:border-black/10 md:bg-[rgba(0,0,0,0.03)]">
            <Sidebar />
          </aside>

          <main className="p-3 sm:p-4 md:p-6">{children}</main>
        </div>
      </div>
    </PanelProviders>
  );
}