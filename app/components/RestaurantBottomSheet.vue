<template>
  <Sheet :open="isOpen" @update:open="handleOpenChange">
    <SheetContent
      side="bottom"
      class="rounded-t-3xl max-h-[85vh] overflow-hidden p-0 border-0"
      :showClose="false"
    >
      <!-- Handle bar -->
      <div class="flex justify-center pt-3 pb-2">
        <div class="w-12 h-1 bg-muted-foreground/20 rounded-full" />
      </div>

      <!-- Content -->
      <div
        v-if="selectedRestaurant"
        class="overflow-y-auto max-h-[calc(85vh-2rem)] pb-safe"
      >
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
          <div class="flex items-center gap-4 text-sm text-muted-foreground">
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
          <div
            v-if="selectedRestaurant.dietaryOptions.length"
            class="flex flex-wrap gap-1.5"
          >
            <Badge
              v-for="option in selectedRestaurant.dietaryOptions"
              :key="option"
              variant="secondary"
              class="bg-primary/10 text-primary text-xs font-normal border-0"
            >
              {{ option }}
            </Badge>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { MapPin, Clock, Phone } from "lucide-vue-next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const { isOpen, selectedRestaurant, closeSheet } = useRestaurantSheet();

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
