import { useEffect, useRef, useState } from "react";
import "./RouteMap.css";

const SUCRE_CENTER: [number, number] = [-19.0333, -65.2627];

type LocationOption = {
  id: string;
  name: string;
  coordinates: [number, number];
};

type LeafletMap = {
  setView: (
    center: [number, number],
    zoom: number
  ) => LeafletMap;

  fitBounds: (
    bounds: unknown,
    options?: {
      padding: [number, number];
    }
  ) => LeafletMap;

  remove: () => void;
};

/* =========================================
   CAPA NORMAL DE LEAFLET
========================================= */

type LeafletLayer = {
  addTo: (
    map: LeafletMap
  ) => LeafletLayer;

  remove: () => void;
};

/* =========================================
   POLYLINE DE LEAFLET
========================================= */

type LeafletPolyline = {
  addTo: (
    map: LeafletMap
  ) => LeafletPolyline;

  remove: () => void;

  getBounds: () => unknown;
};

/* =========================================
   LEAFLET
========================================= */

type LeafletNamespace = {
  map: (
    element: HTMLElement,
    options?: {
      center: [number, number];
      zoom: number;
    }
  ) => LeafletMap;

  tileLayer: (
    url: string,
    options: {
      attribution: string;
      maxZoom: number;
    }
  ) => LeafletLayer;

  polyline: (
    coordinates: [number, number][],
    options: {
      weight: number;
    }
  ) => LeafletPolyline;

  circleMarker: (
    center: [number, number],
    options: {
      radius: number;
    }
  ) => LeafletLayer;
};

/* =========================================
   WINDOW
========================================= */

declare global {
  interface Window {
    L?: LeafletNamespace;
  }
}

/* =========================================
   PARADAS
========================================= */

const stops: LocationOption[] = [
  {
    id: "10a",
    name: "Parada 10A",
    coordinates: [-19.0411, -65.2587],
  },
  {
    id: "24",
    name: "Parada Línea 24",
    coordinates: [-19.0369, -65.2641],
  },
  {
    id: "central",
    name: "Mercado Central",
    coordinates: [-19.0432, -65.2589],
  },
];

/* =========================================
   DESTINOS
========================================= */

const destinations: LocationOption[] = [
  {
    id: "mercado",
    name: "Mercado Central",
    coordinates: [-19.0432, -65.2589],
  },
  {
    id: "plaza",
    name: "Plaza 25 de Mayo",
    coordinates: [-19.0431, -65.2625],
  },
  {
    id: "terminal",
    name: "Terminal de Buses",
    coordinates: [-19.0375, -65.2477],
  },
  {
    id: "usfx",
    name: "Universidad San Francisco Xavier",
    coordinates: [-19.0377, -65.2558],
  },
];

/* =========================================
   CARGAR LEAFLET
========================================= */

const loadLeaflet =
  (): Promise<LeafletNamespace> => {
    if (window.L) {
      return Promise.resolve(window.L);
    }

    return new Promise(
      (resolve, reject) => {
        const existingScript =
          document.querySelector<HTMLScriptElement>(
            "script[data-leaflet]"
          );

        const finish = () => {
          if (window.L) {
            resolve(window.L);
          } else {
            reject(
              new Error(
                "No se pudo cargar Leaflet."
              )
            );
          }
        };

        if (existingScript) {
          existingScript.addEventListener(
            "load",
            finish,
            { once: true }
          );

          existingScript.addEventListener(
            "error",
            () =>
              reject(
                new Error(
                  "No se pudo cargar Leaflet."
                )
              ),
            { once: true }
          );

          return;
        }

        /* CSS de Leaflet */

        if (
          !document.querySelector(
            "link[data-leaflet]"
          )
        ) {
          const link =
            document.createElement(
              "link"
            );

          link.rel = "stylesheet";

          link.href =
            "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

          link.dataset.leaflet = "true";

          document.head.appendChild(link);
        }

        /* JavaScript de Leaflet */

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

        script.async = true;

        script.dataset.leaflet = "true";

        script.addEventListener(
          "load",
          finish,
          { once: true }
        );

        script.addEventListener(
          "error",
          () =>
            reject(
              new Error(
                "No se pudo cargar Leaflet."
              )
            ),
          { once: true }
        );

        document.body.appendChild(
          script
        );
      }
    );
  };

/* =========================================
   PROPS
========================================= */

interface RouteMapProps {
  initialStop?: string;
  initialDestination?: string;
}

