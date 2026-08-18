import { useState } from "react";
import "./LineSearch.css";

interface LineSearchProps {
  onSearch?: (line: string) => void;
  onHome?: () => void;
}

const availableLines = [
  "24A",
  "240B",
  "4",
  "10A",
  "24",
  "H",
];

function LineSearch({
  onSearch,
  onHome,
}: LineSearchProps) {
  const [line, setLine] = useState("");
  const [message, setMessage] = useState("");

  const handleSearch = () => {
    const value = line.trim().toUpperCase();

    if (!value) {
      setMessage("Escribe una línea de micro.");
      return;
    }

    if (availableLines.includes(value)) {
      setMessage(`Línea ${value} encontrada.`);

      onSearch?.(value);
    } else {
      setMessage(
        `No encontramos la línea ${value}.`
      );
    }
  };

  const handleClear = () => {
    setLine("");
    setMessage("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="line-search">

      <div className="line-search__container">

        {/* INPUT DE LÍNEA */}

        <input
          type="text"
          value={line}
          onChange={(event) =>
            setLine(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="240A"
          aria-label="Buscar línea de micro"
          className="line-search__input"
        />

        {/* BOTÓN LIMPIAR */}

        <button
          type="button"
          onClick={handleClear}
          className="line-search__clear"
        >
          LIMPIAR
        </button>

        {/* BOTÓN INICIO */}

        <button
          type="button"
          onClick={onHome}
          className="line-search__home"
          aria-label="Ir al inicio"
        >
          🏠
        </button>

      </div>

      {/* MENSAJE */}

      {message && (
        <p className="line-search__message">
          {message}
        </p>
      )}

    </section>
  );
}

export default LineSearch;