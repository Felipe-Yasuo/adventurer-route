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
        "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition",
        active
          ? "bg-[var(--color-gold)]/15 text-[var(--color-gold)] shadow-[0_0_12px_rgba(212,160,23,0.08)]"
          : "text-white/40 hover:text-white/60",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
