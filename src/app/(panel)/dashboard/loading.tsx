import { Skeleton } from "@/components/ui/Skeleton";

function QuestSkeleton() {
  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card) space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-2.5 w-full rounded-full" />
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-3 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="relative flex flex-col gap-4 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-4 lg:gap-y-4 2xl:grid-cols-[380px_minmax(0,1fr)]">
      {/* TopHud skeleton */}
      <div className="order-1 lg:order-0 lg:col-start-2 lg:row-start-1">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card)">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
            <Skeleton className="h-10 w-20 rounded-xl" />
            <Skeleton className="h-10 w-20 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Sidebar skeleton */}
      <aside className="order-2 space-y-4 lg:order-0 lg:col-start-1 lg:row-start-1 lg:row-span-2">
        {/* NewTaskCard */}
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card) space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>

        {/* QuestsCard */}
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card) space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-32" />
          </div>
          <QuestSkeleton />
          <QuestSkeleton />
        </div>
      </aside>

      {/* KanbanBoard skeleton */}
      <div className="order-3 lg:order-0 lg:col-start-2 lg:row-start-2">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {["A fazer", "Em progresso", "Concluído"].map((col) => (
              <div key={col} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <TaskSkeleton />
                <TaskSkeleton />
                <TaskSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
