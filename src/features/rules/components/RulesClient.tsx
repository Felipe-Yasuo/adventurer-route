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
        <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) text-xl">
                    {icon}
                </div>

                <h2 className="text-lg font-bold tracking-wide text-(--color-ink)">
                    {title}
                </h2>
            </div>

            <div className="mt-4 text-sm leading-relaxed text-(--color-muted)">
                {children}
            </div>
        </section>
    );
}

function RewardBox({
    label,
    xp,
    gold,
    tone,
}: {
    label: string;
    xp: string;
    gold: string;
    tone: "easy" | "medium" | "hard";
}) {
    const border =
        tone === "easy"
            ? "border-(--color-easy)/40"
            : tone === "medium"
                ? "border-(--color-medium)/40"
                : "border-(--color-hard)/40";

    const labelColor =
        tone === "easy"
            ? "text-(--color-easy)"
            : tone === "medium"
                ? "text-(--color-medium)"
                : "text-(--color-hard)";

    return (
        <div className={["rounded-2xl border bg-(--color-surfaceAlt) p-4", border].join(" ")}>
            <div className={["text-xs font-semibold uppercase tracking-wider", labelColor].join(" ")}>
                {label}
            </div>
            <div className="mt-2 text-sm font-semibold text-(--color-ink)">
                {xp}
            </div>
            <div className="mt-1 text-sm font-semibold text-(--color-gold)">
                {gold}
            </div>
        </div>
    );
}

export default function RulesClient() {
    return (
        <div className="space-y-6">
            <header className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)">
                <h1 className="text-2xl font-bold tracking-wide text-(--color-ink)">
                    📜 Regras do Jogo
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-(--color-muted)">
                    Entenda como funciona o sistema de progresso do{" "}
                    <span className="font-semibold text-(--color-gold)">Adventurer Route</span>,
                    incluindo recompensas, penalidades, quests, conquistas e itens.
                </p>
            </header>

            <RuleCard title="Recompensas por tarefa" icon="⚔️">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <RewardBox label="Easy" xp="+10 XP" gold="+5 GOLD" tone="easy" />
                    <RewardBox label="Medium" xp="+20 XP" gold="+10 GOLD" tone="medium" />
                    <RewardBox label="Hard" xp="+30 XP" gold="+15 GOLD" tone="hard" />
                </div>
            </RuleCard>

            <RuleCard title="Penalidades" icon="💀">
                <div className="space-y-3">
                    <p>
                        <span className="font-semibold text-(--color-hard)">
                            Overdue:
                        </span>{" "}
                        tarefas que passam da data limite causam perda de vida.
                    </p>

                    <div className="rounded-2xl border border-(--color-border) bg-(--color-surfaceAlt) p-4">
                        <ul className="space-y-2">
                            <li>
                                <span className="font-semibold text-(--color-easy)">Easy</span> → -1 vida
                            </li>
                            <li>
                                <span className="font-semibold text-(--color-medium)">Medium</span> → -2 vida
                            </li>
                            <li>
                                <span className="font-semibold text-(--color-hard)">Hard</span> → -3 vida
                            </li>
                        </ul>
                    </div>

                    <p>
                        <span className="font-semibold text-(--color-hard)">
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

                <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-surfaceAlt) p-4">
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

                <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-surfaceAlt) p-4">
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

                <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-surfaceAlt) p-4">
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
