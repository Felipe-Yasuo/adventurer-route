export default function LoginBrandingPanel({
  mode = "login",
}: {
  mode?: "login" | "register";
}) {
  return (
    <div className="relative hidden w-[55%] overflow-hidden lg:block">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/ui/frames/background-login.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0704]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0704]/80 via-transparent to-[#0a0704]/40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-20 h-80 w-80 rounded-full bg-[var(--color-gold)]/10 blur-3xl"
      />

      <div className="absolute bottom-0 left-0 right-0 p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-black/40 px-4 py-2 backdrop-blur-md shadow-[0_0_14px_-4px_rgba(212,175,55,0.55)]">
          <span className="text-[10px] text-[var(--color-gold)]" aria-hidden>
            ◆
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Adventurer Route
          </span>
          <span className="text-[10px] text-[var(--color-gold)]" aria-hidden>
            ◆
          </span>
        </div>

        <h2 className="mt-6 max-w-md font-[family-name:var(--font-serif)] text-[42px] italic leading-[1.05] text-[var(--color-parchment)]">
          {mode === "login"
            ? "Sua taverna espera."
            : "Uma nova saga aguarda."}
        </h2>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-parchment)]/55">
          {mode === "login"
            ? "O fogo ainda arde, o pergaminho ainda aguarda sua pena. Retome a jornada de onde parou."
            : "Batize seu aventureiro, receba seu pergaminho — e registre o primeiro verso da sua lenda."}
        </p>

        <div className="mt-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-parchment)]/40">
          <span className="h-px w-10 bg-[var(--color-gold)]/40" />
          <span>◆ Folio do viajante</span>
        </div>
      </div>
    </div>
  );
}
