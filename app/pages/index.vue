<template>
  <div class="min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Restaurants</h1>
      
      <Button 
        @click="fetchRestaurants" 
        :disabled="loading"
        class="mb-6"
      >
        {{ loading ? 'Loading...' : 'Fetch Restaurants' }}
      </Button>

      <div v-if="error" class="text-red-500 mb-4">
        Error: {{ error }}
      </div>

      <div v-if="loading && restaurants.length === 0" class="text-gray-500">
        Loading restaurants...
      </div>

      <div v-else-if="restaurants.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="restaurant in restaurants" 
          :key="restaurant.id"
          class="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 class="text-xl font-semibold mb-2">{{ restaurant.name }}</h2>
          <p class="text-gray-600 mb-2">{{ restaurant.cuisine }} • {{ restaurant.priceRange }}</p>
          <p class="text-sm text-gray-500 mb-2">⭐ {{ restaurant.rating }}</p>
          <p class="text-sm mb-2">{{ restaurant.address }}, {{ restaurant.city }}, {{ restaurant.state }}</p>
          <p class="text-sm text-gray-600">{{ restaurant.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { restaurants, loading, error, fetchRestaurants } = useRestaurants();
</script>
