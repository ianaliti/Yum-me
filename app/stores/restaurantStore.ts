import { defineStore } from 'pinia';
import type { Restaurant } from '../types/restaurant';

const CACHE_KEY = 'yumme_restaurants_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

interface CachedData {
  restaurants: Restaurant[];
  timestamp: number;
}

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    restaurants: [] as Restaurant[],
    loading: false,
    error: null as string | null,
    lastFetchTime: null as number | null,
  }),

  getters: {
    isCacheValid: (state) => {
      if (!state.lastFetchTime) return false;
      return Date.now() - state.lastFetchTime < CACHE_DURATION;
    },
  },

  actions: {
    loadFromCache() {
      if (process.client) {
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const data: CachedData = JSON.parse(cached);
            if (Date.now() - data.timestamp < CACHE_DURATION) {
              this.restaurants = data.restaurants;
              this.lastFetchTime = data.timestamp;
              return true;
            } else {
              localStorage.removeItem(CACHE_KEY);
            }
          }
        } catch (err) {
          console.error('Error loading cache:', err);
        }
      }
      return false;
    },

    saveToCache() {
      if (process.client) {
        try {
          const data: CachedData = {
            restaurants: this.restaurants,
            timestamp: Date.now(),
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          this.lastFetchTime = data.timestamp;
        } catch (err) {
          console.error('Error saving cache:', err);
        }
      }
    },

    async fetchRestaurants(force = false) {
      // Si le cache est valide et qu'on ne force pas, on ne recharge pas
      if (!force && this.isCacheValid && this.restaurants.length > 0) {
        return;
      }

      // Essayer de charger depuis le cache d'abord
      if (!force && this.loadFromCache()) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const res = await $fetch('/api/restaurants');

        if (res.success) {
          this.restaurants = res.data;
          this.saveToCache();
        } else {
          this.error = 'Failed to fetch restaurants';
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Something went wrong';
        console.error('Fetch error:', err);
      } finally {
        this.loading = false;
      }
    },
  },
});

