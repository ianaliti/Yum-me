<template>
  <div class="flex flex-col h-screen w-full">
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

        <!-- Geolocate Control pour afficher le point bleu -->
        <MapboxGeolocateControl
          position="bottom-right"
          :track-user-location="true"
          :show-user-location="true"
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
          @submit="handleSearchSubmit"
        />
      </div>

      <!-- Bottom Sheet -->
      <RestaurantBottomSheet />
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app",
});

// Utiliser les stores directement pour un meilleur contrôle du cache
const geolocationStore = useGeolocationStore();
const restaurantStore = useRestaurantStore();
const { openSheet } = useRestaurantSheet();

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

const handleFilterClick = () => {
  // TODO: Ouvrir le panel de filtres
};

const handleSearchFocus = () => {
  // TODO: Afficher les suggestions
};

const handleSearchSubmit = async (query: string) => {
  try {
    const mapboxToken = config.public.mapboxAccessToken;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&types=place,locality&limit=1`
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

  // Hover effect
  wrapper.addEventListener("mouseenter", () => {
    img.style.transform = "scale(1.15)";
  });
  wrapper.addEventListener("mouseleave", () => {
    img.style.transform = "scale(1)";
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
};

// Demander la position au chargement
onMounted(async () => {
  // Charger les données depuis le cache ou l'API
  await Promise.all([
    geolocationStore.getUserPosition(),
    restaurantStore.fetchRestaurants(),
  ]);
});

useHead({
  title: "Yum-me",
  meta: [
    { name: "description", content: "Découvrez les meilleurs restaurants" },
  ],
});
</script>
