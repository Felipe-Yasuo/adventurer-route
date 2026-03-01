import Sidebar from "./_components/Sidebar";
import DashboardClient from "./_components/DashboardClient";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-twilight">
            <div className="flex">
                <Sidebar />

                <main className="flex-1 px-6 pb-10 pt-6">
                    <DashboardClient />
                </main>
            </div>
        </div>
    );
}