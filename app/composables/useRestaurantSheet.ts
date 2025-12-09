import type { Restaurant } from '~/types/restaurant';

export const useRestaurantSheet = () => {
  const isOpen = useState('restaurantSheetOpen', () => false);
  const selectedRestaurant = useState<Restaurant | null>('selectedRestaurant', () => null);

  const openSheet = (restaurant: Restaurant) => {
    selectedRestaurant.value = restaurant;
    isOpen.value = true;
  };

  const closeSheet = () => {
    isOpen.value = false;
    // Délai pour l'animation avant de clear les données
    setTimeout(() => {
      if (!isOpen.value) {
        selectedRestaurant.value = null;
      }
    }, 300);
  };

  return {
    isOpen: readonly(isOpen),
    selectedRestaurant: readonly(selectedRestaurant),
    openSheet,
    closeSheet,
  };
};
