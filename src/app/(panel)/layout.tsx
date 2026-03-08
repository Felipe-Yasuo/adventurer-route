import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PanelProviders from "./providers";
import Sidebar from "@/features/shared/components/Sidebar";

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
        <div className="grid min-h-screen grid-cols-[86px_1fr] lg:grid-cols-[210px_1fr]">
          <aside className="sticky top-0 h-screen">
            <Sidebar />
          </aside>

          <main className="min-w-0 p-3 lg:p-4 xl:p-5">
            {children}
          </main>
        </div>
      </div>
    </PanelProviders>
  );
}