import Sidebar from "./components/Sidebar";
import TopHud from "./components/TopHud";
import KanbanBoard from "./components/KanbanBoard";
import NewTaskCard from "./components/NewTaskCard";
import FiltersCard from "./components/FiltersCard";
import DailyGoalCard from "./components/DailyGoalCard";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-twilight">
            <div className="flex">
                <Sidebar />

                <main className="flex-1">
                    <div className="px-6 pt-4">
                        <TopHud />
                    </div>

                    <div className="px-6 pb-10 pt-6">
                        <div className="grid grid-cols-12 gap-6">
                            <aside className="col-span-12 lg:col-span-3 space-y-6">
                                <NewTaskCard />
                                <FiltersCard />
                                <DailyGoalCard />
                            </aside>

                            <section className="col-span-12 lg:col-span-9">
                                <KanbanBoard />
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}