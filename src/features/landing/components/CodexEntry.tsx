export default function CodexEntry({
  numeral,
  sigil,
  title,
  latin,
  description,
}: {
  numeral: string;
  sigil: React.ReactNode;
  title: string;
  latin: string;
  description: string;
}) {
  return (
    <article className="group relative border-t border-[var(--color-gold)]/20 pt-8">
      <div className="mb-5 flex items-baseline justify-between">
        <span className="font-[family-name:var(--font-serif)] text-xs font-semibold tracking-[0.3em] text-[var(--color-gold)]/70">
          {numeral}
        </span>
        <div className="text-[var(--color-gold)]/40 transition-transform duration-500 group-hover:rotate-[360deg]">
          {sigil}
        </div>
      </div>

      <h3 className="font-[family-name:var(--font-serif)] text-[26px] font-semibold leading-[1.05] text-[var(--color-parchment)]">
        {title}
      </h3>

      <p className="mt-1 font-[family-name:var(--font-serif)] text-sm italic text-[var(--color-gold)]/60">
        {latin}
      </p>

      <p className="mt-5 text-[13.5px] leading-[1.7] text-[var(--color-parchment)]/55">
        {description}
      </p>
    </article>
  );
}
