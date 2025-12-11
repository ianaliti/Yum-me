import { defineStore } from 'pinia';

interface DebugLog {
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  data?: any;
}

export const useGeolocationDebugStore = defineStore('geolocation-debug', {
  state: () => ({
    visible: false,
    logs: [] as DebugLog[],
  }),

  actions: {
    log(type: 'info' | 'warning' | 'error' | 'success', message: string, data?: any) {
      const timestamp = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
      });

      this.logs.unshift({
        timestamp,
        type,
        message,
        data,
      });

      // Garder seulement les 50 derniers logs
      if (this.logs.length > 50) {
        this.logs = this.logs.slice(0, 50);
      }

      // Log aussi dans la console
      const prefix = `[GEO ${timestamp}]`;
      if (type === 'error') {
        console.error(prefix, message, data);
      } else if (type === 'warning') {
        console.warn(prefix, message, data);
      } else {
        console.log(prefix, message, data);
      }
    },

    info(message: string, data?: any) {
      this.log('info', message, data);
    },

    warning(message: string, data?: any) {
      this.log('warning', message, data);
    },

    error(message: string, data?: any) {
      this.log('error', message, data);
    },

    success(message: string, data?: any) {
      this.log('success', message, data);
    },

    clearLogs() {
      this.logs = [];
    },

    toggleVisibility() {
      this.visible = !this.visible;
    },

    show() {
      this.visible = true;
    },

    hide() {
      this.visible = false;
    },
  },
});
