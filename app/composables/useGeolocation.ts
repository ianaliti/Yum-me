export const useGeolocation = () => {
  const config = useRuntimeConfig();
  const mapReady = ref(false);
  const mapOptions = ref({
    style: config.public.mapboxStyleUrl || "mapbox://styles/mapbox/streets-v12",
    center: [6.1294, 45.8992] as [number, number],
    zoom: 15,
  });

  const getUserPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapOptions.value.center = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          mapReady.value = true;
        },
        (error) => {
          console.warn("Géolocalisation refusée:", error);
          mapReady.value = true;
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      mapReady.value = true;
    }
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
    mapReady,
    mapOptions,
    getUserPosition,
    activateGeolocateControl,
  };
};
