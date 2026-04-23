import Link from "next/link";
import { Diamond } from "./ornaments";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-gold)]/15 bg-[#0b0a08] px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-2.5">
              <Diamond className="h-2.5 w-2.5 text-[var(--color-gold)]" />
              <span className="font-[family-name:var(--font-serif)] text-lg font-semibold text-[var(--color-parchment)]">
                Adventurer{" "}
                <em className="italic font-normal text-[var(--color-gold)]">
                  Route
                </em>
              </span>
            </div>
            <p className="mt-4 max-w-xs font-[family-name:var(--font-serif)] text-sm italic leading-[1.7] text-[var(--color-parchment)]/40">
              Redigido à luz de vela pelos escribas da Guilda do Cronista.
              Todos os feitos são registrados.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
              Compêndio
            </p>
            <ul className="mt-4 space-y-2 text-[13px] text-[var(--color-parchment)]/55">
              <li><Link href="#prologue" className="hover:text-[var(--color-parchment)]">Prólogo</Link></li>
              <li><Link href="#codex" className="hover:text-[var(--color-parchment)]">Códice</Link></li>
              <li><Link href="#rite" className="hover:text-[var(--color-parchment)]">Rito</Link></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
              Guilda
            </p>
            <ul className="mt-4 space-y-2 text-[13px] text-[var(--color-parchment)]/55">
              <li><Link href="#" className="hover:text-[var(--color-parchment)]">Juramento</Link></li>
              <li><Link href="#" className="hover:text-[var(--color-parchment)]">Privacidade</Link></li>
              <li><Link href="#" className="hover:text-[var(--color-parchment)]">Suporte</Link></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
              Do escrivão
            </p>
            <p className="mt-4 font-[family-name:var(--font-serif)] text-[13px] italic leading-[1.7] text-[var(--color-parchment)]/55">
              &ldquo;O tempo é a única moeda que não se recupera. Gaste-a em
              feitos dignos.&rdquo;
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-gold)]/10 pt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-parchment)]/30 md:flex-row">
          <p>© MMXXVI · Guilda do Cronista · Todos os direitos inscritos</p>
          <p className="flex items-center gap-2">
            <Diamond className="h-1 w-1" />
            Anno sapientiae
            <Diamond className="h-1 w-1" />
          </p>
        </div>
      </div>
    </footer>
  );
}
