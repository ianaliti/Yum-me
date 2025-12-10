<template>
  <div class="shrink-0 w-72 cursor-pointer group" @click="handleClick">
    <!-- Image Container -->
    <div class="relative w-full h-44 rounded-3xl overflow-hidden mb-3">
      <img
        :src="restaurant.image"
        :alt="restaurant.name"
        class="w-full h-full object-cover duration-300 group-hover:scale-105"
      />
    </div>

    <!-- Info -->
    <div class="space-y-1">
      <!-- Name -->
      <h3 class="text-lg font-semibold text-foreground line-clamp-1">
        {{ restaurant.name }}
      </h3>

      <!-- Distance & Rating -->
      <div class="flex items-center gap-2 text-sm">
        <span class="text-foreground/60">{{ distance }}</span>
        <span class="text-foreground/60">•</span>
        <div class="flex items-center gap-1">
          <span class="text-yellow-500">⭐</span>
          <span class="text-foreground/60">{{ restaurant.rating }} avis</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Restaurant } from "@/types/restaurant";

interface Props {
  restaurant: Restaurant;
}

const props = defineProps<Props>();

// TODO: Calculer la vraie distance basée sur la géolocalisation
const distance = computed(() => {
  // Pour l'instant, distance mockée
  const distances = ["1.0 km", "500 m", "2.5 km", "800 m", "1.5 km"];
  return distances[Math.floor(Math.random() * distances.length)];
});

const handleClick = () => {
  // TODO: Naviguer vers la page de détail du restaurant ou ouvrir la bottom sheet
  console.log("Restaurant clicked:", props.restaurant.id);
};
</script>
