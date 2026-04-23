export function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M6 0 L12 6 L6 12 L0 6 Z" />
    </svg>
  );
}

export function FiligreeRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-3 text-[var(--color-gold)]/70 ${className}`}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-gold)]/60" />
      <Diamond className="h-2 w-2" />
      <span className="h-px w-10 bg-[var(--color-gold)]/60" />
      <Diamond className="h-1.5 w-1.5" />
      <span className="h-px w-10 bg-[var(--color-gold)]/60" />
      <Diamond className="h-2 w-2" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-gold)]/60" />
    </div>
  );
}

export function CornerBracket({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden
      className={`${className} ${flip ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path d="M2 14 V2 H14" />
      <path d="M2 26 V38 H14" strokeOpacity="0" />
      <circle cx="2" cy="2" r="1.5" fill="currentColor" />
    </svg>
  );
}
