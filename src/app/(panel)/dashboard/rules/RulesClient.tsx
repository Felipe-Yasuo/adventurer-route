"use client";

function RuleCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.92)] p-5 shadow-[0_10px_18px_rgba(0,0,0,0.12)]">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-[rgba(255,255,255,0.28)] text-xl shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
                    {icon}
                </div>

                <h2 className="text-lg font-bold tracking-wide text-[color:var(--color-ink)]">
                    {title}
                </h2>
            </div>

            <div className="mt-4 text-sm leading-relaxed text-[color:var(--color-ink)]/75">
                {children}
            </div>
        </section>
    );
}

function RewardBox({
    label,
    xp,
    gold,
}: {
    label: string;
    xp: string;
    gold: string;
}) {
    return (
        <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.26)] p-4 shadow-[0_4px_8px_rgba(0,0,0,0.06)]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-ink)]/60">
                {label}
            </div>
            <div className="mt-2 text-sm font-semibold text-[color:var(--color-ink)]">
                {xp}
            </div>
            <div className="mt-1 text-sm font-semibold text-[color:var(--color-ink)]">
                {gold}
            </div>
        </div>
    );
}

export default function RulesClient() {
    return (
        <div className="space-y-6">
            <header className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.9)] p-6 shadow-[0_10px_18px_rgba(0,0,0,0.1)]">
                <h1 className="text-2xl font-bold tracking-wide text-[color:var(--color-ink)]">
                    📜 Regras do Jogo
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--color-ink)]/70">
                    Entenda como funciona o sistema de progresso do <span className="font-semibold">Adventurer Route</span>,
                    incluindo recompensas, penalidades, quests, conquistas e itens.
                </p>
            </header>

            <RuleCard title="Recompensas por tarefa" icon="⚔️">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <RewardBox label="Easy" xp="+10 XP" gold="+5 GOLD" />
                    <RewardBox label="Medium" xp="+20 XP" gold="+10 GOLD" />
                    <RewardBox label="Hard" xp="+30 XP" gold="+15 GOLD" />
                </div>
            </RuleCard>

            <RuleCard title="Penalidades" icon="💀">
                <div className="space-y-3">
                    <p>
                        <span className="font-semibold text-[color:var(--color-ink)]">
                            Overdue:
                        </span>{" "}
                        tarefas que passam da data limite causam perda de vida.
                    </p>

                    <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] p-4">
                        <ul className="space-y-2">
                            <li>
                                <span className="font-semibold">Easy</span> → -1 vida
                            </li>
                            <li>
                                <span className="font-semibold">Medium</span> → -2 vida
                            </li>
                            <li>
                                <span className="font-semibold">Hard</span> → -3 vida
                            </li>
                        </ul>
                    </div>

                    <p>
                        <span className="font-semibold text-[color:var(--color-ink)]">
                            Inatividade:
                        </span>{" "}
                        se você passar dias sem completar tarefas, perde vida e o streak é resetado.
                    </p>
                </div>
            </RuleCard>

            <RuleCard title="Quests" icon="🧭">
                <p>
                    Quests são desafios adicionais que aparecem diariamente e semanalmente.
                </p>

                <div className="mt-4 rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] p-4">
                    <ul className="space-y-2">
                        <li>• Complete objetivos específicos</li>
                        <li>• Ganhe recompensas extras</li>
                        <li>• Ajuda a subir de nível mais rápido</li>
                    </ul>
                </div>
            </RuleCard>

            <RuleCard title="Achievements" icon="🏆">
                <p>
                    Achievements são conquistas permanentes desbloqueadas ao atingir marcos
                    importantes no jogo.
                </p>

                <div className="mt-4 rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] p-4">
                    <ul className="space-y-2">
                        <li>• Completar muitas tarefas</li>
                        <li>• Manter streaks</li>
                        <li>• Alcançar certos níveis</li>
                    </ul>
                </div>
            </RuleCard>

            <RuleCard title="Itens" icon="🧪">
                <p>
                    Itens podem ser comprados na loja usando GOLD.
                </p>

                <div className="mt-4 rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] p-4">
                    <ul className="space-y-2">
                        <li>• Itens restauram vida</li>
                        <li>• Podem ser usados no inventário</li>
                        <li>• Ajudam a sobreviver a penalidades</li>
                    </ul>
                </div>
            </RuleCard>
        </div>
    );
}