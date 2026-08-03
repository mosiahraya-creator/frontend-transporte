import "./Header.css";

interface HeaderProps {
  title?: string;
  logo?: string;
}

export default function Header({
  title = "Mi Micro",
  logo = "/logo.png",
}: HeaderProps) {
  return (
    <header className="header">

      <div className="logo-container">
        <img src={logo} alt="Logo Mi Micro" className="logo" />
      </div>

      <div className="title-container">
        <h1>{title}</h1>
        <span>Sucre Ch'ula</span>
      </div>

    </header>
  );
}