import { xpToNextLevel } from "@/server/game/progression/rules";

type PlayerHudProps = {
    level: number;
    xp: number;
    image?: string | null;
};

export default function PlayerHud({
    level,
    xp,
    image,
}: PlayerHudProps) {
    const xpNeeded = xpToNextLevel(level);
    const pct = Math.max(0, Math.min(100, (xp / xpNeeded) * 100));

    return (
        <div className="flex items-center gap-4">
            <div className="relative h-32 w-64 shrink-0 bot bottom-5">
                <img
                    src="/ui/frames/background-avatar.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
                    draggable={false}
                />

                <div className="absolute left-7.5 top-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full">
                    {image ? (
                        <img
                            src={image}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div
                            className="h-full w-full rounded-full bg-linear-to-br from-(--color-surfaceAlt) to-(--color-bg) flex items-center justify-center text-3xl"
                            aria-hidden
                        >
                            <span className="opacity-60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                                ⚔
                            </span>
                        </div>
                    )}
                </div>

                <div className="absolute left-32 right-8 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-bold leading-none text-(--color-gold) drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide">
                            Level {level}
                        </span>
                        <span className="text-[9px] font-semibold leading-none text-(--color-ink)/70 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] tracking-wider">
                            {xp}/{xpNeeded}
                        </span>
                    </div>

                    <div
                        className="relative h-2 w-full overflow-hidden rounded-full border border-black/60 bg-black/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
                        role="progressbar"
                        aria-valuenow={xp}
                        aria-valuemin={0}
                        aria-valuemax={xpNeeded}
                        aria-label={`Experiência: ${xp} de ${xpNeeded}`}
                    >
                        <div
                            className="h-full rounded-full bg-linear-to-r from-(--color-gold)/70 via-(--color-gold) to-amber-300 shadow-[0_0_6px_rgba(212,175,55,0.7)] transition-[width] duration-500 ease-out"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
