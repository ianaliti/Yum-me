<template>
  <div class="flex flex-col h-full w-full overflow-y-auto bg-background">
    <!-- Header -->
    <EventsHeader :user="currentUser" />

    <!-- Main Content -->
    <main class="flex-1 space-y-6 pb-32">
      <!-- Friends Section -->
      <EventsFriendsSection />

      <!-- Groups Section -->
      <EventsGroupsSection />
    </main>

    <!-- Create Button -->
    <EventsCreateButton />
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/event';

definePageMeta({
  layout: "app",
});

useHead({
  title: "Ensemble - Yum'me",
  meta: [
    {
      name: "description",
      content: "Partagez des moments avec vos amis",
    },
  ],
});

// Mock user - À remplacer par un vrai store user plus tard
const currentUser: User = {
  id: '1',
  name: 'Younes Boualam',
  firstName: 'Younes',
  avatar: 'https://i.pravatar.cc/150?img=12',
  hasUnreadNotifications: true,
};
</script>