/* =========================================
   COMPONENTE
========================================= */

export default function RouteMap({
  initialStop = "10a",
  initialDestination = "mercado",
}: RouteMapProps) {
  const mapElementRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const mapRef =
    useRef<LeafletMap | null>(
      null
    );

  /*
   * Ahora routeLayerRef es realmente
   * un LeafletPolyline.
   */
  const routeLayerRef =
    useRef<LeafletPolyline | null>(
      null
    );

  const startMarkerRef =
    useRef<LeafletLayer | null>(
      null
    );

  const endMarkerRef =
    useRef<LeafletLayer | null>(
      null
    );

  const [stopId, setStopId] =
    useState(initialStop);

  const [
    destinationId,
    setDestinationId,
  ] = useState(
    initialDestination
  );

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState(
      "Selecciona una parada y un destino."
    );

  /* =========================================
     PARADA SELECCIONADA
  ========================================= */

  const selectedStop =
    stops.find(
      (item) =>
        item.id === stopId
    ) ?? stops[0];

  /* =========================================
     DESTINO SELECCIONADO
  ========================================= */

  const selectedDestination =
    destinations.find(
      (item) =>
        item.id === destinationId
    ) ?? destinations[0];

  /* =========================================
     CREAR MAPA
  ========================================= */

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (
          cancelled ||
          !mapElementRef.current ||
          mapRef.current
        ) {
          return;
        }

        const map = L.map(
          mapElementRef.current,
          {
            center: SUCRE_CENTER,
            zoom: 14,
          }
        );

        L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              "&copy; OpenStreetMap contributors",

            maxZoom: 19,
          }
        ).addTo(map);

        mapRef.current = map;
      })
      .catch(() => {
        if (!cancelled) {
          setMessage(
            "No se pudo cargar el mapa. Revisa tu conexión a Internet."
          );
        }
      });

    return () => {
      cancelled = true;

      routeLayerRef.current?.remove();

      startMarkerRef.current?.remove();

      endMarkerRef.current?.remove();

      mapRef.current?.remove();

      mapRef.current = null;
    };
  }, []);

  /* =========================================
     BUSCAR RUTA
  ========================================= */

  const handleSearchRoute =
    async () => {
      if (!mapRef.current) {
        setMessage(
          "El mapa todavía se está cargando."
        );

        return;
      }

      setLoading(true);

      setMessage(
        "Buscando la ruta..."
      );

      try {
        const [
          startLat,
          startLon,
        ] =
          selectedStop.coordinates;

        const [
          endLat,
          endLon,
        ] =
          selectedDestination.coordinates;

        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${startLon},${startLat};${endLon},${endLat}` +
          `?overview=full&geometries=geojson`;

        const response =
          await fetch(url);

        if (!response.ok) {
          throw new Error(
            "Error de red"
          );
        }

        const data =
          await response.json();

        const route =
          data.routes?.[0];

        if (!route) {
          throw new Error(
            "NoRoute"
          );
        }

        /* =================================
           COORDENADAS
        ================================= */

        const coordinates:
          [number, number][] =
          route.geometry.coordinates.map(
            (
              [
                longitude,
                latitude,
              ]: [
                number,
                number
              ]
            ) => [
              latitude,
              longitude,
            ]
          );

        const L = window.L;

        if (
          !L ||
          !mapRef.current
        ) {
          throw new Error(
            "Leaflet no disponible"
          );
        }

        /* =================================
           ELIMINAR RUTA ANTERIOR
        ================================= */

        routeLayerRef.current?.remove();

        startMarkerRef.current?.remove();

        endMarkerRef.current?.remove();

        /* =================================
           CREAR RUTA
        ================================= */

        const routeLayer =
          L.polyline(
            coordinates,
            {
              weight: 6,
            }
          ).addTo(
            mapRef.current
          );

        /*
         * Ahora routeLayer es
         * LeafletPolyline.
         */
        routeLayerRef.current =
          routeLayer;

        /* =================================
           MARCADOR INICIAL
        ================================= */

        startMarkerRef.current =
          L.circleMarker(
            selectedStop.coordinates,
            {
              radius: 9,
            }
          ).addTo(
            mapRef.current
          );

        /* =================================
           MARCADOR FINAL
        ================================= */

        endMarkerRef.current =
          L.circleMarker(
            selectedDestination.coordinates,
            {
              radius: 9,
            }
          ).addTo(
            mapRef.current
          );

        /* =================================
           CENTRAR MAPA
        ================================= */

        mapRef.current.fitBounds(
          routeLayer.getBounds(),
          {
            padding: [30, 30],
          }
        );

        /* =================================
           DISTANCIA
        ================================= */

        const distanceKm =
          (
            route.distance / 1000
          ).toFixed(2);

        /* =================================
           TIEMPO
        ================================= */

        const durationMin =
          Math.round(
            route.duration / 60
          );

        setMessage(
          `Ruta encontrada: ${distanceKm} km · aproximadamente ${durationMin} min.`
        );
      } catch {
        setMessage(
          "No se pudo encontrar una ruta entre esos puntos."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================
     LIMPIAR
  ========================================= */

  const handleClearRoute =
    () => {
      routeLayerRef.current?.remove();

      startMarkerRef.current?.remove();

      endMarkerRef.current?.remove();

      routeLayerRef.current =
        null;

      startMarkerRef.current =
        null;

      endMarkerRef.current =
        null;

      mapRef.current?.setView(
        SUCRE_CENTER,
        14
      );

      setMessage(
        "Ruta limpiada. Selecciona una parada y un destino."
      );
    };

  /* =========================================
     UBICACIÓN
  ========================================= */

  const handleUseLocation =
    () => {
      if (
        !navigator.geolocation
      ) {
        setMessage(
          "Tu navegador no permite obtener la ubicación."
        );

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapRef.current?.setView(
            [
              position.coords
                .latitude,

              position.coords
                .longitude,
            ],
            16
          );

          setMessage(
            "Mapa centrado en tu ubicación."
          );
        },
        () => {
          setMessage(
            "No se pudo obtener tu ubicación. Revisa los permisos del navegador."
          );
        }
      );
    };

  /* =========================================
     HTML
  ========================================= */

  return (
    <section
      className="route-map"
      aria-label="Buscador de rutas"
    >
      {/* PANEL IZQUIERDO */}

      <aside className="route-map__steps">

        <p className="route-map__intro">
          BUSCA LA PARADA MÁS CERCANA
          Y DONDE QUIERES IR.
        </p>

        {/* PASO 1 */}

        <div className="route-step">

          <span>
            PASO 1
          </span>

          <label htmlFor="stop">
            SELECCIONA LA PARADA
          </label>

          <select
            id="stop"
            value={stopId}
            onChange={(event) =>
              setStopId(
                event.target.value
              )
            }
          >
            {stops.map(
              (stop) => (
                <option
                  key={stop.id}
                  value={stop.id}
                >
                  {stop.name}
                </option>
              )
            )}
          </select>

        </div>

        {/* PASO 2 */}

        <div className="route-step">

          <span>
            PASO 2
          </span>

          <label htmlFor="destination">
            SELECCIONA EL DESTINO
          </label>

          <select
            id="destination"
            value={destinationId}
            onChange={(event) =>
              setDestinationId(
                event.target.value
              )
            }
          >
            {destinations.map(
              (destination) => (
                <option
                  key={
                    destination.id
                  }
                  value={
                    destination.id
                  }
                >
                  {destination.name}
                </option>
              )
            )}
          </select>

        </div>

        {/* PASO 3 */}

        <div className="route-step route-step--actions">

          <span>
            PASO 3
          </span>

          <button
            type="button"
            onClick={
              handleSearchRoute
            }
            disabled={loading}
          >
            {loading
              ? "BUSCANDO..."
              : "BUSCAR RUTA"}
          </button>

          <button
            type="button"
            className="route-map__secondary-button"
            onClick={
              handleUseLocation
            }
          >
            📍 USAR MI UBICACIÓN
          </button>

          <button
            type="button"
            className="route-map__secondary-button"
            onClick={
              handleClearRoute
            }
          >
            LIMPIAR
          </button>

        </div>

      </aside>

      {/* MAPA */}

      <div className="route-map__map-wrapper">

        <div className="route-map__toolbar">

          <strong>
            {selectedStop.name}
            {" → "}
            {
              selectedDestination.name
            }
          </strong>

          <span>
            {message}
          </span>

        </div>

        <div
          ref={mapElementRef}
          className="route-map__map"
        />

        <p className="route-map__hint">
          Mueve el mapa, usa zoom y
          pulsa “BUSCAR RUTA” para
          dibujar el recorrido.
          © OpenStreetMap contributors
        </p>

      </div>
    </section>
  );
}