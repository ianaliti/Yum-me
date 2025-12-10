<template>
  <section class="space-y-4 pt-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-[#003459]">Ici, on te respecte</h2>

      <button
        class="text-foreground/40 text-sm font-medium hover:text-foreground/60 transition-colors"
        @click="handleSeeAll"
      >
        Tous voir
      </button>
    </div>

    <!-- Restaurants Horizontal Scroll -->
    <div class="relative -mx-4">
      <div class="overflow-x-auto px-4 scrollbar-hide">
        <div class="flex gap-4 pb-2">
          <HomeRestaurantCard
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            :restaurant="restaurant"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const restaurantStore = useRestaurantStore();

const restaurants = computed(() => {
  // Afficher seulement les 5 premiers restaurants
  return restaurantStore.restaurants.slice(0, 5);
});

const handleSeeAll = () => {
  // TODO: Naviguer vers la page avec tous les restaurants
  navigateTo("/restaurants");
};
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
