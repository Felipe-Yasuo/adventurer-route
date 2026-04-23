import PlayerHud from "@/features/profile/components/PlayerHud";

type TopHudProps = {
  user: {
    level: number;
    xp: number;
    gold: number;
    life: number;
    maxLife: number;
    streakCount: number;
    image?: string | null;
  };
  completedTotal: number;
  levelUpPulse: number;
};


function LifeStat({
  life,
  maxLife,
}: {
  life: number;
  maxLife: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3 shadow-(--shadow-card) text-(--color-ink)">
      <span className="text-2xl">❤️</span>

      <div className="leading-tight">
        <div className="text-base font-bold">
          {life}/{maxLife}
        </div>
        <div className="text-xs text-(--color-muted)">Life</div>
      </div>
    </div>
  );
}


function HudStat({
  iconSrc,
  value,
  label,
}: {
  iconSrc: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3 shadow-(--shadow-card)">
      <img src={iconSrc} className="h-9 w-9 object-contain" />

      <div className="leading-tight text-(--color-ink)">
        <div className="text-base font-bold">{value}</div>
        <div className="text-xs text-(--color-muted)">{label}</div>
      </div>
    </div>
  );
}
export default function TopHud({
  user,
  completedTotal,
}: TopHudProps) {
  return (
    <header className="flex flex-col gap-0 xl:flex-row xl:items-start xl:justify-between xl:gap-6">
      <PlayerHud
        level={user.level}
        xp={user.xp}
        image={user.image ?? null}
      />

      <div className="-mt-4 flex flex-col gap-4 xl:mt-0 xl:flex-row xl:items-start xl:justify-between xl:gap-6">
        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <HudStat
            iconSrc="/ui/stats/streak.png"
            value={user.streakCount}
            label="Streak"
          />
          <HudStat
            iconSrc="/ui/stats/concluido.png"
            value={completedTotal}
            label="Concluídas"
          />
          <HudStat
            iconSrc="/ui/stats/gold.png"
            value={user.gold}
            label="Gold"
          />

          <LifeStat life={user.life} maxLife={user.maxLife} />

        </div>
      </div>
    </header>
  );
}
