// https://nuxt.com/docs/api/configuration/nuxt-config
import { quasarOptions } from "./quasar-options";

export default defineNuxtConfig({
  css: ["@/assets/styles/quasar-custom.sass"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "nuxt-quasar-ui",
    "@pinia/nuxt",
    '@vueuse/nuxt',
  ],
  quasar: quasarOptions,

  runtimeConfig: {
    apiSecret: process.env.API_SECRET || "",
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3000",
    },
  },
});
