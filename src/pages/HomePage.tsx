import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header/Header";
import LineSearch from "../components/LineSearch/LineSearch";
import RouteMap from "../components/RouteMap/RouteMap";
import RouteDetails from "../components/RouteDetails/RouteDetails";

import { authRepository } from "../repositories/authRepository";

function HomePage() {
  const navigate = useNavigate();

  // Usuario actualmente conectado
  const user = authRepository.getCurrentUser();

  // Línea seleccionada en el buscador
  const [selectedLine, setSelectedLine] =
    useState<string>("");

  // =================================
  // CERRAR SESIÓN
  // =================================

  const handleLogout = () => {
    authRepository.logout();

    navigate("/login", {
      replace: true,
    });
  };

  // =================================
  // BUSCAR LÍNEA
  // =================================

  const handleLineSearch = (line: string) => {
    console.log("Línea seleccionada:", line);

    setSelectedLine(line);
  };

  // =================================
  // BOTÓN INICIO
  // =================================

  const handleHome = () => {
    setSelectedLine("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* ================================
          HEADER
      ================================= */}

      <Header />

      <main className="home-page">

        {/* ================================
            INFORMACIÓN DEL USUARIO
        ================================= */}

        <section className="home-page__welcome">

        

          {user ? (
            <>
              <p>
                Bienvenido, {user.name}
              </p>

              <p>
                Carnet: {user.carnet}
              </p>

              <p>
                Rol: {user.role}
              </p>

              <button
                type="button"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <p>
            
            </p>
          )}

        </section>

        {/* MAPA */}
        <section className="home-page__map-section">

          <RouteMap />

        </section>

        {/* BUSCADOR DE LÍNEAS */}
        <section className="home-page__line-section">

          <LineSearch
            onSearch={handleLineSearch}
            onHome={handleHome}
          />

          {selectedLine && (
            <div className="home-page__selected-line">

              <strong>
                Línea seleccionada:
              </strong>

              <span>
                {selectedLine}
              </span>

            </div>
          )}

        </section>
        <RouteDetails selectedLine={selectedLine} />

      </main>
    </>
  );
}

export default HomePage;