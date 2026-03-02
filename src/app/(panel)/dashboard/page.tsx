import Sidebar from "./_components/Sidebar";
import DashboardClient from "./_components/DashboardClient";

export default function DashboardPage() {
    return (
        <div className="h-screen bg-twilight">
            <div className="flex h-full">
                <Sidebar />

                <main className="flex-1 h-full ">
                    <div className="h-full px-6 pt-6 ">
                        <DashboardClient />
                    </div>
                </main>
            </div>
        </div>
    );
}