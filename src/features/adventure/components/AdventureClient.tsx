"use client";

function InfoCard({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)">
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) text-xl">
                    {icon}
                </div>

                <div>
                    <h3 className="text-base font-bold text-(--color-ink)">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-(--color-muted)">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function AdventureClient() {
    return (
        <div className="space-y-6">
            <header className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)">
                <h1 className="text-2xl font-bold tracking-wide text-(--color-ink)">
                    🗺️ Modo Aventura
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-(--color-muted)">
                    Esta área está em desenvolvimento e será a parte mais imersiva do{" "}
                    <span className="font-semibold text-(--color-gold)">Adventurer Route</span>.
                </p>
            </header>

            <section className="rounded-2xl border border-(--color-gold)/40 bg-(--color-surface) p-8 text-center shadow-(--shadow-card)">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surfaceAlt) text-4xl shadow-(--shadow-card)">
                    ⚒️
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-wide text-(--color-ink)">
                    Em manutenção
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-(--color-muted)">
                    O Modo Aventura ainda está sendo construído. Em breve, você poderá
                    explorar mapas, enfrentar desafios, evoluir sua jornada e transformar
                    suas tarefas em uma experiência ainda mais gamificada.
                </p>

                <div className="mt-6 inline-flex rounded-xl border border-(--color-gold)/50 bg-(--color-gold)/15 px-4 py-2 text-sm font-semibold text-(--color-gold)">
                    🚧 Funcionalidade em progresso
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <InfoCard
                    icon="🧭"
                    title="Exploração"
                    description="Descubra rotas, áreas e objetivos especiais ligados ao seu progresso."
                />

                <InfoCard
                    icon="⚔️"
                    title="Desafios"
                    description="Complete missões e enfrente eventos para ganhar recompensas extras."
                />

                <InfoCard
                    icon="🏆"
                    title="Progressão"
                    description="Avance na aventura conforme você conclui tarefas e fortalece seu personagem."
                />
            </section>
        </div>
    );
}
