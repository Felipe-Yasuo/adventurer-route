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
    return (
        <div className="flex items-center gap-4">
            {/* Moldura/avatar */}
            <div className="relative h-[92px] w-[220px] shrink-0">
                <img
                    src="/ui/frames/background-avatar.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
                    draggable={false}
                />

                <div className="absolute left-[30px] top-[8px] flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full">
                    {image ? (
                        <img
                            src={image}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full rounded-full bg-[rgba(255,255,255,0.25)]" />
                    )}
                </div>

                {/* infos */}
                <div className="absolute left-[108px] top-[26px] right-[14px] text-[color:var(--color-ink)]">
                    <div className="text-lg font-bold leading-none">Level: {level}</div>
                </div>
            </div>
        </div>
    );
}