<template>
  <div class="flex flex-col h-screen w-full p-6">
    <div class="max-w-4xl mx-auto w-full">
      <h1 class="text-3xl font-bold text-foreground mb-4">
        Mes adresses sauvegardées
      </h1>
      <p class="text-foreground/60">
        Retrouvez ici tous vos restaurants favoris
      </p>

      <div class="mt-8 text-center py-12">
        <IconBookmark :size="64" class="mx-auto mb-4 text-foreground/30" />
        <p class="text-foreground/60">
          Vous n'avez pas encore sauvegardé de restaurants
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconBookmark from '@/components/icons/IconBookmark.vue';

definePageMeta({
  layout: 'app',
});

useHead({
  title: 'Mes adresses - Yum\'me',
  meta: [
    { name: 'description', content: 'Vos restaurants sauvegardés' },
  ],
});
</script>
