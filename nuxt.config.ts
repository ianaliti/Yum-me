import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false }, // Désactivé : cause des problèmes de perf avec Mapbox
  ssr: false,
  css: ["~/assets/css/main.css", "mapbox-gl/dist/mapbox-gl.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["@pinia/nuxt", "shadcn-nuxt", "nuxt-mapbox"],
  mapbox: {
    accessToken: process.env.NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
  },
  shadcn: {
    prefix: "",
    componentDir: "@/components/ui",
  },
  routeRules: {
    '/api/restaurants': {
      cache: { maxAge: 60 * 5 }
    },
    '/api/restaurants/**': {
      cache: { maxAge: 60 * 10 }
    }
  },
  runtimeConfig: {
    public: {
      mapboxAccessToken: process.env.NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
      mapboxStyleUrl:
        process.env.NUXT_PUBLIC_MAPBOX_STYLE_URL ||
        "mapbox://styles/mapbox/streets-v12",
    },
  },
});
