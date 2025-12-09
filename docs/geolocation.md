# Réactiver la géolocalisation

Ce document explique comment réactiver la fonctionnalité de géolocalisation sur la page des restaurants.

## Pourquoi elle a été désactivée

La géolocalisation causait des problèmes de performance lors de la navigation entre les pages. Elle a été temporairement désactivée pour tester si le problème venait de la géolocalisation ou de Mapbox.

## Comment la réactiver

### 1. Dans `app/pages/restaurants.vue`

Remplacer le code actuel par :

```vue
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
```

### 2. Le composable `useGeolocation.ts` existe déjà

Le composable est déjà présent dans `app/composables/useGeolocation.ts` et contient toute la logique de géolocalisation.

### 3. Le loader existe déjà

Le composant `OnboardingLocationLoader.vue` est déjà créé dans `app/components/onboarding/LocationLoader.vue`.

## Notes

- La géolocalisation peut être lente selon la connexion et le navigateur
- Si les performances restent un problème, envisager de :
  - Charger la map d'abord avec une position par défaut
  - Demander la géolocalisation en arrière-plan
  - Mettre à jour la position une fois obtenue
- Optimisation possible : utiliser `watchPosition` au lieu de `getCurrentPosition` pour suivre l'utilisateur en temps réel
