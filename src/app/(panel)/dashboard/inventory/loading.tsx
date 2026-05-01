import { Skeleton } from "@/components/ui/Skeleton";

function InventoryItemSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card) space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-lg" />
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-32 w-32 rounded-2xl" />
      </div>
      <div className="text-center space-y-2">
        <Skeleton className="mx-auto h-5 w-36" />
        <Skeleton className="mx-auto h-3 w-48" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

export default function InventoryLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 w-52" />
              <Skeleton className="h-3 w-72" />
            </div>
          </div>
          {/* LifeBanner skeleton */}
          <div className="inline-flex min-w-65 items-center gap-3 rounded-2xl border border-(--color-border) px-4 py-3">
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <InventoryItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
