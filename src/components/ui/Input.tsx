import React from "react";

/** Classes base compartilhadas por input, select e date — padrão do projeto */
const baseClasses =
  "w-full rounded-xl border border-black/10 bg-[rgba(255,255,255,0.38)] px-4 py-3 text-sm text-[color:var(--color-ink)] outline-none transition focus:border-[rgba(212,160,23,0.45)] focus:bg-[rgba(255,255,255,0.5)]";

/* ─── Input ─── */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={[
        baseClasses,
        "placeholder:text-[color:var(--color-ink)]/40",
        className,
      ]
        .join(" ")
        .trim()}
    />
  );
}

/* ─── Select ─── */
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string;
};

export function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={[baseClasses, className].join(" ").trim()}
    />
  );
}

export default Input;
