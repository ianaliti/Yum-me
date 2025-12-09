import { mockRestaurants } from '../data/mockRestaurants';
import type { Restaurant } from '../../app/types/restaurant';

export interface RestaurantFilters {
  cuisine?: string;
  dietaryOption?: string;
  priceRange?: Restaurant['priceRange'];
  minRating?: number;
  city?: string;
  limit?: number;
}

export const restaurantService = {
  async getAll(filters?: RestaurantFilters): Promise<Restaurant[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let restaurants: Restaurant[] = [...mockRestaurants];

    if (filters?.cuisine) {
      restaurants = restaurants.filter(
        (r) => r.cuisine.toLowerCase() === filters.cuisine!.toLowerCase()
      );
    }

    if (filters?.dietaryOption) {
      restaurants = restaurants.filter((r) =>
        r.dietaryOptions.includes(
          filters.dietaryOption!.toLowerCase() as Restaurant['dietaryOptions'][number]
        )
      );
    }

    if (filters?.priceRange) {
      restaurants = restaurants.filter((r) => r.priceRange === filters.priceRange);
    }

    if (filters?.minRating !== undefined) {
      restaurants = restaurants.filter((r) => r.rating >= filters.minRating!);
    }

    if (filters?.city) {
      restaurants = restaurants.filter(
        (r) => r.city.toLowerCase() === filters.city!.toLowerCase()
      );
    }

    if (filters?.limit && filters.limit > 0) {
      restaurants = restaurants.slice(0, filters.limit);
    }

    return restaurants;
  },

  async getById(id: string): Promise<Restaurant | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockRestaurants.find((r) => r.id === id) || null;
  },

  async getTotalCount(): Promise<number> {
    return mockRestaurants.length;
  },
};
