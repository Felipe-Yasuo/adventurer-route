import Link from "next/link";
import LogoutItem from "./LogoutItem";

const Item = ({
  href,
  label,
  iconSrc,
}: {
  href: string;
  label: string;
  iconSrc: string;
}) => (
  <Link
    href={href}
    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-black/70 transition hover:bg-black/5"
  >
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-black/5">
      <img src={iconSrc} alt="" className="h-8 w-8" />
    </span>
    <span className="hidden md:block">{label}</span>
  </Link>
);

export default function Sidebar() {
  return (
    <aside className="h-screen w-16 md:w-52 border-r border-black/10 bg-[rgba(242,228,198,0.82)] flex flex-col">
      <div className="flex justify-center px-3 pt-4 pb-5">
        <img
          src="/ui/logo/adventurer-route.png"
          alt="Adventurer Route"
          className="h-20 md:h-30 w-auto object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]"
        />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <Item href="/dashboard" label="Home" iconSrc="/ui/icons/home.png" />
        <Item href="/dashboard/adventure" label="Modo Aventura" iconSrc="/ui/icons/adventure.png" />
        <Item href="/dashboard/shop" label="Loja" iconSrc="/ui/icons/loja.png" />
        <Item href="/dashboard/inventory" label="Inventário" iconSrc="/ui/icons/inventario.png" />
        <Item href="/dashboard/achievements" label="Conquistas" iconSrc="/ui/icons/conquistas.png" />
        <Item href="/dashboard/history" label="Histórico" iconSrc="/ui/icons/historico.png" />
        <Item href="/dashboard/rules" label="Regras" iconSrc="/ui/icons/regras.png" />
        <Item href="/dashboard/profile" label="Perfil" iconSrc="/ui/icons/regras.png" />
      </nav>

      <LogoutItem />
    </aside>
  );
}