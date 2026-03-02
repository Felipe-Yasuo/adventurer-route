"use client";

import type { TaskUI } from "../_types";
import { useEffect, useMemo, useState } from "react";

function HudStat({
  icon,
  value,
  label,
  highlight = false,
}: {
  icon: string;
  value: string | number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-xl bg-cloudWhite px-3 py-2 text-twilight border border-black/5 shadow-sm transition",
        highlight ? "ring-2 ring-forest/30" : "",
      ].join(" ")}
    >
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
    tasksCompletedTotal: number;
  };
  tasks: TaskUI[];
  levelUpPulse: number;
}) {
  const completedTotal = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks]
  );

  const [glow, setGlow] = useState(false);

  useEffect(() => {
    if (!levelUpPulse) return;
    setGlow(true);
    const t = window.setTimeout(() => setGlow(false), 1200);
    return () => window.clearTimeout(t);
  }, [levelUpPulse]);

  const lifePct = useMemo(() => {
    const max = Math.max(1, user.maxLife); // ✅ evita divisão por 0
    const pct = (user.life / max) * 100;
    return Math.max(0, Math.min(100, pct)); // ✅ clamp 0..100
  }, [user.life, user.maxLife]);

  const streakActive = user.streakCount > 0;

  return (
    <header
      className={[
        "flex items-center justify-between transition",
        glow
          ? "ring-2 ring-blueSoft/40 shadow-[0_0_30px_rgba(166,200,245,0.25)] rounded-2xl p-2 -m-2"
          : "",
      ].join(" ")}
    >
      {/* ESQUERDA */}
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
        <HudStat
          icon="🏁"
          value={user.streakCount}
          label="Streak"
          highlight={streakActive}
        />
        <HudStat icon="✅" value={user.tasksCompletedTotal} label="Concluídas" />
        <HudStat icon="💎" value={user.gold} label="GOLD" />

        <div
          className={[
            "rounded-xl bg-cloudWhite px-3 py-2 text-twilight border border-black/5 shadow-sm",
            user.life <= 2 ? "ring-2 ring-rose/30" : "",
          ].join(" ")}
        >
          <div className="text-[10px] opacity-70 mb-1">
            ❤️ LIFE {user.life}/{user.maxLife}
          </div>

          <div className="h-2 w-32 rounded-full bg-black/10 overflow-hidden">
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