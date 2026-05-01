import { Skeleton } from "@/components/ui/Skeleton";

function StatCardSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border-2 border-(--color-border) bg-(--color-surface) p-5">
      <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  );
}

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]">
        {/* Identity card */}
        <div className="rounded-2xl border-2 border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card) space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Skeleton className="h-28 w-28 shrink-0 rounded-full" />
            <div className="flex-1 space-y-3 w-full">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-3 w-52" />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            </div>
          </div>

          {/* Avatar upload area */}
          <div className="rounded-2xl border border-(--color-border) bg-(--color-bg)/60 p-4 space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    </div>
  );
}
