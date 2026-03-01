import Link from "next/link";

const Item = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) => (
  <Link
    href={href}
    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-cloudWhite/80 hover:bg-white/10 hover:text-cloudWhite transition"
  >
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
      {icon}
    </span>
    <span className="hidden md:block">{label}</span>
  </Link>
);

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-20 md:w-64 border-r border-white/10 bg-black/10">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-blueSoft/30 border border-white/10" />
          <div className="hidden md:block">
            <p className="text-sm font-semibold">adventurer-route</p>
            <p className="text-xs text-white/60">Painel</p>
          </div>
        </div>
      </div>

      <nav className="px-3 space-y-1">
        <Item href="/dashboard" label="Home" icon="🏠" />
        <Item href="/rules" label="Regras" icon="📜" />
        <Item href="/adventure" label="Modo Aventura" icon="🗺️" />
        <Item href="/achievements" label="Conquistas" icon="🏆" />
        <Item href="/rewards" label="Recompensas" icon="🎁" />
        <Item href="/shop" label="Loja" icon="🛒" />
        <Item href="/profile" label="Perfil" icon="🧙" />
      </nav>
    </aside>
  );
}