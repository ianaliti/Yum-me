import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["@pinia/nuxt", "shadcn-nuxt"],
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
    },
  },
});
