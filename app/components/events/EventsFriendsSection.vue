<template>
  <div class="space-y-4 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center justify-between px-4">
      <h2 class="text-lg font-bold text-foreground">
        Tous vos amis
      </h2>
      <button class="p-1 hover:bg-muted rounded-full transition-colors">
        <ChevronRight :size="20" class="text-foreground/60" />
      </button>
    </div>

    <!-- Friends List - Horizontal Scroll -->
    <div class="overflow-x-auto px-4 pb-2 scrollbar-hide">
      <div class="flex gap-4 min-w-max">
        <EventsFriendAvatar
          v-for="friend in friends"
          :key="friend.id"
          :friend="friend"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center px-4 py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>

    <!-- Error State -->
    <div v-if="error" class="px-4 py-4 text-center text-sm text-destructive">
      Erreur lors du chargement des amis
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && friends.length === 0" class="px-4 py-8 text-center text-sm text-muted-foreground">
      Aucun ami pour le moment
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';

const { friends, loading, error, fetchFriends } = useFriends();

// Charger les amis au montage
onMounted(async () => {
  await fetchFriends();
});
</script>
