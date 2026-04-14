import { useEffect, useState } from "react";
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
  levelUpPulse,
}: TopHudProps) {
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    if (!levelUpPulse) return;
    setGlow(true);
    const t = window.setTimeout(() => setGlow(false), 1200);
    return () => window.clearTimeout(t);
  }, [levelUpPulse]);

  return (
    <header
      className={[
        "flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between xl:gap-6",
        glow
          ? "rounded-2xl p-2 -m-2 ring-2 ring-(--color-gold)/40 shadow-[0_0_30px_rgba(212,175,55,0.35)]"
          : "",
      ].join(" ")}
    >
      <PlayerHud
        level={user.level}
        xp={user.xp}
        image={user.image ?? null}
      />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between xl:gap-6">
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
