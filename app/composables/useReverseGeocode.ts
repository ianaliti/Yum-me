export const useReverseGeocode = () => {
  const config = useRuntimeConfig();
  const addressCache = ref<string | null>(null);
  const isLoading = ref(false);

  const reverseGeocode = async (lng: number, lat: number): Promise<string> => {
    if (isLoading.value) {
      return addressCache.value || "14 Av. du Rhône, 74000 Annecy";
    }

    isLoading.value = true;

    try {
      const mapboxToken = config.public.mapboxAccessToken;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=address,poi&limit=1`
      );

      if (!response.ok) {
        throw new Error("Reverse geocoding failed");
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const placeName = feature.place_name;

        // Truncate si trop long (max 28 caractères)
        let address = placeName;
        if (address.length > 28) {
          address = address.substring(0, 25) + "...";
        }

        addressCache.value = address;
        return address;
      }

      // Fallback si pas de résultat
      return "14 Av. du Rhône, 74000 Annecy";
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return "14 Av. du Rhône, 74000 Annecy";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    reverseGeocode,
    addressCache,
    isLoading,
  };
};
