import "./RouteDetails.css";

interface RouteDetailsProps {
  selectedLine: string;
}

interface RouteData {
  stops: string[];
  touristPlaces: {
    name: string;
    description: string;
  }[];
  estimatedTime: string;
  distance: string;
}

const routes: Record<string, RouteData> = {
  "24": {
    stops: [
      "Terminal Bimodal",
      "Cultural Orígenes",
      "Cementerio General",
      "Av. Maestranza",
      "Parque Bolívar",
      "Casa de la Libertad",
      "Mercado Central",
      "Cuartel Militar",
      "Tejar",
      "Cementerio",
      "Centro",
      "Parque El Culata",
      "Terminal Bimodal",
    ],

    touristPlaces: [
      {
        name: "Casa de la Libertad",
        description:
          "Museo histórico nacional y uno de los lugares más importantes de Sucre.",
      },
      {
        name: "Parque Bolívar",
        description:
          "Uno de los principales espacios públicos y turísticos de la ciudad.",
      },
      {
        name: "Cultural Orígenes",
        description:
          "Espacio cultural relacionado con el arte y la historia de Sucre.",
      },
      {
        name: "Mercado Central",
        description:
          "Mercado tradicional donde se pueden encontrar productos típicos.",
      },
      {
        name: "Tejar",
        description:
          "Zona tradicional de Sucre con arquitectura característica.",
      },
    ],

    estimatedTime: "28 min",
    distance: "8.4 km",
  },
};

function RouteDetails({
  selectedLine,
}: RouteDetailsProps) {

  const route = routes[selectedLine];

  if (!route) {
    return (
      <section className="route-details route-details--empty">
        <p>
          Selecciona una línea para ver su recorrido.
        </p>
      </section>
    );
  }

  return (
    <section className="route-details">

      {/* INFORMACIÓN DE LA RUTA */}

      <div className="route-details__route">

        <h2>
          🚌 {selectedLine}
        </h2>

        <div className="route-details__stops">

          {route.stops.map((stop, index) => (
            <div
              className="route-details__stop"
              key={`${stop}-${index}`}
            >
              <span className="route-details__point">
                {index === 0 || index === route.stops.length - 1
                  ? "●"
                  : "○"}
              </span>

              <div>
                <strong>{stop}</strong>

                {index === 0 && (
                  <p>Punto de inicio de la ruta</p>
                )}

                {index === route.stops.length - 1 && (
                  <p>Punto final de la ruta</p>
                )}
              </div>
            </div>
          ))}

        </div>

        {/* ESTADÍSTICAS */}

        <div className="route-details__stats">

          <div>
            <strong>🔢 Paradas</strong>
            <span>{route.stops.length}</span>
          </div>

          <div>
            <strong>⏱️ Tiempo</strong>
            <span>{route.estimatedTime}</span>
          </div>

          <div>
            <strong>📏 Distancia</strong>
            <span>{route.distance}</span>
          </div>

        </div>

      </div>

      {/* LUGARES TURÍSTICOS */}

      <div className="route-details__tourism">

        <h2>
          🏛️ Lugares turísticos
        </h2>

        <p className="route-details__subtitle">
          Lugares que puedes visitar durante el recorrido.
        </p>

        <div className="route-details__tourist-list">

          {route.touristPlaces.map((place) => (
            <article
              className="route-details__tourist"
              key={place.name}
            >

              <div className="route-details__tourist-icon">
                🏛️
              </div>

              <div>
                <h3>{place.name}</h3>

                <p>
                  {place.description}
                </p>
              </div>

            </article>
          ))}

        </div>

      </div>

    </section>
  );
}

export default RouteDetails;