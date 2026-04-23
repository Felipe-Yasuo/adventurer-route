export default function MessageBox({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "error" | "success";
}) {
  const styles =
    variant === "error"
      ? "border-[var(--color-danger)]/25 bg-[var(--color-danger)]/10 text-[var(--color-parchment)]/85"
      : "border-[var(--color-success)]/25 bg-[var(--color-success)]/10 text-[var(--color-parchment)]/85";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
