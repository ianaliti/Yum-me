import { restaurantService } from '../services/restaurantService';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filters: any = {};

  if (typeof query.cuisine === 'string') {
    filters.cuisine = query.cuisine;
  }

  if (typeof query.dietaryOption === 'string') {
    filters.dietaryOption = query.dietaryOption;
  }

  if (typeof query.priceRange === 'string' && ['$', '$$', '$$$', '$$$$'].includes(query.priceRange)) {
    filters.priceRange = query.priceRange;
  }

  if (query.minRating) {
    const rating = parseFloat(query.minRating as string);
    if (!isNaN(rating)) {
      filters.minRating = rating;
    }
  }

  if (typeof query.city === 'string') {
    filters.city = query.city;
  }

  if (query.limit) {
    const limit = parseInt(query.limit as string, 10);
    if (!isNaN(limit) && limit > 0) {
      filters.limit = limit;
    }
  }

  const restaurants = await restaurantService.getAll(filters);
  const total = await restaurantService.getTotalCount();

  return {
    success: true,
    data: restaurants,
    count: restaurants.length,
    total,
  };
});

