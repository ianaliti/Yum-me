import { restaurantService } from '../services/restaurantService';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const filters = {
    cuisine: query.cuisine && typeof query.cuisine === 'string' ? query.cuisine : undefined,
    dietaryOption: query.dietaryOption && typeof query.dietaryOption === 'string' ? query.dietaryOption : undefined,
    priceRange: query.priceRange && typeof query.priceRange === 'string' && ['$', '$$', '$$$', '$$$$'].includes(query.priceRange) 
      ? query.priceRange as any 
      : undefined,
    minRating: query.minRating ? (() => {
      const num = parseFloat(query.minRating as string);
      return !isNaN(num) ? num : undefined;
    })() : undefined,
    city: query.city && typeof query.city === 'string' ? query.city : undefined,
    limit: query.limit ? (() => {
      const num = parseInt(query.limit as string, 10);
      return !isNaN(num) && num > 0 ? num : undefined;
    })() : undefined,
  };

  const restaurants = await restaurantService.getAll(filters);
  const total = await restaurantService.getTotalCount();

  return {
    success: true,
    data: restaurants,
    count: restaurants.length,
    total,
  };
});

