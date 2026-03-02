import { useEffect, useState } from "react";

type TopHudProps = {
  user: {
    level: number;
    xp: number;
    gold: number;
    life: number;
    maxLife: number;
    streakCount: number;
  };
  completedTotal: number;
  levelUpPulse: number;
};

function HudStat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-cloudWhite px-3 py-2 text-twilight border border-black/5 shadow-sm">
      <span className="text-base">{icon}</span>
      <div className="leading-tight">
        <div className="text-sm font-semibold">{value}</div>
        <div className="text-[10px] opacity-70">{label}</div>
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

  const lifePct =
    user.maxLife > 0
      ? Math.max(0, Math.min(100, (user.life / user.maxLife) * 100))
      : 0;

  return (
    <header
      className={[
        "flex items-center justify-between transition",
        glow
          ? "ring-2 ring-blueSoft/40 shadow-[0_0_30px_rgba(166,200,245,0.25)] rounded-2xl p-2 -m-2"
          : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-2xl bg-cloudWhite/90 border border-black/10" />
        <div className="text-sm text-cloudWhite">
          <div className="leading-5">
            <span className="font-semibold">LVL:</span> {user.level}
          </div>
          <div className="leading-5">
            <span className="font-semibold">EXP:</span> {user.xp}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <HudStat icon="🏁" value={user.streakCount} label="Streak" />
        <HudStat icon="✅" value={completedTotal} label="Concluídas" />
        <HudStat icon="💎" value={user.gold} label="GOLD" />

        <div className="w-32">
          <div className="text-[10px] text-white/60 mb-1">
            LIFE {user.life}/{user.maxLife}
          </div>

          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-roseSoft transition-all duration-500"
              style={{ width: `${lifePct}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}