<template>
  <div class="space-y-4 animate-fade-in-up" style="animation-delay: 0.1s">
    <!-- Header -->
    <div class="px-4">
      <h2 class="text-lg font-bold text-foreground">
        Vos récents groupe
      </h2>
    </div>

    <!-- Groups List - Vertical -->
    <div class="px-4 space-y-4">
      <EventsGroupCard
        v-for="group in events"
        :key="group.id"
        :group="group"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center px-4 py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>

    <!-- Error State -->
    <div v-if="error" class="px-4 py-4 text-center text-sm text-destructive">
      Erreur lors du chargement des groupes
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && events.length === 0" class="px-4 py-8 text-center text-sm text-muted-foreground">
      Aucun groupe pour le moment
    </div>
  </div>
</template>

<script setup lang="ts">
const { events, loading, error, fetchEvents } = useEvents();

// Charger les événements au montage
onMounted(async () => {
  await fetchEvents();
});
</script>
