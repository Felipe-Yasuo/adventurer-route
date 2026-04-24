"use client";

import Link from "next/link";
import { DIFFICULTY_META } from "@/features/tasks/utils/difficultyAssets";

function SectionCard({
    title,
    eyebrow,
    iconSrc,
    children,
    tone = "default",
}: {
    title: string;
    eyebrow?: string;
    iconSrc: string;
    children: React.ReactNode;
    tone?: "default" | "danger" | "gold";
}) {
    const toneBorder =
        tone === "danger"
            ? "border-(--color-hard)/40"
            : tone === "gold"
            ? "border-(--color-gold)/40"
            : "border-(--color-border)";

    const toneGlow =
        tone === "danger"
            ? "shadow-[0_0_22px_-10px_rgba(230,60,60,0.55)]"
            : tone === "gold"
            ? "shadow-[0_0_22px_-10px_rgba(212,175,55,0.55)]"
            : "shadow-(--shadow-card)";

    return (
        <section
            className={[
                "relative rounded-2xl border-2 bg-(--color-surface) p-6 transition",
                toneBorder,
                toneGlow,
            ].join(" ")}
        >
            <div className="flex items-start gap-4">
                <div className="shrink-0">
                    <img
                        src={iconSrc}
                        alt=""
                        className="h-16 w-16 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.55)]"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    {eyebrow ? (
                        <div className="flex items-center gap-2 text-(--color-gold)">
                            <span className="text-[10px]" aria-hidden>◆</span>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">
                                {eyebrow}
                            </span>
                        </div>
                    ) : null}
                    <h2 className="mt-1 font-serif text-2xl italic text-(--color-ink)">
                        {title}
                    </h2>
                </div>
            </div>

            <div className="mt-5 text-sm leading-relaxed text-(--color-muted)">
                {children}
            </div>
        </section>
    );
}

function RewardTier({
    tone,
    difficulty,
    xp,
    gold,
}: {
    tone: "easy" | "medium" | "hard";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    xp: number;
    gold: number;
}) {
    const meta = DIFFICULTY_META[difficulty];
    const border =
        tone === "easy"
            ? "border-(--color-easy)/45"
            : tone === "medium"
            ? "border-(--color-medium)/45"
            : "border-(--color-hard)/45";

    const label =
        tone === "easy"
            ? "text-(--color-easy)"
            : tone === "medium"
            ? "text-(--color-medium)"
            : "text-(--color-hard)";

    const bg =
        tone === "easy"
            ? "bg-(--color-easy)/10"
            : tone === "medium"
            ? "bg-(--color-medium)/10"
            : "bg-(--color-hard)/10";

    return (
        <div
            className={[
                "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center",
                border,
                bg,
            ].join(" ")}
        >
            <img
                src={meta.icon}
                alt=""
                className="h-14 w-14 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]"
            />
            <div className={["text-[11px] font-bold uppercase tracking-[0.18em]", label].join(" ")}>
                {meta.label}
            </div>
            <div className="flex flex-col gap-0.5">
                <div className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-(--color-ink)">
                    <span className="text-(--color-gold)">+{xp}</span>
                    <span className="text-(--color-muted)">XP</span>
                </div>
                <div className="inline-flex items-center justify-center gap-1 text-sm font-semibold">
                    <img
                        src="/ui/stats/gold.png"
                        alt=""
                        className="h-4 w-4 object-contain"
                    />
                    <span className="text-(--color-gold)">+{gold}</span>
                    <span className="text-(--color-muted)">gold</span>
                </div>
            </div>
        </div>
    );
}

function PenaltyRow({
    difficulty,
    life,
}: {
    difficulty: "EASY" | "MEDIUM" | "HARD";
    life: number;
}) {
    const meta = DIFFICULTY_META[difficulty];
    return (
        <li className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-bg)/50 px-3 py-2">
            <img src={meta.icon} alt="" className="h-8 w-8 object-contain" />
            <span className="min-w-16 text-sm font-semibold text-(--color-ink)">
                {meta.label}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-(--color-hard)">
                <img src="/ui/stats/vida.png" alt="" className="h-4 w-4 object-contain" />
                −{life} vida
            </span>
        </li>
    );
}

function Bullet({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-2">
            <span className="mt-1 text-(--color-gold)" aria-hidden>◆</span>
            <span>{children}</span>
        </li>
    );
}

