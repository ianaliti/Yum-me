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
    await new Promise(resolve => setTimeout(resolve, 300));

    let results = [...mockRestaurants];

    if (filters?.cuisine) {
      const cuisine = filters.cuisine.toLowerCase();
      results = results.filter(r => r.cuisine.toLowerCase() === cuisine);
    }

    if (filters?.dietaryOption) {
      const option = filters.dietaryOption.toLowerCase();
      results = results.filter(r => 
        r.dietaryOptions.some(d => d.toLowerCase() === option)
      );
    }

    if (filters?.priceRange) {
      results = results.filter(r => r.priceRange === filters.priceRange);
    }

    if (filters?.minRating !== undefined) {
      results = results.filter(r => r.rating >= filters.minRating!);
    }

    if (filters?.city) {
      const city = filters.city.toLowerCase();
      results = results.filter(r => r.city.toLowerCase() === city);
    }

    if (filters?.limit && filters.limit > 0) {
      results = results.slice(0, filters.limit);
    }

    return results;
  },

  async getById(id: string): Promise<Restaurant | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockRestaurants.find(r => r.id === id) ?? null;
  },

  async getTotalCount(): Promise<number> {
    return mockRestaurants.length;
  },
};
