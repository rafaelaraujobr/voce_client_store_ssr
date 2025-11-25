// https://nuxt.com/docs/api/configuration/nuxt-config
import { quasarOptions } from "./quasar-options";
import { i18nOptions } from "./i18n-options";

export default defineNuxtConfig({
  css: ["@/assets/styles/quasar-custom.sass"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          quietDeps: true, // Silencia avisos de dependências (como Quasar)
          silenceDeprecations: ["import"], // Silencia especificamente avisos de @import
        },
      },
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "nuxt-quasar-ui",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
  ],
  quasar: quasarOptions,
  i18n: i18nOptions,

  runtimeConfig: {
    apiSecret: process.env.API_SECRET || "",
    public: {
      baseDomain: process.env.NUXT_BASE_DOMAIN || "vocelab.com.br",
      reservedSubs: (process.env.RESERVED_SUBS || "www,app,api,static,assets")
        .split(",")
        .map((s) => s.trim()),
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3000",
      apiGatewayBase:
        process.env.NUXT_PUBLIC_API_GATEWAY_BASE || "http://localhost:3000",
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
