import { FiligreeRule } from "./ornaments";

const STEPS = [
  {
    n: "Passo Primeiro",
    title: "Declare seu voto",
    body: "Crie sua conta e batize seu aventureiro. Escolha o nome com que quer ser lembrado nas crônicas.",
  },
  {
    n: "Passo Segundo",
    title: "Inscreva as missões",
    body: "Traduza sua rotina em contratos. Cada tarefa recebe dificuldade, prazo e recompensa em ouro e XP.",
  },
  {
    n: "Passo Terceiro",
    title: "Enfrente o dia",
    body: "Marque cumpridas; colete loot; veja seu nível subir em tempo real. Streaks forjam multiplicadores.",
  },
  {
    n: "Passo Quarto",
    title: "Herde a lenda",
    body: "Gaste ouro na loja. Desbloqueie conquistas. Ascenda até que seu nome preencha uma página inteira do compêndio.",
  },
];

export default function RiteSection() {
  return (
    <section id="rite" className="relative overflow-hidden bg-[#0b0a08] py-32">
      <div
        aria-hidden
        className="absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[var(--color-gold)]/[0.05] blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-[var(--color-hard)]/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-[family-name:var(--font-serif)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
            Folio III · O Rito
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-serif)] text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.95] text-[var(--color-parchment)]">
            Da plebe ao{" "}
            <em className="italic text-[var(--color-gold)]">lendário</em>
            ,
            <br />
            em quatro passos.
          </h2>
          <FiligreeRule className="mx-auto mt-10 max-w-md" />
        </div>

        <ol className="relative mt-24 grid grid-cols-12 gap-y-20 md:gap-y-10">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="col-span-12 grid grid-cols-12 gap-6 md:col-span-6 lg:col-span-3"
            >
              <div className="col-span-12 flex items-center gap-4">
                <span className="font-[family-name:var(--font-serif)] text-[72px] font-semibold italic leading-none text-[var(--color-gold)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-[var(--color-gold)]/30" />
              </div>
              <div className="col-span-12">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-parchment)]/40">
                  {step.n}
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-serif)] text-2xl font-semibold leading-tight text-[var(--color-parchment)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-[1.7] text-[var(--color-parchment)]/55">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
