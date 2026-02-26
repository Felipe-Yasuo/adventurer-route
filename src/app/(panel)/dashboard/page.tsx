export default function DashboardPage() {
    return (
        <main className="min-h-screen p-6">
            <h1 className="text-2xl font-bold">Task RPG — Dashboard</h1>

            <section className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border p-4">
                    <h2 className="font-semibold">Status do Jogador</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Level, XP, Vida, Gold vão aparecer aqui.
                    </p>
                </div>

                <div className="rounded-2xl border p-4">
                    <h2 className="font-semibold">Tasks</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Form de criar task + lista vão aparecer aqui.
                    </p>
                </div>
            </section>
        </main>
    );
}