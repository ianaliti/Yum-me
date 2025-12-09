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
          :options="{ color: restaurant.color }"
        />
      </MapboxMap>
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

// Simulation de restaurants depuis une base de données
const restaurants = ref([
  {
    id: 1,
    name: "Restaurant Annecy",
    coordinates: [6.1294, 45.8992],
    color: "#379287",
  },
  {
    id: 2,
    name: "Restaurant Poissy",
    coordinates: [2.0494, 48.9283],
    color: "#379287",
  },
]);

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
