import "./NavBar.css";

const navItems = [
  { label: "PARA QUÉ?", href: "#para-que" },
  { label: "POR QUÉ?", href: "#porque" },
  { label: "AYUDA", href: "#ayuda" },
  { label: "MÁS INFO", href: "#mas-info" },
];

export default function NavBar() {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar__content">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="navbar__link">
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
