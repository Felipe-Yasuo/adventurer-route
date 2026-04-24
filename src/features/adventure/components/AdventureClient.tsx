"use client";

function PreviewCard({
    iconSrc,
    eyebrow,
    title,
    description,
    tone = "default",
}: {
    iconSrc: string;
    eyebrow: string;
    title: string;
    description: string;
    tone?: "default" | "gold" | "danger" | "easy";
}) {
    const border =
        tone === "gold"
            ? "border-(--color-gold)/45"
            : tone === "danger"
            ? "border-(--color-hard)/45"
            : tone === "easy"
            ? "border-(--color-easy)/45"
            : "border-(--color-border)";

    const glow =
        tone === "gold"
            ? "shadow-[0_0_22px_-8px_rgba(212,175,55,0.55)]"
            : tone === "danger"
            ? "shadow-[0_0_22px_-8px_rgba(230,60,60,0.55)]"
            : tone === "easy"
            ? "shadow-[0_0_22px_-8px_rgba(34,197,94,0.5)]"
            : "shadow-(--shadow-card)";

    const eyebrowColor =
        tone === "gold"
            ? "text-(--color-gold)"
            : tone === "danger"
            ? "text-(--color-hard)"
            : tone === "easy"
            ? "text-(--color-easy)"
            : "text-(--color-muted)";

    return (
        <section
            className={[
                "group relative flex flex-col items-center overflow-hidden rounded-2xl border-2 bg-(--color-surface) p-6 text-center transition hover:-translate-y-1",
                border,
                glow,
            ].join(" ")}
        >
            <div className="relative flex h-32 w-32 items-center justify-center">
                <div
                    aria-hidden
                    className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-(--color-gold)/10 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100"
                />
                <img
                    src={iconSrc}
                    alt=""
                    className="relative h-28 w-28 object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.55)] transition duration-300 group-hover:scale-105 group-hover:-translate-y-1"
                />
            </div>

            <div className={["mt-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em]", eyebrowColor].join(" ")}>
                <span aria-hidden>◆</span>
                {eyebrow}
            </div>

            <h3 className="mt-1 font-serif text-xl italic text-(--color-ink)">
                {title}
            </h3>

            <p className="mt-2 max-w-xs text-xs leading-relaxed text-(--color-muted)">
                {description}
            </p>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-(--color-gold)/40 bg-(--color-gold)/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-(--color-gold)">
                <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-(--color-gold)"
                />
                Em breve
            </span>
        </section>
    );
}

export default function AdventureClient() {
    return (
        <div className="space-y-6">
            <header className="relative overflow-hidden rounded-2xl border border-(--color-border) bg-linear-to-br from-(--color-surface) via-(--color-surfaceAlt) to-(--color-surface) p-6 shadow-(--shadow-card)">
                <div className="flex items-center gap-4">
                    <img
                        src="/ui/icons/adventure.png"
                        alt=""
                        className="h-16 w-16 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.55)]"
                    />
                    <div>
                        <div className="flex items-center gap-2 text-(--color-gold)">
                            <span className="text-xs" aria-hidden>◆</span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                                Salão do Cartógrafo
                            </span>
                            <span className="text-xs" aria-hidden>◆</span>
                        </div>
                        <h1 className="mt-1 font-serif text-3xl italic text-(--color-ink)">
                            Modo Aventura.
                        </h1>
                        <p className="mt-1 max-w-xl text-sm text-(--color-muted)">
                            A terra mais selvagem do Adventurer Route — onde missões viram expedições e cada passo rende tesouro.
                        </p>
                    </div>
                </div>
            </header>

            <section className="relative overflow-hidden rounded-2xl border-2 border-(--color-gold)/40 bg-linear-to-br from-(--color-surface) via-(--color-surfaceAlt) to-(--color-surface) p-8 shadow-[0_0_28px_-10px_rgba(212,175,55,0.55)]">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-(--color-gold)/10 blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
                />

                <div className="relative flex flex-col items-center gap-5 text-center">
                    <div className="relative flex h-40 w-40 items-center justify-center">
                        <div
                            aria-hidden
                            className="absolute inset-0 m-auto h-32 w-32 rounded-full bg-(--color-gold)/15 blur-2xl"
                        />
                        <img
                            src="/ui/adventure/maintance.png"
                            alt=""
                            className="relative h-36 w-36 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-(--color-gold)">
                        <span className="text-xs" aria-hidden>◆</span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">
                            Portas seladas temporariamente
                        </span>
                        <span className="text-xs" aria-hidden>◆</span>
                    </div>

                    <h2 className="font-serif text-3xl italic text-(--color-ink)">
                        O ferreiro ainda martela os mapas.
                    </h2>

                    <p className="max-w-2xl text-sm leading-relaxed text-(--color-muted)">
                        Os cartógrafos da guilda estão desenrolando pergaminhos antigos, traçando rotas e afiando espadas.
                        Quando a última engrenagem girar no lugar, você poderá embarcar em expedições, enfrentar chefes e
                        desenterrar tesouros que nenhum contrato simples ofereceria.
                    </p>

                    <div className="inline-flex items-center gap-2 rounded-xl border-2 border-(--color-gold)/50 bg-(--color-gold)/10 px-5 py-2.5 text-sm font-bold tracking-wide text-(--color-gold) shadow-[0_0_14px_-4px_rgba(212,175,55,0.55)]">
                        <span
                            aria-hidden
                            className="inline-block h-2 w-2 animate-pulse rounded-full bg-(--color-gold)"
                        />
                        Funcionalidade em forja
                    </div>
                </div>
            </section>

            <div className="flex items-center gap-3 px-2">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-(--color-gold)/40 to-transparent" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-(--color-gold)">
                    ◆ Vislumbre do que vem aí ◆
                </span>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-(--color-gold)/40 to-transparent" />
            </div>

            <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <PreviewCard
                    iconSrc="/ui/adventure/exploration.png"
                    eyebrow="Exploração"
                    title="Terras inexploradas"
                    description="Desenrole mapas, descubra rotas secretas e objetivos especiais ligados ao seu progresso."
                    tone="gold"
                />

                <PreviewCard
                    iconSrc="/ui/adventure/challenge.png"
                    eyebrow="Desafios"
                    title="Honra em combate"
                    description="Enfrente chefes sazonais, eventos de guilda e provas que testam sua constância — recompensas à altura."
                    tone="danger"
                />

                <PreviewCard
                    iconSrc="/ui/adventure/progression.png"
                    eyebrow="Progressão"
                    title="A estrada dourada"
                    description="Avance por capítulos da aventura conforme cumpre contratos — cada etapa fortalece seu herói."
                    tone="easy"
                />
            </section>

            <footer className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-surfaceAlt)/40 p-5 text-center">
                <p className="font-serif text-sm italic text-(--color-ink)/75">
                    “Aguarde o próximo amanhecer. O portão se abre quando o pergaminho estiver pronto.”
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-(--color-muted)">
                    — Conselho de Cartógrafos
                </p>
            </footer>
        </div>
    );
}
