import { restaurantService } from '../../services/restaurantService';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const restaurant = await restaurantService.getById(id || '');

  if (!restaurant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Restaurant not found',
    });
  }

  return {
    success: true,
    data: restaurant,
  };
});

