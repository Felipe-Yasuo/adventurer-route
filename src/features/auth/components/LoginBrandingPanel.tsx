export default function LoginBrandingPanel() {
  return (
    <div className="relative hidden w-[55%] lg:block">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/ui/frames/background-login.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0704]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0704]/60 via-transparent to-[#0a0704]/40" />

      <div className="absolute bottom-0 left-0 right-0 p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/15 bg-black/30 px-4 py-2 backdrop-blur-md">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-parchment)]/70">
            Adventurer Route
          </span>
        </div>
        <h2 className="mt-4 max-w-md font-[family-name:var(--font-serif)] text-3xl font-bold leading-snug text-[var(--color-parchment)]/90">
          Sua jornada começa aqui.
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-parchment)]/45">
          Organize missões, evolua seu personagem e transforme cada tarefa em
          uma conquista épica.
        </p>
      </div>
    </div>
  );
}
