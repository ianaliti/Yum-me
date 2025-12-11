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
            Localisation actuelle
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
import { toast } from "vue-sonner";
import IconMap from "@/components/icons/IconMap.vue";
import IconNotification from "@/components/icons/IconNotification.vue";

const geolocationStore = useGeolocationStore();
const { reverseGeocode, addressCache } = useReverseGeocode();

const displayLocation = computed(() => {
  // Si on a une adresse en cache, l'afficher
  if (addressCache.value) {
    return addressCache.value;
  }

  // Si la géolocalisation est prête et qu'on a une position réelle
  if (geolocationStore.mapReady && geolocationStore.isRealLocation) {
    return "Chargement...";
  }

  // Sinon, afficher l'adresse par défaut (Annecy)
  return "14 Av. du Rhône, 74000 Annecy";
});

const hasNotifications = ref(true); // TODO: Connecter au système de notifications

const handleLocationClick = () => {
  toast("Fonctionnalité non disponible", {
    description: "Le changement de localisation sera bientôt disponible.",
  });
};

const handleNotificationClick = () => {
  toast("Fonctionnalité non disponible", {
    description: "Les notifications seront bientôt disponibles.",
  });
};

// Faire le reverse geocoding au montage si on a une position
onMounted(async () => {
  if (geolocationStore.mapReady && geolocationStore.isRealLocation) {
    const [lng, lat] = geolocationStore.center;
    await reverseGeocode(lng, lat);
  }
});

// Watcher pour mettre à jour l'adresse quand la position change
watch(
  () => geolocationStore.center,
  async (newCenter) => {
    if (geolocationStore.isRealLocation) {
      const [lng, lat] = newCenter;
      await reverseGeocode(lng, lat);
    }
  },
  { deep: true }
);
</script>
