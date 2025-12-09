<template>
  <div class="flex flex-col h-screen w-full">
    <!-- Map Container -->
    <main class="flex-1 relative overflow-hidden">
      <!-- Loader pendant la géolocalisation -->
      <OnboardingLocationLoader v-if="!mapReady" />

      <!-- Map -->
      <MapboxMap
        v-else
        map-id="mainMap"
        :options="mapOptions"
        @load="activateGeolocateControl"
        class="w-full h-full"
      >
        <MapboxNavigationControl position="top-right" />

        <!-- Control de géolocalisation -->
        <MapboxGeolocateControl
          position="top-right"
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

      <!-- Bottom Sheet -->
      <RestaurantBottomSheet />
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app",
});

// Utiliser le composable de géolocalisation
const { mapReady, mapOptions, getUserPosition, activateGeolocateControl } =
  useGeolocation();

// Charger les restaurants depuis l'API
const { restaurants: apiRestaurants, loading, error } = useRestaurants();
const { openSheet } = useRestaurantSheet();

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

// Demander la position au chargement
onMounted(() => {
  getUserPosition();
});

useHead({
  title: "Yum-me",
  meta: [
    { name: "description", content: "Découvrez les meilleurs restaurants" },
  ],
});
</script>
