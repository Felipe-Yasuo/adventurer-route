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
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-parchment)]/50">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={[
          "w-full rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3",
          "text-sm text-[var(--color-parchment)] placeholder:text-white/25 outline-none transition",
          "focus:border-[var(--color-gold)]/30",
          "focus:bg-white/[0.06]",
          "focus:shadow-[0_0_0_3px_rgba(212,160,23,0.06)]",
        ].join(" ")}
      />
    </div>
  );
}