export default function RulesClient() {
    return (
        <div className="space-y-6">
            <header className="relative overflow-hidden rounded-2xl border border-(--color-border) bg-linear-to-br from-(--color-surface) via-(--color-surfaceAlt) to-(--color-surface) p-6 shadow-(--shadow-card)">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src="/ui/icons/regras.png"
                            alt=""
                            className="h-16 w-16 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.55)]"
                        />
                        <div>
                            <div className="flex items-center gap-2 text-(--color-gold)">
                                <span className="text-xs" aria-hidden>◆</span>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                                    Códice do Reino
                                </span>
                                <span className="text-xs" aria-hidden>◆</span>
                            </div>
                            <h1 className="mt-1 font-serif text-3xl italic text-(--color-ink)">
                                Leis da jornada.
                            </h1>
                            <p className="mt-1 max-w-xl text-sm text-(--color-muted)">
                                Todo aventureiro deve conhecer o pacto do{" "}
                                <span className="font-semibold text-(--color-gold)">Adventurer Route</span>:
                                recompensas, penitências, contratos e relíquias que guiam sua saga.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <SectionCard
                title="Recompensas por missão"
                eyebrow="Tesouros da Guilda"
                iconSrc="/ui/stats/gold.png"
                tone="gold"
            >
                <p className="mb-4">
                    Cada missão cumprida rende{" "}
                    <span className="font-semibold text-(--color-gold)">experiência</span> e{" "}
                    <span className="font-semibold text-(--color-gold)">ouro</span>, conforme a dificuldade enfrentada.
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <RewardTier tone="easy" difficulty="EASY" xp={10} gold={5} />
                    <RewardTier tone="medium" difficulty="MEDIUM" xp={20} gold={10} />
                    <RewardTier tone="hard" difficulty="HARD" xp={30} gold={15} />
                </div>
            </SectionCard>

            <SectionCard
                title="Penitências"
                eyebrow="O preço da negligência"
                iconSrc="/ui/rules/penalties.png"
                tone="danger"
            >
                <p>
                    <span className="font-semibold text-(--color-hard)">Missões vencidas:</span>{" "}
                    contratos não cumpridos no prazo drenam seu vigor. Quanto maior o desafio abandonado,
                    mais dolorida a ferida.
                </p>

                <ul className="mt-4 space-y-2">
                    <PenaltyRow difficulty="EASY" life={1} />
                    <PenaltyRow difficulty="MEDIUM" life={2} />
                    <PenaltyRow difficulty="HARD" life={3} />
                </ul>

                <p className="mt-4">
                    <span className="font-semibold text-(--color-hard)">Inércia:</span>{" "}
                    dias sem cumprir feito algum também ferem — sua vitalidade cai e o streak se apaga,
                    como brasa que esfriou na taverna.
                </p>
            </SectionCard>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <SectionCard
                    title="Contratos do dia"
                    eyebrow="Quests"
                    iconSrc="/ui/icons/regras.png"
                >
                    <p>
                        O mestre da guilda registra encargos diários e semanais no mural de pedra.
                        Cumpra-os para rendas extras de XP e ouro.
                    </p>

                    <ul className="mt-4 space-y-2">
                        <Bullet>Objetivos específicos — concluir tarefas, manter streaks, subir de nível.</Bullet>
                        <Bullet>Recompensas além do habitual ao resgatar na guilda.</Bullet>
                        <Bullet>Renovam-se no amanhecer — não perca o turno.</Bullet>
                    </ul>
                </SectionCard>

                <SectionCard
                    title="Feitos lendários"
                    eyebrow="Conquistas"
                    iconSrc="/ui/icons/conquistas.png"
                >
                    <p>
                        Marcas eternas gravadas em seu brasão quando grandes feitos são alcançados.
                    </p>

                    <ul className="mt-4 space-y-2">
                        <Bullet>Concluir centenas de missões.</Bullet>
                        <Bullet>Manter streaks longos sem falhar.</Bullet>
                        <Bullet>Atingir patamares de nível que poucos ousam.</Bullet>
                    </ul>
                </SectionCard>
            </div>

            <SectionCard
                title="Relíquias e poções"
                eyebrow="Itens"
                iconSrc="/ui/rules/item.png"
            >
                <p>
                    Frascos alquímicos restauram seu vigor entre as batalhas — adquiridos no{" "}
                    <Link
                        href="/dashboard/shop"
                        className="font-semibold text-(--color-gold) underline decoration-(--color-gold)/40 decoration-dotted underline-offset-4 hover:decoration-(--color-gold)"
                    >
                        Mercado da Guilda
                    </Link>{" "}
                    com o ouro conquistado em suas jornadas.
                </p>

                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <li className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-bg)/50 px-3 py-2 text-sm">
                        <img src="/ui/shop/small-potion.png" alt="" className="h-8 w-8 object-contain" />
                        <span className="text-(--color-ink)">
                            <span className="font-serif italic text-(--color-gold)">Pequena</span>
                            <span className="ml-1 text-(--color-muted)">+3 vida</span>
                        </span>
                    </li>
                    <li className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-bg)/50 px-3 py-2 text-sm">
                        <img src="/ui/shop/medium-potion.png" alt="" className="h-8 w-8 object-contain" />
                        <span className="text-(--color-ink)">
                            <span className="font-serif italic text-(--color-gold)">Média</span>
                            <span className="ml-1 text-(--color-muted)">+6 vida</span>
                        </span>
                    </li>
                    <li className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-bg)/50 px-3 py-2 text-sm">
                        <img src="/ui/shop/large-potion.png" alt="" className="h-8 w-8 object-contain" />
                        <span className="text-(--color-ink)">
                            <span className="font-serif italic text-(--color-gold)">Grande</span>
                            <span className="ml-1 text-(--color-muted)">+10 vida</span>
                        </span>
                    </li>
                </ul>
            </SectionCard>

            <footer className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-surfaceAlt)/40 p-5 text-center">
                <p className="font-serif text-sm italic text-(--color-ink)/75">
                    “Que o códice lhe guie. A jornada é longa — e quem zela pelas regras, zela por si.”
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-(--color-muted)">
                    — Mestre da Guilda
                </p>
            </footer>
        </div>
    );
}
