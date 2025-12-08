import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "mapbox-gl/dist/mapbox-gl.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["shadcn-nuxt", "nuxt-mapbox"],
  mapbox: {
    accessToken: process.env.NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
  },
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
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
