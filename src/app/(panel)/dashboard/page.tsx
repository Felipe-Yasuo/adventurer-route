import Sidebar from "./_components/Sidebar";
import DashboardClient from "./_components/DashboardClient";
import NewTaskCard from "./_components/NewTaskCard";
import FiltersCard from "./_components/FiltersCard";
import DailyGoalCard from "./_components/DailyGoalCard";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-twilight">
            <div className="flex">
                <Sidebar />

                <main className="flex-1">
                    <div className="px-6 pb-10 pt-6">
                        <div className="grid grid-cols-12 gap-6">
                            <aside className="col-span-12 lg:col-span-3 space-y-6">
                                <NewTaskCard />
                                <FiltersCard />
                                <DailyGoalCard />
                            </aside>

                            <section className="col-span-12 lg:col-span-9">
                                <DashboardClient />
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}