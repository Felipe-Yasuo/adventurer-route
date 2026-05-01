export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-xl bg-(--color-surfaceAlt)",
        className,
      ].join(" ")}
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "rounded-2xl border-2 border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
    </div>
  );
}
