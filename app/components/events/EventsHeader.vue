<template>
  <div class="flex items-center justify-between p-4">
    <!-- Avatar + Greeting -->
    <div class="flex items-center gap-3">
      <img
        :src="user.avatar"
        :alt="user.name"
        class="w-14 h-14 rounded-full object-cover border-2 border-border"
      />
      <h1 class="text-xl font-semibold text-foreground">
        Salut, {{ user.firstName }}
      </h1>
    </div>

    <!-- Notification Icon -->
    <button
      class="relative p-2 hover:opacity-80 transition-opacity"
      aria-label="Notifications"
    >
      <IconNotification :size="24" color="#003459" />

      <!-- Badge for unread notifications -->
      <span
        v-if="user.hasUnreadNotifications"
        class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import IconNotification from '@/components/icons/IconNotification.vue';
import type { User } from '~/types/event';

interface Props {
  user: User;
}

defineProps<Props>();
</script>
