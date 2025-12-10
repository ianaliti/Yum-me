import type { Restaurant } from '~/types/restaurant';

interface SearchResult extends Restaurant {
  matchingSpecialties?: string[];
}

export const useRestaurantSearch = () => {
  const searchResults = ref<SearchResult[]>([]);
  const isSearching = ref(false);
  const isAutocompleteVisible = ref(false);
  let searchTimeout: NodeJS.Timeout | null = null;

  const searchRestaurants = async (query: string) => {
    // Réinitialiser si la requête est vide
    if (!query || query.trim().length < 2) {
      searchResults.value = [];
      isAutocompleteVisible.value = false;
      return;
    }

    isSearching.value = true;

    try {
      const response = await $fetch('/api/restaurants/search', {
        params: { q: query },
      });

      if (response.success) {
        // Enrichir les résultats avec les spécialités correspondantes
        const queryLower = query.toLowerCase();
        searchResults.value = response.data.map((restaurant: Restaurant) => {
          const matchingSpecialties = restaurant.specialties?.filter(
            (specialty) => specialty.toLowerCase().includes(queryLower)
          ) || [];

          return {
            ...restaurant,
            matchingSpecialties: matchingSpecialties.length > 0 ? matchingSpecialties : undefined,
          };
        });

        isAutocompleteVisible.value = searchResults.value.length > 0;
      }
    } catch (error) {
      console.error('Search error:', error);
      searchResults.value = [];
      isAutocompleteVisible.value = false;
    } finally {
      isSearching.value = false;
    }
  };

  const debouncedSearch = (query: string, delay = 300) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      searchRestaurants(query);
    }, delay);
  };

  const clearSearch = () => {
    searchResults.value = [];
    isAutocompleteVisible.value = false;
    isSearching.value = false;
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  };

  const hideAutocomplete = () => {
    isAutocompleteVisible.value = false;
  };

  const showAutocomplete = () => {
    if (searchResults.value.length > 0) {
      isAutocompleteVisible.value = true;
    }
  };

  return {
    searchResults,
    isSearching,
    isAutocompleteVisible,
    searchRestaurants,
    debouncedSearch,
    clearSearch,
    hideAutocomplete,
    showAutocomplete,
  };
};
