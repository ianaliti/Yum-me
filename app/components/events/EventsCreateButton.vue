<template>
  <button
    @click="handleCreate"
    class="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-14 h-14 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
    aria-label="Créer un nouveau groupe"
  >
    <Plus :size="28" class="text-primary-foreground" />
  </button>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

const handleCreate = () => {
  // TODO: Ouvrir un modal ou naviguer vers la page de création
  console.log('Créer un nouveau groupe');
};
</script>
