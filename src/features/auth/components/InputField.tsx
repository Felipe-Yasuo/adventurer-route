export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]/70">
        ◆ {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={[
          "w-full rounded-xl border-2 border-white/[0.08] bg-white/[0.04] px-4 py-3",
          "text-sm text-[var(--color-parchment)] placeholder:text-white/25 outline-none transition",
          "focus:border-[var(--color-gold)]/50",
          "focus:bg-white/[0.07]",
          "focus:shadow-[0_0_0_3px_rgba(212,175,55,0.10)]",
        ].join(" ")}
      />
    </div>
  );
}
