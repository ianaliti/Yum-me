import { defineStore } from 'pinia';
import type { EventGroup } from '../types/event';

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [] as EventGroup[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchEvents(force = false) {
      // Si on a déjà des événements et qu'on ne force pas, on ne recharge pas
      if (!force && this.events.length > 0) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const res = await $fetch('/api/events');

        if (res.success) {
          this.events = res.data;
        } else {
          this.error = 'Failed to fetch events';
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Something went wrong';
        console.error('Fetch events error:', err);
      } finally {
        this.loading = false;
      }
    },
  },
});
