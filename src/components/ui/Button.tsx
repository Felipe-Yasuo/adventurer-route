import React from "react";

type ButtonVariant = "primary" | "ghost" | "close";

const variantClasses: Record<ButtonVariant, string> = {
  /** Botão de ação principal — fundo dourado */
  primary:
    "rounded-xl border border-[rgba(212,160,23,0.42)] bg-[rgba(212,160,23,0.18)] px-5 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-[rgba(212,160,23,0.28)] disabled:cursor-not-allowed disabled:opacity-60",
  /** Botão secundário / cancelar — fundo translúcido */
  ghost:
    "rounded-xl border border-black/10 bg-[rgba(255,255,255,0.28)] px-4 py-3 text-sm font-semibold text-[color:var(--color-ink)]/80 transition hover:bg-[rgba(255,255,255,0.45)] disabled:opacity-50",
  /** Botão pequeno de fechar (ícone ✕) */
  close:
    "rounded-xl border border-black/10 bg-[rgba(255,255,255,0.28)] px-3 py-2 text-sm font-semibold text-[color:var(--color-ink)]/75 transition hover:bg-[rgba(255,255,255,0.42)] disabled:opacity-50",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = "ghost", className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={[variantClasses[variant], className].join(" ").trim()}
    />
  );
}

export default Button;
