import Link from "next/link";
import { CornerBracket, Diamond } from "./ornaments";

export default function HeroSection() {
  return (
    <section id="prologue" className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-[center_30%] bg-no-repeat"
        style={{ backgroundImage: "url('/ui/frames/background-landscape.jpg')" }}
      />
      <div className="absolute inset-0 bg-[#100f0d]/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#100f0d]/90 via-[#100f0d]/30 to-[#100f0d]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('/ui/background/background-texture.png')] bg-repeat" />

      <CornerBracket className="absolute left-6 top-24 h-10 w-10 text-[var(--color-gold)]/60" />
      <CornerBracket
        flip
        className="absolute bottom-8 right-6 h-10 w-10 text-[var(--color-gold)]/60"
      />

      <div className="relative z-10 mx-auto grid min-h-[92vh] max-w-7xl grid-cols-12 gap-x-6 px-6 pb-24 pt-40">
        <aside className="col-span-12 mb-10 flex items-start gap-4 md:col-span-2 md:mb-0 md:flex-col md:gap-6">
          <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-3">
            <span className="font-[family-name:var(--font-serif)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--color-gold)]/70">
              Cap. I
            </span>
            <span className="h-px w-16 bg-[var(--color-gold)]/40 md:h-16 md:w-px" />
          </div>
          <p className="max-w-[140px] font-[family-name:var(--font-serif)] text-[11px] italic leading-[1.55] text-[var(--color-parchment)]/40">
            &ldquo;E assim começa o diário de quem aceita a jornada.&rdquo;
          </p>
        </aside>

        <div className="col-span-12 md:col-span-10">
          <div className="mb-6 inline-flex items-center gap-3 border border-[var(--color-gold)]/30 bg-[#100f0d]/60 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-gold)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--color-gold)]">
              MMXXVI · Edição do Cronista
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-serif)] text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.92] tracking-tight text-[var(--color-parchment)]">
            Toda rotina
            <br />
            é uma{" "}
            <em className="relative inline-block italic text-[var(--color-gold)]">
              jornada
              <svg
                viewBox="0 0 300 20"
                className="absolute -bottom-2 left-0 h-3 w-full text-[var(--color-gold)]/60"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.2}
                preserveAspectRatio="none"
              >
                <path d="M2 14 Q 75 4 150 12 T 298 8" />
              </svg>
            </em>
            <br />
            à espera de um
            <br />
            <span className="text-[var(--color-parchmentSoft)]">herói.</span>
          </h1>

          <div className="mt-10 grid max-w-4xl grid-cols-12 gap-6">
            <p className="col-span-12 text-[15px] leading-[1.8] text-[var(--color-parchment)]/65 md:col-span-7">
              Abandone as listas frias. No{" "}
              <em className="italic text-[var(--color-parchment)]">
                Adventurer Route
              </em>
              , cada tarefa cumprida é ouro no cofre, cada hábito um degrau na
              torre — e cada dia perdido, uma ferida que o tempo cobra. Este
              não é um app; é o pergaminho onde você escreve sua própria
              lenda.
            </p>

            <div className="col-span-12 flex flex-col gap-3 md:col-span-5 md:items-end md:justify-end">
              <Link
                href="/login"
                className="group inline-flex items-center justify-between gap-4 border border-[var(--color-gold)] bg-[var(--color-gold)] px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.3em] text-[#100f0d] transition hover:bg-transparent hover:text-[var(--color-gold)]"
              >
                <span>Começar a Jornada</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="#codex"
                className="inline-flex items-center justify-between gap-4 border border-[var(--color-parchment)]/15 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.3em] text-[var(--color-parchment)]/70 transition hover:border-[var(--color-parchment)]/40 hover:text-[var(--color-parchment)]"
              >
                <span>Consultar o Códice</span>
                <span>↓</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-y border-[var(--color-gold)]/15 bg-[#0b0a08]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-8 overflow-hidden px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-parchment)]/40">
          <span className="flex items-center gap-2 text-[var(--color-gold)]">
            <Diamond className="h-1.5 w-1.5" /> Guildas ativas
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-2">
            <img src="/ui/icons/profile.png" alt="" className="h-4 w-4 object-contain opacity-70" />
            12.847 aventureiros
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-2">
            <img src="/ui/stats/concluido.png" alt="" className="h-4 w-4 object-contain opacity-70" />
            3.1M tarefas vencidas
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-2 text-[var(--color-hard)]">
            <img src="/ui/dashboard/hard.png" alt="" className="h-4 w-4 object-contain" />
            42 dragões abatidos hoje
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-2">
            <img src="/ui/stats/fogo.png" alt="" className="h-4 w-4 object-contain opacity-70" />
            streak mais longo — 217 dias
          </span>
        </div>
      </div>
    </section>
  );
}
