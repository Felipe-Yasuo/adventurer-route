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
        <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] p-5 shadow-[0_6px_10px_rgba(0,0,0,0.06)]">
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-[rgba(255,255,255,0.28)] text-xl">
                    {icon}
                </div>

                <div>
                    <h3 className="text-base font-bold text-[color:var(--color-ink)]">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-ink)]/68">
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
            <header className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-6 shadow-[0_10px_18px_rgba(0,0,0,0.1)]">
                <h1 className="text-2xl font-bold tracking-wide text-[color:var(--color-ink)]">
                    🗺️ Modo Aventura
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--color-ink)]/70">
                    Esta área está em desenvolvimento e será a parte mais imersiva do{" "}
                    <span className="font-semibold">Adventurer Route</span>.
                </p>
            </header>

            <section className="rounded-2xl border border-[rgba(212,160,23,0.35)] bg-[rgba(242,228,198,0.94)] p-8 text-center shadow-[0_12px_22px_rgba(0,0,0,0.12)]">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-black/10 bg-[rgba(255,255,255,0.24)] text-4xl shadow-[0_8px_14px_rgba(0,0,0,0.08)]">
                    ⚒️
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-wide text-[color:var(--color-ink)]">
                    Em manutenção
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--color-ink)]/70">
                    O Modo Aventura ainda está sendo construído. Em breve, você poderá
                    explorar mapas, enfrentar desafios, evoluir sua jornada e transformar
                    suas tarefas em uma experiência ainda mais gamificada.
                </p>

                <div className="mt-6 inline-flex rounded-xl border border-black/10 bg-[rgba(255,255,255,0.26)] px-4 py-2 text-sm font-semibold text-[color:var(--color-ink)]/80">
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