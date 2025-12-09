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
        const response = await $fetch<{
          success: boolean;
          data: Restaurant[];
        }>('/api/restaurants');

        if (response.success) {
          this.restaurants = response.data;
          this.loading = false;
        } else {
          this.error = 'Failed to fetch restaurants';
          this.loading = false;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred';
        this.loading = false;
      }
    },
  },
});

