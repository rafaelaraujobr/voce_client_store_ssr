import type { UserConfig } from "nuxt-i18n";
export const i18nOptions: UserConfig["i18n"] = {
  locales: [
    {
      code: "pt-BR",
      language: "pt-BR",
      file: "pt-BR.json",
      name: "Português (BR)",
    },
    {
      code: "en-US",
      language: "en-US",
      file: "en-US.json",
      name: "English (US)",
    },
    {
      code: "es-ES",
      language: "es-ES",
      file: "es-ES.json",
      name: "Español (ES)",
    },
    {
      code: "fr-FR",
      language: "fr-FR",
      file: "fr-FR.json",
      name: "Français (FR)",
    },
  ],
  langDir: "locales",
  defaultLocale: "pt-BR",
  strategy: "no_prefix",
};
