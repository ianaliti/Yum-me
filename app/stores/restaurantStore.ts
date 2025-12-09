import { defineStore } from 'pinia';
import type { Restaurant } from '../types/restaurant';

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    restaurants: [] as Restaurant[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchRestaurants() {
      this.loading = true;
      this.error = null;
      
      try {
        const res = await $fetch('/api/restaurants');
        
        if (res.success) {
          this.restaurants = res.data;
        } else {
          this.error = 'Failed to fetch restaurants';
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Something went wrong';
      } finally {
        this.loading = false;
      }
    },
  },
});

