export default function CodexEntry({
  numeral,
  sigil,
  iconSrc,
  title,
  latin,
  description,
}: {
  numeral: string;
  sigil?: React.ReactNode;
  iconSrc?: string;
  title: string;
  latin: string;
  description: string;
}) {
  return (
    <article className="group relative border-t border-[var(--color-gold)]/20 pt-8">
      <div className="mb-5 flex items-start justify-between gap-3">
        <span className="font-[family-name:var(--font-serif)] text-xs font-semibold tracking-[0.3em] text-[var(--color-gold)]/70">
          {numeral}
        </span>

        {iconSrc ? (
          <div className="relative h-14 w-14 shrink-0">
            <div
              aria-hidden
              className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-[var(--color-gold)]/10 blur-xl opacity-0 transition duration-500 group-hover:opacity-100"
            />
            <img
              src={iconSrc}
              alt=""
              className="relative h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.55)] transition duration-500 group-hover:scale-110 group-hover:-translate-y-0.5"
            />
          </div>
        ) : (
          <div className="text-[var(--color-gold)]/40 transition-transform duration-500 group-hover:rotate-[360deg]">
            {sigil}
          </div>
        )}
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
