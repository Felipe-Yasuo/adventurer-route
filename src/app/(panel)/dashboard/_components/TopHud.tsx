import type { TaskUI } from "./types";
import { useEffect, useState } from "react";


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
  tasks,
  levelUpPulse,
}: {
  user: {
    level: number;
    xp: number;
    gold: number;
    life: number;
    maxLife: number;
    streakCount: number;
  };
  tasks: TaskUI[];
  levelUpPulse: number;
}) {
  const completedTotal = tasks.filter((t) => t.completed).length;
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
        "flex items-center justify-between transition",
        glow ? "ring-2 ring-blueSoft/40 shadow-[0_0_30px_rgba(166,200,245,0.25)] rounded-2xl p-2 -m-2" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-2xl bg-cloudWhite/90 border border-black/10" />
        <div className="text-sm text-cloudWhite">
          <div className="leading-5">
            <span className="font-semibold">LVL:</span>{" "}
            <span className="text-cloudWhite/90">{user.level}</span>
          </div>
          <div className="leading-5">
            <span className="font-semibold">EXP:</span>{" "}
            <span className="text-cloudWhite/90">{user.xp}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <HudStat icon="🏁" value={user.streakCount} label="Streak" />
        <HudStat icon="✅" value={completedTotal} label="Concluídas" />
        <HudStat icon="💎" value={user.gold} label="GOLD" />
        <HudStat icon="❤️" value={`${user.life}/${user.maxLife}`} label="LIFE" />
      </div>
    </header>
  );
}