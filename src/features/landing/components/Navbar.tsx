import Link from "next/link";
import { Diamond } from "./ornaments";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-gold)]/10 bg-[#100f0d]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="group flex items-center gap-2.5">
            <Diamond className="h-2.5 w-2.5 text-[var(--color-gold)]" />
            <span className="font-[family-name:var(--font-serif)] text-[17px] font-semibold tracking-tight text-[var(--color-parchment)]">
              Adventurer{" "}
              <em className="italic font-normal text-[var(--color-gold)]">
                Route
              </em>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-parchment)]/55 md:flex">
            <Link href="#prologue" className="transition hover:text-[var(--color-gold)]">
              Prólogo
            </Link>
            <Link href="#codex" className="transition hover:text-[var(--color-gold)]">
              Códice
            </Link>
            <Link href="#rite" className="transition hover:text-[var(--color-gold)]">
              Rito
            </Link>
            <Link href="#oath" className="transition hover:text-[var(--color-gold)]">
              Juramento
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-parchment)]/60 transition hover:text-[var(--color-parchment)] sm:block"
          >
            Entrar
          </Link>
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-none border border-[var(--color-gold)]/50 bg-[var(--color-gold)]/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)] transition hover:bg-[var(--color-gold)] hover:text-[#100f0d]"
          >
            <span>Cadastrar</span>
            <Diamond className="h-1.5 w-1.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
