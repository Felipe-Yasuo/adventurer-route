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

function HudStat({
  iconSrc,
  value,
  label,
  tone = "default",
  pulse = false,
}: {
  iconSrc: string;
  value: string | number;
  label: string;
  tone?: "default" | "fire" | "danger";
  pulse?: boolean;
}) {
  const toneClass =
    tone === "fire"
      ? "border-orange-500/60 bg-linear-to-br from-orange-900/50 to-(--color-surface) shadow-[0_0_16px_-2px_rgba(249,115,22,0.45)]"
      : tone === "danger"
      ? "border-red-500/70 bg-linear-to-br from-red-900/50 to-(--color-surface) shadow-[0_0_16px_-2px_rgba(239,68,68,0.55)]"
      : "border-(--color-border) bg-(--color-surface) shadow-(--shadow-card)";

  const iconGlow =
    tone === "fire"
      ? "drop-shadow-[0_0_10px_rgba(249,115,22,0.7)]"
      : tone === "danger"
      ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]"
      : "drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]";

  return (
    <div
      className={[
        "flex items-center gap-3 rounded-2xl border px-4 py-3 transition",
        toneClass,
        pulse ? "animate-pulse" : "",
      ].join(" ")}
    >
      <img
        src={iconSrc}
        alt=""
        className={`h-11 w-11 object-contain ${iconGlow}`}
      />

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
  const lifePct = user.maxLife > 0 ? user.life / user.maxLife : 1;
  const lifeLow = lifePct <= 0.3 && user.life > 0;
  const streakActive = user.streakCount > 0;

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
            iconSrc="/ui/stats/fogo.png"
            value={user.streakCount}
            label="Streak"
            tone={streakActive ? "fire" : "default"}
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
          <HudStat
            iconSrc="/ui/stats/vida.png"
            value={`${user.life}/${user.maxLife}`}
            label="Life"
            tone={lifeLow ? "danger" : "default"}
            pulse={lifeLow}
          />
        </div>
      </div>
    </header>
  );
}
