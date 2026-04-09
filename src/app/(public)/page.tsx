import Link from "next/link";

/* ── Navbar ── */
function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-[var(--color-parchment)]/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo + links */}
        <div className="flex items-center gap-8">
          <span className="font-[family-name:var(--font-serif)] text-lg font-bold italic text-[var(--color-ink)]">
            Adventurer Route
          </span>

          <div className="hidden items-center gap-6 text-sm font-medium text-[var(--color-ink)]/80 md:flex">
            <Link href="#journey" className="underline underline-offset-4 decoration-[var(--color-gold)]">
              The Journey
            </Link>
            <Link href="#features" className="hover:text-[var(--color-ink)] transition">
              Logbook
            </Link>
            <Link href="#how" className="hover:text-[var(--color-ink)] transition">
              Ranks
            </Link>
            <Link href="#cta" className="hover:text-[var(--color-ink)] transition">
              Compendium
            </Link>
          </div>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-[var(--color-ink)]/80 hover:text-[var(--color-ink)] transition"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-[var(--color-goldDark)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Begin Quest
          </Link>
        </div>
      </div>
    </nav>
  );
}


/* ── Feature card ── */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl bg-[var(--color-parchment)]/70 p-6 transition hover:bg-[var(--color-parchment)]/90">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-parchmentSoft)]/80">
        {icon}
      </div>
      <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-[var(--color-ink)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]/60">
        {description}
      </p>
    </div>
  );
}

/* ── Step card ── */
function StepCard({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-3xl bg-white/5 p-6">
      {/* Big watermark number */}
      <span className="absolute -top-2 left-4 font-[family-name:var(--font-serif)] text-7xl font-bold text-[var(--color-gold)]/15 select-none">
        {number}
      </span>
      <div className="relative">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-parchment)]/40">
          {label}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-serif)] text-lg font-bold text-[var(--color-parchment)]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-parchment)]/60">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ─── HERO ─── */}
      <section id="journey" className="relative min-h-screen overflow-hidden">
        {/* Background landscape */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/ui/frames/background-landscape.jpg')" }}
        />
        {/* Lighten overlay so text stands out */}
        <div className="absolute inset-0 bg-white/40" />
        {/* Gradient fade to parchment */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-parchment)]" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-end px-6 pb-24 pt-32 lg:flex-row lg:items-end lg:justify-between lg:pb-32">
          {/* Left: text */}
          <div className="max-w-xl">
            <h1 className="font-[family-name:var(--font-serif)] text-5xl font-bold leading-[1.08] text-[var(--color-ink)] sm:text-6xl">
              Transforme suas tarefas em uma{" "}
              <em className="italic">verdadeira jornada.</em>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-[var(--color-ink)]/70">
              Abandone as listas de afazeres monotonos. Evolua seu heroi,
              conquiste territorios e transforme habitos diarios em vitorias
              epicas no RPG da sua propria vida.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-full bg-[var(--color-goldDark)] px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Comecar agora
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-[var(--color-ink)]/20 bg-white/60 px-7 py-3 text-sm font-semibold text-[var(--color-ink)] backdrop-blur-sm transition hover:bg-white/80"
              >
                Entrar
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="bg-[var(--color-parchment)] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-[family-name:var(--font-serif)] text-3xl font-bold text-[var(--color-ink)] sm:text-4xl">
            Por que usar o Adventurer Route?
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-[var(--color-goldDark)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              }
              title="Tarefas como Missoes"
              description="Cada checklist vira um contrato de mercenario. Derrote seus prazos como se fossem dragoes."
            />
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-[var(--color-goldDark)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
              }
              title="Progressao Real"
              description="Ganhe XP por foco e consistencia. Veja seus atributos de Forca e Sabedoria subirem com sua vida real."
            />
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-[var(--color-goldDark)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              }
              title="Daily & Weekly"
              description="Desafios ciclicos que recompensam a lealdade a sua propria rotina. Recompensas bonus por streaks."
            />
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-[var(--color-danger)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              }
              title="Itens & Vida"
              description="Gerencie sua energia. Falhar em missoes custa HP! Completar garante ouro para comprar itens lendarios."
            />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="bg-[var(--color-ink)] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-parchment)]/50">
            O Caminho do Heroi
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-serif)] text-3xl font-bold italic text-[var(--color-parchment)] sm:text-4xl">
            Como funciona sua ascensao
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <StepCard
              number="01"
              label="Setup Inicial"
              title="Crie suas missoes"
              description="Cadastre suas tarefas diarias, estudos ou projetos como contratos de guilda."
            />
            <StepCard
              number="02"
              label="Acao em Tempo Real"
              title="Venca desafios"
              description="Execute suas tarefas e marque como concluidas para derrotar os monstros do dia."
            />
            <StepCard
              number="03"
              label="Loot System"
              title="Ganhe recompensas"
              description="Acumule moedas de ouro, encontre tesouros raros e ganhe XP por sua disciplina."
            />
            <StepCard
              number="04"
              label="Level Up"
              title="Evolua seu ser"
              description="Veja seu avatar crescer de um simples aldeao para um heroi lendario de alto nivel."
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="cta" className="bg-[var(--color-parchment)] px-6 pb-24 pt-8">
        <div className="mx-auto max-w-4xl rounded-[40px] bg-[var(--color-parchmentSoft)] px-8 py-16 text-center shadow-[0_20px_50px_rgba(43,36,27,0.08)]">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold italic text-[var(--color-ink)] sm:text-4xl">
            Pronto para escrever sua propria lenda?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--color-ink)]/60">
            Milhares de aventureiros ja estao transformando sua procrastinacao
            em poder. Junte-se a Guilda hoje mesmo.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="rounded-full bg-[var(--color-goldDark)] px-8 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Criar conta
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[var(--color-ink)]/20 bg-white/50 px-8 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white/70"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[var(--color-ink)] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="font-[family-name:var(--font-serif)] text-sm font-bold italic text-[var(--color-parchment)]/80">
              Adventurer Route
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[var(--color-parchment)]/35">
              &copy; 1234 The Chronicler&apos;s Guild. All deeds recorded.
            </p>
          </div>

          <div className="flex gap-6 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-parchment)]/50">
            <Link href="#" className="hover:text-[var(--color-parchment)]/80 transition">
              The Oath
            </Link>
            <Link href="#" className="hover:text-[var(--color-parchment)]/80 transition">
              Privacy Scroll
            </Link>
            <Link href="#" className="hover:text-[var(--color-parchment)]/80 transition">
              Support
            </Link>
            <Link href="#" className="hover:text-[var(--color-parchment)]/80 transition">
              Guild Hall
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
