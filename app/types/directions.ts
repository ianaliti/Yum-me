export interface RouteData {
  geometry: GeoJSON.LineString;
  distance: number; // mètres
  duration: number; // secondes
}

export interface MapboxDirectionsResponse {
  routes: Array<{
    geometry: GeoJSON.LineString;
    distance: number;
    duration: number;
  }>;
  code: string;
}
