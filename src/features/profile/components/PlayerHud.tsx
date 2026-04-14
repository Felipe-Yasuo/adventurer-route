type PlayerHudProps = {
    level: number;
    xp: number;
    image?: string | null;
};

export default function PlayerHud({
    level,
    image,
}: PlayerHudProps) {
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
                        <div className="h-full w-full rounded-full bg-(--color-bg)" />
                    )}
                </div>

                <div className="absolute left-28 right-6 top-13 -translate-y-1/2 text-center">
                    <div className="text-lg font-bold leading-none text-(--color-gold) drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                        Level: {level}
                    </div>
                </div>
            </div>
        </div>
    );
}
