import { mockEvents } from '../../data/mockEvents';

export default defineEventHandler(() => {
  return {
    success: true,
    data: mockEvents,
  };
});
