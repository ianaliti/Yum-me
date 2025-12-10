import { storeToRefs } from 'pinia';
import { useFriendStore } from '~/stores/friendStore';

export const useFriends = () => {
  const friendStore = useFriendStore();
  const { friends, loading, error } = storeToRefs(friendStore);

  const fetchFriends = async (force = false) => {
    await friendStore.fetchFriends(force);
  };

  return {
    friends,
    loading,
    error,
    fetchFriends,
  };
};
