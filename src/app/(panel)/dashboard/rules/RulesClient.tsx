"use client";

import GlassCard from "@/app/(panel)/dashboard/_components/GlassCard";

export default function RulesClient() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-xl font-semibold text-cloudWhite">📜 Regras do Jogo</h1>
                <p className="mt-1 text-sm text-white/60">
                    Entenda como funciona o sistema de progresso do Adventurer Route.
                </p>
            </header>


            <GlassCard>
                <h2 className="text-sm font-semibold text-cloudWhite">⚔️ Recompensas por tarefa</h2>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <div className="text-xs text-white/60">EASY</div>
                        <div className="mt-1 text-sm text-cloudWhite">+10 XP</div>
                        <div className="text-sm text-cloudWhite">+5 GOLD</div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <div className="text-xs text-white/60">MEDIUM</div>
                        <div className="mt-1 text-sm text-cloudWhite">+20 XP</div>
                        <div className="text-sm text-cloudWhite">+10 GOLD</div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <div className="text-xs text-white/60">HARD</div>
                        <div className="mt-1 text-sm text-cloudWhite">+30 XP</div>
                        <div className="text-sm text-cloudWhite">+15 GOLD</div>
                    </div>
                </div>
            </GlassCard>


            <GlassCard>
                <h2 className="text-sm font-semibold text-cloudWhite">💀 Penalidades</h2>

                <div className="mt-4 space-y-3 text-sm text-white/70">
                    <p>
                        <span className="text-cloudWhite font-semibold">Overdue:</span>{" "}
                        tarefas que passam da data limite causam perda de vida.
                    </p>

                    <ul className="list-disc pl-5 space-y-1">
                        <li>EASY → -1 vida</li>
                        <li>MEDIUM → -2 vida</li>
                        <li>HARD → -3 vida</li>
                    </ul>

                    <p>
                        <span className="text-cloudWhite font-semibold">Inatividade:</span>{" "}
                        se você passar dias sem completar tarefas, perde vida e o streak é resetado.
                    </p>
                </div>
            </GlassCard>

            <GlassCard>
                <h2 className="text-sm font-semibold text-cloudWhite">🧭 Quests</h2>

                <p className="mt-3 text-sm text-white/70">
                    Quests são desafios adicionais que aparecem diariamente e semanalmente.
                </p>

                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-white/70">
                    <li>Complete objetivos específicos</li>
                    <li>Ganhe recompensas extras</li>
                    <li>Ajuda a subir de nível mais rápido</li>
                </ul>
            </GlassCard>


            <GlassCard>
                <h2 className="text-sm font-semibold text-cloudWhite">🏆 Achievements</h2>

                <p className="mt-3 text-sm text-white/70">
                    Achievements são conquistas permanentes desbloqueadas ao atingir marcos
                    importantes no jogo.
                </p>

                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-white/70">
                    <li>Completar muitas tarefas</li>
                    <li>Manter streaks</li>
                    <li>Alcançar certos níveis</li>
                </ul>
            </GlassCard>


            <GlassCard>
                <h2 className="text-sm font-semibold text-cloudWhite">🧪 Itens</h2>

                <p className="mt-3 text-sm text-white/70">
                    Itens podem ser comprados na loja usando GOLD.
                </p>

                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-white/70">
                    <li>Itens restauram vida</li>
                    <li>Podem ser usados no inventário</li>
                    <li>Ajudam a sobreviver a penalidades</li>
                </ul>
            </GlassCard>
        </div>
    );
}