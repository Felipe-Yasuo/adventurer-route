import React from "react";

const baseClasses =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) px-4 py-3 text-sm text-(--color-ink) outline-none transition focus:border-(--color-gold) focus:bg-(--color-surface)";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={[
        baseClasses,
        "placeholder:text-(--color-muted)",
        className,
      ]
        .join(" ")
        .trim()}
    />
  );
}

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
