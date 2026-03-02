"use client";

const LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function WeekTabs({
    value,
    onChange,
}: {
    value: number;
    onChange: (idx: number) => void;
}) {
    return (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-3">
            <div className="grid grid-cols-7 gap-3">
                {LABELS.map((l, idx) => {
                    const active = idx === value;
                    return (
                        <button
                            key={l}
                            onClick={() => onChange(idx)}
                            className={[
                                "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                                active
                                    ? "bg-cloudWhite text-twilight border-black/10"
                                    : "bg-black/20 text-white/70 border-white/10 hover:bg-black/30",
                            ].join(" ")}
                        >
                            {l}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}