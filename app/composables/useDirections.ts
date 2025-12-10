import type { RouteData, MapboxDirectionsResponse } from "~/types/directions";
import { formatDistance, formatDuration } from "~/utils/formatters";
import mapboxgl from "mapbox-gl";

export const useDirections = () => {
  const activeRoute = useState<RouteData | null>("activeRoute", () => null);
  const loading = useState<boolean>("directionsLoading", () => false);
  const error = useState<string | null>("directionsError", () => null);

  const config = useRuntimeConfig();

  const formattedDistance = computed(() => {
    if (!activeRoute.value) return "";
    return formatDistance(activeRoute.value.distance);
  });

  const formattedDuration = computed(() => {
    if (!activeRoute.value) return "";
    return formatDuration(activeRoute.value.duration);
  });

  const fetchDirections = async (
    origin: [number, number],
    destination: [number, number]
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const [originLng, originLat] = origin;
      const [destLng, destLat] = destination;

      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${originLng},${originLat};${destLng},${destLat}?geometries=geojson&access_token=${config.public.mapboxAccessToken}`;

      const response = await fetch(url);
      const data: MapboxDirectionsResponse = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        activeRoute.value = {
          geometry: route.geometry,
          distance: route.distance,
          duration: route.duration,
        };
      } else {
        error.value = "Impossible de calculer l'itinéraire";
        activeRoute.value = null;
      }
    } catch (err) {
      console.error("Erreur lors du calcul de l'itinéraire:", err);
      error.value = "Erreur réseau. Réessayez.";
      activeRoute.value = null;
    } finally {
      loading.value = false;
    }
  };

  const drawRouteOnMap = (map: any, geometry: GeoJSON.LineString) => {
    if (!map) return;

    // Supprimer l'ancienne route si elle existe
    if (map.getLayer("route-layer")) {
      map.removeLayer("route-layer");
    }
    if (map.getSource("route-source")) {
      map.removeSource("route-source");
    }

    // Ajouter la nouvelle route
    map.addSource("route-source", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: geometry,
      },
    });

    map.addLayer({
      id: "route-layer",
      type: "line",
      source: "route-source",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#007AFF",
        "line-width": 5,
        "line-opacity": 0.8,
      },
    });

    // Ajuster la vue pour montrer toute la route
    const coordinates = geometry.coordinates as [number, number][];
    if (coordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50, duration: 1000 });
    }
  };

  const clearRoute = (map: any) => {
    if (!map) return;

    // Supprimer la route de la carte
    if (map.getLayer("route-layer")) {
      map.removeLayer("route-layer");
    }
    if (map.getSource("route-source")) {
      map.removeSource("route-source");
    }

    // Réinitialiser l'état
    activeRoute.value = null;
    error.value = null;
  };

  return {
    activeRoute: readonly(activeRoute),
    loading: readonly(loading),
    error: readonly(error),
    formattedDistance,
    formattedDuration,
    fetchDirections,
    drawRouteOnMap,
    clearRoute,
  };
};
