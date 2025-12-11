<template>
  <Sheet :open="isOpen" @update:open="handleOpenChange">
    <SheetContent
      side="bottom"
      class="rounded-t-3xl max-h-[70vh] overflow-hidden p-0 border-0"
      :showClose="false"
    >
      <!-- Handle bar -->
      <div class="flex justify-center pt-3 pb-2">
        <div class="w-12 h-1 bg-muted-foreground/20 rounded-full" />
      </div>

      <!-- Content -->
      <div
        v-if="selectedRestaurant"
        class="flex flex-col h-[calc(70vh-2rem)] pb-safe"
      >
        <!-- Contenu scrollable -->
        <div class="flex-1 overflow-y-auto">
          <!-- Image -->
          <div class="relative h-48 w-full px-4">
            <img
              :src="selectedRestaurant.image"
              :alt="selectedRestaurant.name"
              class="w-full h-full object-cover rounded-2xl"
            />

            <!-- Badge promo -->
            <Badge
              v-if="selectedRestaurant.priceRange === '$$'"
              class="absolute top-3 right-6 bg-primary text-primary-foreground"
            >
              -15 % avec YUM15
            </Badge>
          </div>

          <!-- Info -->
          <div class="p-6 space-y-4">
            <!-- Header -->
            <SheetHeader class="text-left p-0">
              <SheetTitle class="text-xl font-semibold text-foreground">
                {{ selectedRestaurant.name }}
              </SheetTitle>

              <!-- Rating -->
              <SheetDescription class="flex items-center gap-1.5 text-sm">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-base"
                  :class="
                    star <= Math.floor(selectedRestaurant.rating)
                      ? 'text-amber-400'
                      : 'text-muted-foreground/20'
                  "
                >
                  ★
                </span>
                <span class="text-muted-foreground ml-1">{{
                  selectedRestaurant.rating
                }}</span>
              </SheetDescription>
            </SheetHeader>

            <!-- Quick info row -->
            <div
              class="flex items-center justify-between text-sm text-muted-foreground"
            >
              <div class="flex items-center gap-1.5">
                <MapPin class="w-4 h-4" />
                <span>{{ selectedRestaurant.city }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Clock class="w-4 h-4" />
                <span
                  >{{ selectedRestaurant.hours.open }} -
                  {{ selectedRestaurant.hours.close }}</span
                >
              </div>
              <a
                :href="`tel:${selectedRestaurant.phone}`"
                class="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Phone class="w-4 h-4" />
                <span>Appeler</span>
              </a>
            </div>

            <!-- Dietary Options -->
            <div v-if="selectedRestaurant.dietaryOptions.length" class="mt-8">
              <h3 class="text-sm font-semibold mb-2">
                Compatibilité avec ton régime
              </h3>
              <div class="flex flex-wrap gap-1.5">
                <Badge
                  v-for="option in selectedRestaurant.dietaryOptions"
                  :key="option"
                  variant="secondary"
                  class="bg-secondary text-secondary-foreground text-xs py-1.5! px-2.5! font-normal border-0"
                >
                  {{ getDietaryOptionLabel(option) }}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton Itinéraire tout en bas -->
        <div class="p-6 pt-4">
          <Button
            @click="handleDirections"
            :disabled="!userLocationAvailable || isLoading"
            variant="default"
            size="xl"
            class="w-full"
          >
            <span v-if="isLoading">Calcul en cours...</span>
            <span v-else>Tracer l'itinéraire</span>
            <Loader2 v-if="isLoading" class="w-5 h-5 mr-2 animate-spin" />
          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { MapPin, Clock, Phone, Navigation, Loader2 } from "lucide-vue-next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dietaryOptionLabels, type DietaryOption } from "~/types/restaurant";

const { isOpen, selectedRestaurant, closeSheet } = useRestaurantSheet();
const geolocationStore = useGeolocationStore();
const { fetchDirections, drawRouteOnMap, activeRoute } = useDirections();

// Variable locale pour contrôler le loading avec délai minimum de 2s
const isLoading = ref(false);

// Inject map instance, searchQuery et fonctions markers depuis la page restaurants.vue
const mapInstance = inject<Ref<any>>("mapInstance");
const searchQuery = inject<Ref<string>>("searchQuery");
const hideAllMarkersExcept = inject<(restaurantId: string) => void>(
  "hideAllMarkersExcept"
);
const showAllMarkers = inject<() => void>("showAllMarkers");

// Vérifier si la position utilisateur est réelle (pas la position par défaut)
const userLocationAvailable = computed(() => geolocationStore.isRealLocation);

// Fonction pour obtenir le label français d'une option alimentaire
function getDietaryOptionLabel(option: DietaryOption): string {
  return dietaryOptionLabels[option] || option;
}

async function handleDirections() {
  if (!selectedRestaurant.value || !mapInstance?.value) return;

  // Vider le champ de recherche
  if (searchQuery) {
    searchQuery.value = "";
  }

  // Masquer tous les markers sauf celui du restaurant concerné
  if (hideAllMarkersExcept) {
    hideAllMarkersExcept(selectedRestaurant.value.id);
  }

  const origin = geolocationStore.center;
  const destination = [
    selectedRestaurant.value.coordinates.lng,
    selectedRestaurant.value.coordinates.lat,
  ] as [number, number];

  // Activer le loading
  isLoading.value = true;

  // Démarrer le timer pour afficher le loading au minimum 2s
  const startTime = Date.now();

  await fetchDirections(origin, destination);

  // Attendre que 2s se soient écoulées au minimum
  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, 2000 - elapsedTime);

  if (remainingTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, remainingTime));
  }

  // Désactiver le loading après le délai minimum
  isLoading.value = false;

  // Dessiner sur la map
  if (mapInstance.value && activeRoute.value) {
    drawRouteOnMap(mapInstance.value, activeRoute.value.geometry);
  }

  // Fermer le sheet après avoir calculé l'itinéraire
  closeSheet();
}

function handleOpenChange(open: boolean) {
  if (!open) {
    closeSheet();
  }
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
