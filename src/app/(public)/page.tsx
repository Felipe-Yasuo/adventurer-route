import Link from "next/link";

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.9)] p-5 shadow-[0_10px_18px_rgba(0,0,0,0.08)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/10 bg-[rgba(255,255,255,0.24)] text-2xl">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold text-[color:var(--color-ink)]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]/68">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[rgba(242,228,198,0.88)] p-5 shadow-[0_8px_14px_rgba(0,0,0,0.08)]">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--color-ink)]/55">
        {step}
      </div>

      <h3 className="mt-3 text-lg font-bold text-[color:var(--color-ink)]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]/68">
        {description}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[rgba(242,228,198,0.35)]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <img
              src="/ui/logo/adventurer-route.png"
              alt="Adventurer Route"
              className="h-24 w-auto object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.2)]"
            />

            <div className="mt-6 inline-flex rounded-full border border-[rgba(212,160,23,0.3)] bg-[rgba(212,160,23,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)]">
              Produtividade gamificada
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-[color:var(--color-ink)] sm:text-5xl">
              Transforme suas tarefas em uma verdadeira jornada.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[color:var(--color-ink)]/72">
              O Adventurer Route transforma sua rotina em um sistema de missões,
              progresso e recompensas. Crie tarefas, complete quests, ganhe XP,
              ouro, itens e evolua enquanto avança no seu dia.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-2xl border border-[rgba(212,160,23,0.4)] bg-[rgba(212,160,23,0.18)] px-6 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-[rgba(212,160,23,0.28)]"
              >
                Começar agora
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.28)] px-6 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-[rgba(255,255,255,0.42)]"
              >
                Entrar
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-[rgba(242,228,198,0.9)] p-6 shadow-[0_20px_34px_rgba(0,0,0,0.12)]">
            <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] p-5">
              <h2 className="text-xl font-bold text-[color:var(--color-ink)]">
                Seu painel de aventura
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] p-4">
                  <div className="text-sm font-semibold text-[color:var(--color-ink)]">
                    ⚔️ Tasks
                  </div>
                  <div className="mt-2 text-xs text-[color:var(--color-ink)]/65">
                    Organize missões do dia e conclua objetivos.
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] p-4">
                  <div className="text-sm font-semibold text-[color:var(--color-ink)]">
                    🧭 Quests
                  </div>
                  <div className="mt-2 text-xs text-[color:var(--color-ink)]/65">
                    Desafios extras para acelerar seu progresso.
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] p-4">
                  <div className="text-sm font-semibold text-[color:var(--color-ink)]">
                    🎒 Inventário
                  </div>
                  <div className="mt-2 text-xs text-[color:var(--color-ink)]/65">
                    Use itens e recupere vida para continuar.
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.22)] p-4">
                  <div className="text-sm font-semibold text-[color:var(--color-ink)]">
                    🏆 Conquistas
                  </div>
                  <div className="mt-2 text-xs text-[color:var(--color-ink)]/65">
                    Desbloqueie marcos importantes da sua jornada.
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[rgba(212,160,23,0.26)] bg-[rgba(212,160,23,0.12)] p-4 text-sm font-medium text-[color:var(--color-ink)]">
                Evolua sua rotina como um aventureiro.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[color:var(--color-ink)]">
            Por que usar o Adventurer Route?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--color-ink)]/68">
            Um sistema pensado para transformar disciplina, constância e foco em
            uma experiência mais divertida e motivadora.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard
            icon="⚔️"
            title="Tarefas como missões"
            description="Sua rotina deixa de ser apenas uma lista e passa a ser parte da sua jornada."
          />
          <FeatureCard
            icon="✨"
            title="XP e progressão"
            description="Ganhe experiência ao concluir tarefas e acompanhe seu crescimento."
          />
          <FeatureCard
            icon="🧭"
            title="Quests diárias e semanais"
            description="Receba objetivos extras para manter constância e foco."
          />
          <FeatureCard
            icon="🧪"
            title="Itens e vida"
            description="Gerencie recursos, recupere vida e mantenha seu aventureiro forte."
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[color:var(--color-ink)]">
            Como funciona
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StepCard
            step="Passo 1"
            title="Crie suas missões"
            description="Adicione tarefas com dificuldade e organize seus objetivos."
          />
          <StepCard
            step="Passo 2"
            title="Complete desafios"
            description="Conclua tarefas para ganhar recompensas e manter sua streak."
          />
          <StepCard
            step="Passo 3"
            title="Ganhe recompensas"
            description="Receba XP, gold, conquistas e progresso extra nas quests."
          />
          <StepCard
            step="Passo 4"
            title="Evolua seu personagem"
            description="Acompanhe seu crescimento e fortaleça sua jornada."
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="rounded-[32px] border border-black/10 bg-[rgba(242,228,198,0.92)] px-8 py-12 text-center shadow-[0_18px_30px_rgba(0,0,0,0.1)]">
          <h2 className="text-3xl font-bold text-[color:var(--color-ink)]">
            Pronto para começar sua aventura?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[color:var(--color-ink)]/68">
            Entre no Adventurer Route e transforme sua produtividade em uma experiência
            gamificada, visual e motivadora.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="rounded-2xl border border-[rgba(212,160,23,0.4)] bg-[rgba(212,160,23,0.18)] px-6 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-[rgba(212,160,23,0.28)]"
            >
              Criar conta
            </Link>

            <Link
              href="/login"
              className="rounded-2xl border border-black/10 bg-[rgba(255,255,255,0.28)] px-6 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-[rgba(255,255,255,0.42)]"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}