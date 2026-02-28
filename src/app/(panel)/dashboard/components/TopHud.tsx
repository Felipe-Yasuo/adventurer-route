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

export default function TopHud() {
  // mock por enquanto (depois vem do /api/me)
  const level = 17;
  const xp = 111;
  const streak = 7;
  const completedTotal = 24;
  const gold = 928;
  const life = 2;

  return (
    <header className="flex items-center justify-between">
      {/* ESQUERDA: avatar + LVL/EXP */}
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-2xl bg-cloudWhite/90 border border-black/10" />
        <div className="text-sm text-cloudWhite">
          <div className="leading-5">
            <span className="font-semibold">LVL:</span>{" "}
            <span className="text-cloudWhite/90">{level}</span>
          </div>
          <div className="leading-5">
            <span className="font-semibold">EXP:</span>{" "}
            <span className="text-cloudWhite/90">{xp}</span>
          </div>
        </div>
      </div>

      {/* DIREITA: stats */}
      <div className="flex items-center gap-2">
        <HudStat icon="🏁" value={streak} label="Streak" />
        <HudStat icon="✅" value={completedTotal} label="Concluídas" />
        <HudStat icon="💎" value={gold} label="GOLD" />
        <HudStat icon="❤️" value={life} label="LIFE" />
      </div>
    </header>
  );
}