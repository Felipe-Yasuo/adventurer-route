import React from "react";

type ButtonVariant = "primary" | "ghost" | "close";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "rounded-xl border border-(--color-gold) bg-(--color-gold) px-5 py-3 text-sm font-semibold text-(--color-bg) transition hover:bg-(--color-goldDark) hover:border-(--color-goldDark) disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) px-4 py-3 text-sm font-semibold text-(--color-ink)/85 transition hover:bg-(--color-surface) hover:text-(--color-ink) disabled:opacity-50",
  close:
    "rounded-xl border border-(--color-border) bg-(--color-surfaceAlt) px-3 py-2 text-sm font-semibold text-(--color-muted) transition hover:bg-(--color-surface) hover:text-(--color-ink) disabled:opacity-50",
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
