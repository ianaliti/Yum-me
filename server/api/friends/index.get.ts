import { mockFriends } from '../../data/mockFriends';

export default defineEventHandler(() => {
  return {
    success: true,
    data: mockFriends,
  };
});
