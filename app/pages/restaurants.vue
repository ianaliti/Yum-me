<template>
  <div class="flex flex-col h-full w-full">
    <!-- Map Container -->
    <main class="flex-1 relative overflow-hidden">
      <!-- Map -->
      <MapboxMap
        v-if="mapReady"
        map-id="mainMap"
        :options="mapOptions"
        @load="onMapLoad"
        class="w-full h-full"
      >
        <!-- Mapbox Controls -->
        <!-- <MapboxNavigationControl position="top-right" /> -->

        <!-- Geolocate Control caché (pour afficher le point bleu) -->
        <!-- On le garde pour la fonctionnalité mais on le cache avec du CSS -->
        <MapboxGeolocateControl
          position="top-right"
          :track-user-location="true"
          :show-user-location="true"
          style="visibility: hidden; opacity: 0; pointer-events: none"
        />

        <MapboxDefaultMarker
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          :marker-id="`marker-${restaurant.id}`"
          :lnglat="restaurant.coordinates"
          :options="{ element: restaurant.element }"
        />
      </MapboxMap>

      <!-- Custom Search Bar -->
      <div v-if="mapReady" class="absolute top-4 left-0 right-0 z-10">
        <MapSearchBar
          v-model="searchQuery"
          :show-filters="true"
          :show-settings="false"
          :autofocus="shouldAutofocus"
          @filter="handleFilterClick"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
          @submit="handleSearchSubmit"
        />

        <!-- Autocomplete Results -->
        <MapSearchAutocomplete
          :visible="isAutocompleteVisible"
          :results="searchResults"
          :loading="isSearching"
          @select="handleRestaurantSelect"
        />
      </div>

      <!-- Bouton géolocalisation custom -->
      <button
        v-if="mapReady"
        @click="handleGeolocateClick"
        class="absolute top-22 right-4 z-[1] bg-white shadow-lg rounded-lg p-2.5 border border-border hover:bg-muted transition-colors"
        aria-label="Me localiser"
      >
        <LocateIcon class="w-5 h-5 text-foreground" />
      </button>

      <!-- Route Badges -->
      <MapRouteBadge
        v-if="activeRoute"
        :distance="formattedDistance"
        :duration="formattedDuration"
        :visible="true"
        class="absolute bottom-24 left-4 z-10"
      />

      <!-- Bouton fermer route à droite -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-4"
      >
        <button
          v-if="activeRoute"
          @click="handleCloseRoute"
          class="absolute bottom-24 right-4 z-10 bg-white shadow-lg rounded-full p-3 border border-border hover:bg-muted transition-colors"
          aria-label="Fermer l'itinéraire"
        >
          <XIcon class="w-5 h-5 text-primary" />
        </button>
      </Transition>

      <!-- Bottom Sheet -->
      <RestaurantBottomSheet />
    </main>
  </div>
</template>

<script setup lang="ts">
import { X as XIcon, Locate as LocateIcon } from "lucide-vue-next";
import mapboxgl from "mapbox-gl";

definePageMeta({
  layout: "app",
});

// Utiliser les stores directement pour un meilleur contrôle du cache
const geolocationStore = useGeolocationStore();
const restaurantStore = useRestaurantStore();
const { isOpen, selectedRestaurant, openSheet } = useRestaurantSheet();

// Directions
const { activeRoute, formattedDistance, formattedDuration, clearRoute } =
  useDirections();

// Utiliser le composable pour les options de la map
const { mapOptions, activateGeolocateControl } = useGeolocation();

// Computed properties pour les restaurants et le chargement
const apiRestaurants = computed(() => restaurantStore.restaurants);
const loading = computed(() => restaurantStore.loading);
const error = computed(() => restaurantStore.error);
const mapReady = computed(() => geolocationStore.mapReady);

// Search
const route = useRoute();
const searchQuery = ref("");
const config = useRuntimeConfig();
const mapInstance = ref<any>(null);
const shouldAutofocus = computed(() => route.query.focus === "true");

// Tracker le restaurant focusé et les éléments des markers
const focusedRestaurantId = ref<string | null>(null);
const markerElements = new Map<string, { wrapper: HTMLElement; img: HTMLElement }>();

