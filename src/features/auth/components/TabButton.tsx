export default function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex-1 rounded-lg px-4 py-2.5 text-sm font-bold tracking-wide transition",
        active
          ? "bg-[var(--color-gold)]/20 text-[var(--color-gold)] shadow-[0_0_14px_-2px_rgba(212,175,55,0.45)] border border-[var(--color-gold)]/40"
          : "border border-transparent text-white/45 hover:text-white/75",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
