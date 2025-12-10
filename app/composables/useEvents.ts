import { storeToRefs } from 'pinia';
import { useEventStore } from '~/stores/eventStore';

export const useEvents = () => {
  const eventStore = useEventStore();
  const { events, loading, error } = storeToRefs(eventStore);

  const fetchEvents = async (force = false) => {
    await eventStore.fetchEvents(force);
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
  };
};
