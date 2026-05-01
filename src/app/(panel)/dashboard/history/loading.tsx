import { Skeleton } from "@/components/ui/Skeleton";

function TaskRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-surface) p-3">
      <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

export default function HistoryLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </div>

      {/* Day navigator */}
      <div className="flex items-center justify-between rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card)">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <div className="space-y-1.5 text-center">
          <Skeleton className="mx-auto h-4 w-52" />
          <Skeleton className="mx-auto h-3 w-32" />
        </div>
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>

      {/* Completion bar */}
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card) space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <TaskRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
