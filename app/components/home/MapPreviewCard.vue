<template>
  <div class="relative w-full h-52 rounded-3xl overflow-hidden">
    <!-- Map Background -->
    <div class="absolute inset-0">
      <img
        src="/home/map-preview.png"
        alt="Carte preview"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Button (bottom right) -->
    <div class="absolute bottom-6 right-6 z-10">
      <Button
        variant="rounded"
        size="lg"
        class="shadow-lg"
        @click="handleFindRestaurant"
      >
        Retrouve ton restaurant
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";

const handleFindRestaurant = () => {
  toast("Fonctionnalité non disponible", {
    description: "La recherche avancée de restaurants sera bientôt disponible.",
  });
};
</script>
