"use client";

export default function PanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-(--color-hard)/40 bg-(--color-surface) p-8 shadow-(--shadow-card)">
      <div className="flex items-start gap-4">
        <img
          src="/ui/achievements/locked.png"
          alt=""
          className="h-16 w-16 shrink-0 object-contain opacity-70 saturate-0"
        />
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(--color-hard)">
            ◆ Falha na jornada
          </div>
          <h2 className="mt-1 font-serif text-2xl italic text-(--color-ink)">
            Algo deu errado.
          </h2>
          <p className="mt-2 text-sm text-(--color-muted)">
            {error.message ?? "Um erro inesperado interrompeu sua missão."}
          </p>
        </div>
      </div>

      <button
        onClick={reset}
        className="mt-6 rounded-xl border-2 border-(--color-gold) bg-(--color-gold)/10 px-5 py-2.5 text-sm font-semibold text-(--color-gold) transition hover:bg-(--color-gold)/20"
      >
        ✦ Tentar novamente
      </button>
    </div>
  );
}
