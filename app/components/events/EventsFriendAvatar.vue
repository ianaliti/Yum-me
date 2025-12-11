<template>
  <div
    class="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer transition-transform active:scale-95"
    @click="handleClick"
  >
    <!-- Avatar -->
    <div class="relative">
      <img
        :src="friend.avatar"
        :alt="friend.name"
        class="w-16 h-16 rounded-full object-cover border-2 border-border"
      />
    </div>

    <!-- Name -->
    <span class="text-xs font-medium text-foreground text-center">
      {{ friend.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";
import type { Friend } from "~/types/event";

interface Props {
  friend: Friend;
}

const props = defineProps<Props>();

const handleClick = () => {
  toast("Fonctionnalité non disponible", {
    description: "Le profil des amis sera bientôt disponible.",
  });
};
</script>
