<template>
  <div class="flex flex-col min-h-screen w-full bg-background">
    <!-- Header -->
    <AppHeader />

    <!-- Search Bar -->
    <div class="pb-4">
      <MapSearchBar
        placeholder="Rechercher un plat, etc."
        :show-filters="true"
        :show-settings="false"
        @focus="navigateToRestaurants"
      />
    </div>

    <!-- Main Content -->
    <main class="flex-1 px-4 space-y-6 py-4">
      <!-- Promo Card -->
      <HomePromoCard />

      <!-- Map Preview Card -->
      <HomeMapPreviewCard />

      <!-- Restaurants Section -->
      <HomeRestaurantsSection />
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app",
});

useHead({
  title: "Accueil - Yum'me",
  meta: [
    {
      name: "description",
      content:
        "Découvrez les meilleurs restaurants adaptés à votre alimentation",
    },
  ],
});

const restaurantStore = useRestaurantStore();

const navigateToRestaurants = () => {
  navigateTo("/restaurants?focus=true");
};

// Charger les restaurants au montage
onMounted(async () => {
  await restaurantStore.fetchRestaurants();
});
</script>
