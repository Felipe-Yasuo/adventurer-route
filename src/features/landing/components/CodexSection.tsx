import CodexEntry from "./CodexEntry";
import { FiligreeRule } from "./ornaments";

const ENTRIES = [
  {
    numeral: "I.",
    iconSrc: "/ui/dashboard/medium.png",
    title: "Tarefas como contratos",
    latin: "Pacta Servanda Sunt",
    description:
      "Cada checklist vira um contrato de guilda selado a ouro. Cumpra o prazo e colete a recompensa; falhe, e o escrivão registra — com tinta vermelha.",
  },
  {
    numeral: "II.",
    iconSrc: "/ui/profile/xp.png",
    title: "Experiência que se sente",
    latin: "Per Aspera ad Astra",
    description:
      "XP não é métrica de vaidade. Cada ponto move o ponteiro do seu nível, e cada nível destrava poder real — visual, mecânico, sonoro.",
  },
  {
    numeral: "III.",
    iconSrc: "/ui/stats/fogo.png",
    title: "Ciclos & estações",
    latin: "Tempora Mutantur",
    description:
      "Missões diárias, semanais e sazonais se renovam como as fases da lua. Construa streaks; perca uma noite e o multiplicador se esvai.",
  },
  {
    numeral: "IV.",
    iconSrc: "/ui/stats/gold.png",
    title: "Vida, ouro & loja",
    latin: "Memento Vivere",
    description:
      "Seu HP é finito. Tarefas ignoradas ferem; tarefas cumpridas enchem o bolso. Troque ouro por itens lendários na loja da guilda.",
  },
];

export default function CodexSection() {
  return (
    <section id="codex" className="relative bg-[#100f0d] py-32">

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <span className="font-[family-name:var(--font-serif)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
              Folio II · Do Códice
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-serif)] text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[0.95] text-[var(--color-parchment)]">
              Quatro dons
              <br />
              <em className="italic text-[var(--color-gold)]">forjados</em>
              <br />
              para você.
            </h2>
          </div>
          <div className="col-span-12 flex items-end md:col-span-6 md:col-start-7">
            <p className="font-[family-name:var(--font-serif)] text-[15px] italic leading-[1.8] text-[var(--color-parchment)]/55">
              Cada página deste compêndio guarda uma mecânica que transforma o
              mundano em mítico. Leia com vagar — o hábito nasce da
              contemplação, não da pressa.
            </p>
          </div>
        </div>

        <FiligreeRule className="my-16" />

        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          {ENTRIES.map((entry) => (
            <div
              key={entry.numeral}
              className="col-span-12 sm:col-span-6 lg:col-span-3"
            >
              <CodexEntry {...entry} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
