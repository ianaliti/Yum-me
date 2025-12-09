import { useRestaurantStore } from '../stores/restaurantStore';
import { onMounted, computed } from 'vue';

export const useRestaurants = () => {
  const store = useRestaurantStore();

  onMounted(() => {
    if (store.restaurants.length === 0 && !store.loading) {
      store.fetchRestaurants();
    }
  });

  return {
    restaurants: computed(() => store.restaurants),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    fetchRestaurants: () => store.fetchRestaurants(),
  };
};

