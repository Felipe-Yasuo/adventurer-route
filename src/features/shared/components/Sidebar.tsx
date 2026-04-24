"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import LogoutItem from "@/features/auth/components/LogoutItem";
import { usePrefersReducedMotion } from "@/components/animations/motion-prefs";

const NAV_ITEMS: Array<{ href: string; label: string; iconSrc: string }> = [
  { href: "/dashboard", label: "Home", iconSrc: "/ui/icons/home.png" },
  { href: "/dashboard/adventure", label: "Modo Aventura", iconSrc: "/ui/icons/adventure.png" },
  { href: "/dashboard/shop", label: "Loja", iconSrc: "/ui/icons/loja.png" },
  { href: "/dashboard/inventory", label: "Inventário", iconSrc: "/ui/icons/inventario.png" },
  { href: "/dashboard/achievements", label: "Conquistas", iconSrc: "/ui/icons/conquistas.png" },
  { href: "/dashboard/history", label: "Histórico", iconSrc: "/ui/icons/historico.png" },
  { href: "/dashboard/rules", label: "Regras", iconSrc: "/ui/icons/regras.png" },
  { href: "/dashboard/profile", label: "Perfil", iconSrc: "/ui/icons/profile.png" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Item({
  href,
  label,
  iconSrc,
  active,
  reduced,
}: {
  href: string;
  label: string;
  iconSrc: string;
  active: boolean;
  reduced: boolean;
}) {
  return (
    <motion.div
      whileHover={reduced ? undefined : { scale: 1.03 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{ willChange: "transform" }}
    >
      <Link
        href={href}
        className={[
          "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
          active
            ? "bg-(--color-surface) text-(--color-gold)"
            : "text-(--color-ink)/80 hover:bg-(--color-surface) hover:text-(--color-gold)",
        ].join(" ")}
      >
        {active ? (
          <motion.span
            layoutId="sidebar-active-indicator"
            initial={reduced ? { opacity: 1 } : { opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ willChange: "transform, opacity", transformOrigin: "top" }}
            className="absolute left-0 top-1 bottom-1 w-0.75 rounded-full bg-(--color-gold)"
          />
        ) : null}

        <img
          src={iconSrc}
          alt=""
          className={[
            "h-10 w-10 object-contain transition shrink-0",
            reduced
              ? ""
              : "group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]",
            active
              ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
              : "",
          ].join(" ")}
        />
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  return (
    <aside className="h-screen w-52 border-r border-(--color-border) bg-(--color-surfaceAlt) flex flex-col">
      <div className="shrink-0 flex justify-center px-3 pt-4 pb-4">
        <img
          src="/ui/logo/adventurer-route.png"
          alt="Adventurer Route"
          className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)]"
        />
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto space-y-1 px-3 pb-2">
        {NAV_ITEMS.map((it) => (
          <Item
            key={it.href}
            href={it.href}
            label={it.label}
            iconSrc={it.iconSrc}
            active={isActive(pathname, it.href)}
            reduced={reduced}
          />
        ))}
      </nav>

      <LogoutItem />
    </aside>
  );
}