// Restaurant search composable
const {
  searchResults,
  isSearching,
  isAutocompleteVisible,
  debouncedSearch,
  clearSearch,
  hideAutocomplete,
  showAutocomplete,
} = useRestaurantSearch();

const handleFilterClick = () => {
  // TODO: Ouvrir le panel de filtres
};

const handleSearchFocus = () => {
  showAutocomplete();
};

const handleSearchBlur = () => {
  // Délai pour permettre le clic sur un résultat
  setTimeout(() => {
    hideAutocomplete();
  }, 200);
};

const handleSearchSubmit = async (query: string) => {
  // Si on a des résultats de recherche de restaurants, zoomer sur tous les résultats
  if (searchResults.value.length > 0) {
    zoomToRestaurants(searchResults.value);
    hideAutocomplete();
    return;
  }

  // Sinon, rechercher une ville comme avant
  try {
    const mapboxToken = config.public.mapboxAccessToken;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${mapboxToken}&types=place,locality&limit=1`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;

      // Déplacer la carte vers la ville trouvée avec zoom plus puissant
      if (mapInstance.value) {
        mapInstance.value.flyTo({
          center: [lng, lat],
          zoom: 14,
          duration: 2000,
        });
      }
    }
  } catch (error) {
    console.error("Erreur de géocodage:", error);
  }
};

const handleRestaurantSelect = (restaurant: any) => {
  // Fermer l'autocomplétion
  hideAutocomplete();

  // Retirer le focus de l'ancien marker
  if (focusedRestaurantId.value) {
    updateMarkerFocus(focusedRestaurantId.value, false);
  }

  // Appliquer le focus au nouveau marker
  focusedRestaurantId.value = restaurant.id;
  updateMarkerFocus(restaurant.id, true);

  // Déplacer la carte vers le restaurant
  if (mapInstance.value) {
    mapInstance.value.flyTo({
      center: [restaurant.coordinates.lng, restaurant.coordinates.lat],
      zoom: 16,
      duration: 1500,
    });
  }
};

const zoomToRestaurants = (restaurants: any[]) => {
  if (!mapInstance.value || restaurants.length === 0) return;

  if (restaurants.length === 1) {
    // Si un seul restaurant, zoomer dessus
    const restaurant = restaurants[0];
    mapInstance.value.flyTo({
      center: [restaurant.coordinates.lng, restaurant.coordinates.lat],
      zoom: 16,
      duration: 1500,
    });
    openSheet(restaurant);
  } else {
    // Si plusieurs restaurants, calculer les bounds pour tous les afficher
    const bounds = new mapboxgl.LngLatBounds();

    restaurants.forEach((restaurant) => {
      bounds.extend([restaurant.coordinates.lng, restaurant.coordinates.lat]);
    });

    mapInstance.value.fitBounds(bounds, {
      padding: { top: 100, bottom: 400, left: 50, right: 50 },
      duration: 1500,
      maxZoom: 15,
    });
  }
};

// Watcher pour déclencher la recherche quand l'utilisateur tape
watch(searchQuery, (newQuery) => {
  if (newQuery.trim().length >= 2) {
    debouncedSearch(newQuery);
  } else {
    clearSearch();
  }
});

// Fonction pour mettre à jour le focus d'un marker
const updateMarkerFocus = (restaurantId: string, isFocused: boolean) => {
  const elements = markerElements.get(restaurantId);
  if (elements) {
    if (isFocused) {
      elements.img.style.transform = "scale(1.7)";
    } else {
      elements.img.style.transform = "scale(1)";
    }
  }
};

// Fonction pour masquer tous les markers sauf un
const hideAllMarkersExcept = (restaurantId: string) => {
  markerElements.forEach((elements, id) => {
    if (id !== restaurantId) {
      elements.wrapper.style.display = "none";
    }
  });
};

// Fonction pour afficher tous les markers
const showAllMarkers = () => {
  markerElements.forEach((elements) => {
    elements.wrapper.style.display = "block";
  });
};

// Créer un élément image pour le marker custom
const createCustomMarkerElement = (restaurant: any) => {
  const wrapper = document.createElement("div");
  wrapper.style.width = "28px";
  wrapper.style.height = "28px";
  wrapper.style.cursor = "pointer";

  const img = document.createElement("img");
  img.src = "/markers/restaurant-marker.png";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.display = "block";
  img.style.transition = "transform 0.2s ease";

  wrapper.appendChild(img);

  // Stocker la référence
  markerElements.set(restaurant.id, { wrapper, img });

  // Hover effect
  wrapper.addEventListener("mouseenter", () => {
    if (focusedRestaurantId.value !== restaurant.id) {
      img.style.transform = "scale(1.15)";
    }
  });
  wrapper.addEventListener("mouseleave", () => {
    if (focusedRestaurantId.value !== restaurant.id) {
      img.style.transform = "scale(1)";
    }
  });

  // Click to open sheet
  wrapper.addEventListener("click", () => {
    openSheet(restaurant);
  });

  return wrapper;
};

// Transformer les restaurants pour la carte Mapbox
const restaurants = computed(() => {
  return apiRestaurants.value.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
    coordinates: [restaurant.coordinates.lng, restaurant.coordinates.lat] as [
      number,
      number
    ],
    element: createCustomMarkerElement(restaurant),
  }));
});

// Map load handler
const onMapLoad = (map: any) => {
  mapInstance.value = map;
  activateGeolocateControl(map);

  // Retirer le focus quand on clique sur la map (en dehors d'un marker)
  map.on("click", () => {
    if (focusedRestaurantId.value) {
      updateMarkerFocus(focusedRestaurantId.value, false);
      focusedRestaurantId.value = null;
    }
  });
};

// Handler pour fermer la route manuellement
const handleCloseRoute = () => {
  if (mapInstance.value) {
    clearRoute(mapInstance.value);
  }
  // Réafficher tous les markers
  showAllMarkers();
};

// Handler pour le bouton de géolocalisation
const handleGeolocateClick = async () => {
  const debugStore = useGeolocationDebugStore();

  debugStore.info('🔵 Click sur bouton géolocalisation');

  // IMPORTANT: Appeler getUserPosition(true) directement depuis le click handler
  // pour respecter le user gesture requis par Safari iOS
  const result = await geolocationStore.getUserPosition(true);

  if (result.success && mapInstance.value) {
    debugStore.success('✅ Position obtenue → Déplacement de la map');
    // Déplacer la map vers la nouvelle position
    mapInstance.value.flyTo({
      center: geolocationStore.center,
      zoom: 15,
      duration: 1500,
    });
  } else {
    debugStore.error('❌ Échec géolocalisation depuis bouton', { error: result.error });
  }
};

// Provide map instance, searchQuery et fonctions markers pour l'injection dans RestaurantBottomSheet
provide("mapInstance", mapInstance);
provide("searchQuery", searchQuery);
provide("hideAllMarkersExcept", hideAllMarkersExcept);
provide("showAllMarkers", showAllMarkers);

// Auto-clear route seulement quand on sélectionne un AUTRE restaurant (pas quand on ferme)
watch(selectedRestaurant, (newRestaurant, oldRestaurant) => {
  // Ne rien faire si on ferme juste le sheet (newRestaurant devient null)
  if (!newRestaurant) return;

  // Effacer la route seulement si on sélectionne un restaurant différent
  if (
    oldRestaurant &&
    newRestaurant.id !== oldRestaurant.id &&
    activeRoute.value &&
    mapInstance.value
  ) {
    clearRoute(mapInstance.value);
    // Réafficher tous les markers
    showAllMarkers();
  }
});

// Charger les données au montage
// NOTE: On ne demande PAS la géolocalisation ici car ce n'est pas un user gesture
// L'utilisateur devra cliquer sur le bouton de géolocalisation
onMounted(async () => {
  await restaurantStore.fetchRestaurants();
});

useHead({
  title: "Yum-me",
  meta: [
    { name: "description", content: "Découvrez les meilleurs restaurants" },
  ],
});
</script>

<style>
/* Cacher le contrôle de géolocalisation Mapbox natif */
.mapboxgl-ctrl-geolocate {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}
</style>
