<template>
  <div class="flex flex-col h-screen w-full">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 p-4 shadow-sm z-10">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900">Yum-me</h1>
      </div>
    </header>

    <!-- Map Container -->
    <main class="flex-1 relative overflow-hidden">
      <!-- Loading state -->
      <div
        v-if="!mapReady"
        class="w-full h-full flex items-center justify-center bg-gray-100"
      >
        <div class="text-center space-y-3">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"
          />
          <p class="text-sm text-gray-600">Localisation en cours...</p>
        </div>
      </div>

      <!-- Map -->
      <MapboxMap
        v-else
        map-id="mainMap"
        :options="mapOptions"
        @load="activateGeolocateControl"
        class="w-full h-full"
      >
        <MapboxNavigationControl position="top-right" />
        <MapboxGeolocateControl
          position="top-right"
          :track-user-location="true"
          :show-user-location="true"
        />

        <!-- Marqueurs des restaurants -->
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
const { mapReady, mapOptions, getUserPosition, activateGeolocateControl } =
  useGeolocation();

// Simulation de restaurants depuis une base de données
const restaurants = ref([
  {
    id: 1,
    name: "Restaurant Annecy",
    coordinates: [6.1294, 45.8992],
    color: "#ef4444",
  },
  {
    id: 2,
    name: "Restaurant Poissy",
    coordinates: [2.0494, 48.9283],
    color: "#3b82f6",
  },
]);

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
