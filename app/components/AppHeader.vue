<template>
  <header class="w-full px-4 pt-3 pb-4">
    <div class="flex items-start justify-between">
      <!-- Location Section -->
      <button
        class="flex items-start gap-3 flex-1 transition-opacity hover:opacity-80"
        @click="handleLocationClick"
      >
        <!-- Map Icon -->
        <div class="shrink-0 mt-1">
          <IconMap :size="32" color="#003459" />
        </div>

        <!-- Location Text -->
        <div class="flex flex-col items-start text-left">
          <span class="text-sm text-foreground/60 flex items-center gap-1">
            Location actuel
            <ChevronDown :size="16" class="text-foreground/60" />
          </span>
          <span class="text-base font-semibold text-[#003459] line-clamp-1">
            {{ displayLocation }}
          </span>
        </div>
      </button>

      <!-- Notification Button -->
      <button
        class="relative shrink-0 top-1 p-2 transition-opacity hover:opacity-80"
        @click="handleNotificationClick"
      >
        <IconNotification :size="24" color="#003459" />

        <!-- Notification Badge -->
        <span
          v-if="hasNotifications"
          class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"
        />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
import IconMap from "@/components/icons/IconMap.vue";
import IconNotification from "@/components/icons/IconNotification.vue";

const geolocationStore = useGeolocationStore();

const displayLocation = computed(() => {
  // TODO: Implémenter le reverse geocoding pour obtenir l'adresse
  // Pour l'instant, on affiche un placeholder
  return "Annecy, 2 place pérous..";
});

const hasNotifications = ref(true); // TODO: Connecter au système de notifications

const handleLocationClick = () => {
  // TODO: Ouvrir un modal/bottom sheet pour changer la location
  console.log("Location clicked");
};

const handleNotificationClick = () => {
  // TODO: Naviguer vers la page des notifications
  console.log("Notification clicked");
};
</script>
