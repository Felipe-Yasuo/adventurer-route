import Link from "next/link";
import { CornerBracket, Diamond } from "./ornaments";

export default function OathSection() {
  return (
    <section id="oath" className="relative overflow-hidden bg-[#100f0d] py-32">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-4xl px-6">
        <div className="relative border border-[var(--color-gold)]/30 bg-gradient-to-b from-[#1a1714] to-[#100f0d] p-12 md:p-20">
          <CornerBracket className="absolute -left-px -top-px h-10 w-10 text-[var(--color-gold)]" />
          <CornerBracket className="absolute -right-px -top-px h-10 w-10 rotate-90 text-[var(--color-gold)]" />
          <CornerBracket className="absolute -bottom-px -left-px h-10 w-10 -rotate-90 text-[var(--color-gold)]" />
          <CornerBracket
            flip
            className="absolute -bottom-px -right-px h-10 w-10 text-[var(--color-gold)]"
          />

          <div className="text-center">
            <span className="font-[family-name:var(--font-serif)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--color-gold)]">
              ❦ Juramento do Aventureiro ❦
            </span>
            <h2 className="mt-6 font-[family-name:var(--font-serif)] text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] text-[var(--color-parchment)]">
              Assine o pergaminho.
              <br />
              <em className="italic text-[var(--color-gold)]">
                Comece amanhã, hoje.
              </em>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[14px] leading-[1.8] text-[var(--color-parchment)]/55">
              Grátis para cadastrar. Não pedimos cartão — pedimos apenas que
              você apareça amanhã, e depois, e depois. A guilda recompensa a
              constância.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex w-full items-center justify-between gap-4 border border-[var(--color-gold)] bg-[var(--color-gold)] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.3em] text-[#100f0d] transition hover:bg-transparent hover:text-[var(--color-gold)] sm:w-auto"
              >
                <span>Forjar conta</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-3 border border-[var(--color-parchment)]/20 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.3em] text-[var(--color-parchment)]/70 transition hover:border-[var(--color-parchment)]/40 hover:text-[var(--color-parchment)] sm:w-auto"
              >
                Já tenho um diário
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-parchment)]/35">
              <span className="flex items-center gap-2">
                <Diamond className="h-1.5 w-1.5 text-[var(--color-gold)]" />
                Sem cartão
              </span>
              <span className="flex items-center gap-2">
                <Diamond className="h-1.5 w-1.5 text-[var(--color-gold)]" />
                Sem pressa
              </span>
              <span className="flex items-center gap-2">
                <Diamond className="h-1.5 w-1.5 text-[var(--color-gold)]" />
                Sem desculpas
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
