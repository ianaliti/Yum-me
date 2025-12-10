import { defineStore } from 'pinia';
import type { Friend } from '../types/event';

export const useFriendStore = defineStore('friend', {
  state: () => ({
    friends: [] as Friend[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchFriends(force = false) {
      // Si on a déjà des amis et qu'on ne force pas, on ne recharge pas
      if (!force && this.friends.length > 0) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const res = await $fetch('/api/friends');

        if (res.success) {
          this.friends = res.data;
        } else {
          this.error = 'Failed to fetch friends';
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Something went wrong';
        console.error('Fetch friends error:', err);
      } finally {
        this.loading = false;
      }
    },
  },
});
