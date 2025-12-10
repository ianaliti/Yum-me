import { mockRestaurants } from '../../data/mockRestaurants';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchQuery = (query.q as string || '').toLowerCase().trim();

  if (!searchQuery || searchQuery.length < 2) {
    return {
      success: true,
      data: [],
      count: 0,
    };
  }

  // Rechercher dans les noms de restaurants et les spécialités
  const results = mockRestaurants.filter((restaurant) => {
    const nameMatch = restaurant.name.toLowerCase().includes(searchQuery);
    const specialtyMatch = restaurant.specialties?.some(
      (specialty) => specialty.toLowerCase().includes(searchQuery)
    );
    return nameMatch || specialtyMatch;
  });

  // Limiter à 5 résultats pour l'autocomplétion
  const limitedResults = results.slice(0, 5);

  return {
    success: true,
    data: limitedResults,
    count: limitedResults.length,
  };
});
