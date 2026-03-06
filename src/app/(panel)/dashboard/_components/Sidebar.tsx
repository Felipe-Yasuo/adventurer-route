import Link from "next/link";
import LogoutItem from "./LogoutItem";

const Item = ({ href, label, iconSrc }: { href: string; label: string; iconSrc: string }) => (
  <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-black/70 hover:bg-black/5 transition">
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-black/5">
      <img src={iconSrc} alt="" className="h-8 w-8" />
    </span>
    <span className="hidden md:block">{label}</span>
  </Link>
);

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-20 md:w-64 border-r border-white/10 bg-black/10 flex flex-col">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-blueSoft/30 border border-white/10" />
          <div className="hidden md:block">
            <div className="flex justify-center md:justify-start">
              <img
                src="/ui/logo/adventurer-route.png"
                className="mx-auto mt-2 h-14 w-auto object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]"
              />
            </div>
          </div>
        </div>
      </div>

      <nav className="px-3 space-y-1 flex-1">
        <Item href="/dashboard" label="Home" iconSrc="/ui/icons/home.png" />
        <Item href="/dashboard/adventure" label="Modo Aventura" iconSrc="/ui/icons/adventure.png" />
        <Item href="/dashboard/shop" label="Loja" iconSrc="/ui/icons/loja.png" />
        <Item href="/dashboard/inventory" label="Inventário" iconSrc="/ui/icons/inventario.png" />
        <Item href="/dashboard/achievements" label="Conquistas" iconSrc="/ui/icons/conquistas.png" />
        <Item href="/dashboard/history" label="Histórico" iconSrc="/ui/icons/historico.png" />
        <Item href="/dashboard/rules" label="Regras" iconSrc="/ui/icons/regras.png" />
        <Item href="/dashboard/profile" label="Perfil" iconSrc="🧙" />
      </nav>

      <LogoutItem />
    </aside>
  );
}