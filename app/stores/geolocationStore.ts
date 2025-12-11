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
      const debugStore = useGeolocationDebugStore();

      debugStore.info('🎯 getUserPosition appelé', { force, isCacheValid: this.isCacheValid, mapReady: this.mapReady });

      // Vérifier le contexte sécurisé
      if (process.client) {
        const isSecureContext = window.isSecureContext;
        const protocol = window.location.protocol;
        debugStore.info('🔒 Contexte de sécurité', {
          isSecureContext,
          protocol,
          host: window.location.host
        });

        if (!isSecureContext && !window.location.host.includes('localhost')) {
          debugStore.error('❌ Contexte non sécurisé (HTTPS requis)');
          this.error = 'Secure context required';
          this.mapReady = true;
          this.loading = false;
          return { success: false, error: 'not_secure' };
        }
      }

      // Si le cache est valide et qu'on ne force pas, on ne recharge pas
      if (!force && this.isCacheValid && this.mapReady) {
        debugStore.success('✅ Position depuis cache (valide)', { center: this.center });
        return { success: true, fromCache: true };
      }

      // Essayer de charger depuis le cache d'abord
      if (!force && this.loadFromCache()) {
        debugStore.success('✅ Position chargée depuis cache', { center: this.center });
        return { success: true, fromCache: true };
      }

      debugStore.info('📍 Demande de nouvelle position...');
      this.loading = true;
      this.error = null;

      return new Promise<{ success: boolean; error?: string }>((resolve) => {
        if (!navigator.geolocation) {
          debugStore.error('❌ navigator.geolocation non disponible');
          this.error = 'Geolocation not supported';
          this.mapReady = true;
          this.loading = false;
          resolve({ success: false, error: 'not_supported' });
          return;
        }

        debugStore.info('🔄 Démarrage de watchPosition...');

        let watchId: number | null = null;
        let bestAccuracy = Infinity;
        let bestPosition: GeolocationPosition | null = null;
        let hasResolved = false;

        // Timeout plus long pour mobile (15 secondes)
        const timeoutId = setTimeout(() => {
          if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
          }
          if (!hasResolved) {
            hasResolved = true;
            if (bestPosition) {
              // On a au moins une position, même si pas la meilleure
              this.center = [
                bestPosition.coords.longitude,
                bestPosition.coords.latitude,
              ];
              this.mapReady = true;
              this.saveToCache();
              this.loading = false;
              resolve({ success: true });
            } else {
              // Aucune position obtenue
              this.error = 'Timeout';
              this.mapReady = true;
              this.loading = false;
              resolve({ success: false, error: 'timeout' });
            }
          }
        }, 15000);

        // Utiliser watchPosition pour meilleure précision sur mobile
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const debugStore = useGeolocationDebugStore();
            debugStore.info('📡 Position reçue', {
              accuracy: position.coords.accuracy.toFixed(1) + 'm',
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6),
              timestamp: new Date(position.timestamp).toLocaleTimeString()
            });

            // Garder la position la plus précise
            if (position.coords.accuracy < bestAccuracy) {
              bestAccuracy = position.coords.accuracy;
              bestPosition = position;
              debugStore.info(`✨ Meilleure précision: ${bestAccuracy.toFixed(1)}m`);

              // Si on a une précision acceptable (< 50m), on peut résoudre rapidement
              if (position.coords.accuracy < 50 && !hasResolved) {
                hasResolved = true;
                clearTimeout(timeoutId);
                if (watchId !== null) {
                  navigator.geolocation.clearWatch(watchId);
                }
                this.center = [
                  position.coords.longitude,
                  position.coords.latitude,
                ];
                this.mapReady = true;
                this.loading = false;
                this.saveToCache();
                debugStore.success('✅ Position obtenue avec précision < 50m', {
                  accuracy: position.coords.accuracy.toFixed(1) + 'm',
                  center: this.center
                });
                resolve({ success: true });
              }
            }
          },
          (error) => {
            const debugStore = useGeolocationDebugStore();

            if (watchId !== null) {
              navigator.geolocation.clearWatch(watchId);
            }
            clearTimeout(timeoutId);
            if (!hasResolved) {
              hasResolved = true;

              // Déterminer le type d'erreur
              let errorType = 'unknown';
              let errorMessage = '';

              if (error.code === error.PERMISSION_DENIED) {
                errorType = 'permission_denied';
                errorMessage = '❌ Permission refusée par l\'utilisateur';
              } else if (error.code === error.POSITION_UNAVAILABLE) {
                errorType = 'unavailable';
                errorMessage = '❌ Position indisponible (GPS/réseau)';
              } else if (error.code === error.TIMEOUT) {
                errorType = 'timeout';
                errorMessage = '⏱️ Timeout de géolocalisation';
              } else {
                errorMessage = `❌ Erreur inconnue: ${error.message}`;
              }

              debugStore.error(errorMessage, {
                code: error.code,
                message: error.message,
                type: errorType
              });

              this.error = error.message;
              this.mapReady = true;
              this.loading = false;
              resolve({ success: false, error: errorType });
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
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
