export default function TestimonialSection() {
  return (
    <section className="relative border-y border-[var(--color-gold)]/15 bg-[#100f0d] py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <span className="font-[family-name:var(--font-serif)] text-6xl italic text-[var(--color-gold)]/60">
          &ldquo;
        </span>
        <blockquote className="mt-2 font-[family-name:var(--font-serif)] text-[clamp(1.75rem,3.5vw,2.75rem)] font-normal italic leading-[1.25] text-[var(--color-parchment)]">
          Eu escrevia listas que morriam em gavetas. O Adventurer Route
          transformou as mesmas tarefas em algo que eu queria
          <em className="not-italic font-semibold text-[var(--color-gold)]">
            {" "}
            cumprir
          </em>
          . Cento e oitenta e sete dias seguidos.
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-parchment)]/50">
          <span className="h-px w-10 bg-[var(--color-gold)]/40" />
          <span>Elara, a Persistente · Nível 42</span>
          <span className="h-px w-10 bg-[var(--color-gold)]/40" />
        </div>
      </div>
    </section>
  );
}
