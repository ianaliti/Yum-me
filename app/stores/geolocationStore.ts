import { defineStore } from 'pinia';

const CACHE_KEY = 'yumme_geolocation_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

interface GeolocationData {
  center: [number, number];
  timestamp: number;
}

export const useGeolocationStore = defineStore('geolocation', {
  state: () => ({
    center: [6.1294, 45.8992] as [number, number], // Default: Annecy
    mapReady: false,
    mapFullyLoaded: false, // True seulement quand la map est complètement chargée (tuiles + géoloc)
    loading: false,
    error: null as string | null,
    lastFetchTime: null as number | null,
    isFirstLoad: true, // Pour savoir si c'est la première visite depuis l'onboarding
    loadingStartTime: null as number | null, // Timestamp du début du chargement
  }),

  getters: {
    isCacheValid: (state) => {
      if (!state.lastFetchTime) return false;
      return Date.now() - state.lastFetchTime < CACHE_DURATION;
    },
    isRealLocation: (state) => {
      const defaultCenter = [6.1294, 45.8992]; // Annecy
      return (
        state.center[0] !== defaultCenter[0] ||
        state.center[1] !== defaultCenter[1]
      );
    },
  },

  actions: {
    loadFromCache() {
      if (process.client) {
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const data: GeolocationData = JSON.parse(cached);
            if (Date.now() - data.timestamp < CACHE_DURATION) {
              this.center = data.center;
              this.lastFetchTime = data.timestamp;
              this.mapReady = true;
              return true;
            } else {
              localStorage.removeItem(CACHE_KEY);
            }
          }
        } catch (err) {
          console.error('Error loading geolocation cache:', err);
        }
      }
      return false;
    },

    saveToCache() {
      if (process.client) {
        try {
          const data: GeolocationData = {
            center: this.center,
            timestamp: Date.now(),
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          this.lastFetchTime = data.timestamp;
        } catch (err) {
          console.error('Error saving geolocation cache:', err);
        }
      }
    },

    async getUserPosition(force = false) {
      // Si le cache est valide et qu'on ne force pas, on ne recharge pas
      if (!force && this.isCacheValid && this.mapReady) {
        return;
      }

      // Essayer de charger depuis le cache d'abord
      if (!force && this.loadFromCache()) {
        return;
      }

      this.loading = true;
      this.error = null;

      return new Promise<void>((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.center = [
                position.coords.longitude,
                position.coords.latitude,
              ];
              this.mapReady = true;
              this.loading = false;
              this.saveToCache();
              resolve();
            },
            (error) => {
              console.warn('Géolocalisation refusée:', error);
              this.error = error.message;
              this.mapReady = true;
              this.loading = false;
              resolve();
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        } else {
          this.error = 'Geolocation not supported';
          this.mapReady = true;
          this.loading = false;
          resolve();
        }
      });
    },

    async setMapFullyLoaded(loaded: boolean) {
      if (!loaded) {
        this.mapFullyLoaded = false;
        return;
      }

      const MIN_LOADING_TIME = 2000; // 2 secondes minimum
      const now = Date.now();
      const elapsedTime = this.loadingStartTime ? now - this.loadingStartTime : 0;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      this.mapFullyLoaded = loaded;
      this.isFirstLoad = false;
      this.loadingStartTime = null;
    },

    resetFirstLoad() {
      this.isFirstLoad = true;
      this.mapFullyLoaded = false;
      this.loadingStartTime = Date.now();
    },
  },
});
