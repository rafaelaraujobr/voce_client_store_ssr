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
    "@vueuse/nuxt",
  ],
  quasar: quasarOptions,

  runtimeConfig: {
    apiSecret: process.env.API_SECRET || "",
    public: {
      baseDomain: process.env.NUXT_BASE_DOMAIN || "vocelab.com.br",
      reservedSubs: (process.env.RESERVED_SUBS || 'www,app,api,static,assets')
      .split(',').map(s => s.trim()),
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3000",
    },
  },

  // Configurações para otimizar SSR e SEO
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  // Meta padrão para todas as páginas
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: {
        lang: "pt-BR",
      },
    },
  },
});
