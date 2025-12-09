export const useGeolocation = () => {
  const config = useRuntimeConfig();
  const store = useGeolocationStore();

  const mapOptions = computed(() => ({
    style: config.public.mapboxStyleUrl || "mapbox://styles/mapbox/streets-v12",
    center: store.center,
    zoom: 15,
  }));

  const getUserPosition = async () => {
    await store.getUserPosition();
  };

  const activateGeolocateControl = (map: any) => {
    setTimeout(() => {
      const geolocateControl = map._controls.find(
        (control: any) => control._geolocateButton
      );
      if (geolocateControl) {
        geolocateControl.trigger();
      }
    }, 500);
  };

  return {
    mapReady: computed(() => store.mapReady),
    mapOptions,
    getUserPosition,
    activateGeolocateControl,
  };
};
