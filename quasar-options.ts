import type { ModuleOptions } from "nuxt-quasar-ui";
export const quasarOptions: ModuleOptions = {
  sassVariables: "@/assets/styles/quasar-variable.sass",
  plugins: ["BottomSheet", "Dialog", "Loading", "LoadingBar", "Notify", "Dark"],
  lang: "pt-BR",
  iconSet: "eva-icons",
  components: {
    defaults: {
      QBtn: {
        unelevated: true,
        noCaps: true,
      },
    },
  },
  extras: {
    fontIcons: ["eva-icons", "mdi-v7", "material-symbols-outlined"],
  },
  config: {
    loading: {
      message: "Carregando...",
      spinnerColor: "primary",
      spinnerSize: 140,
      backgroundColor: "white",
    },
    notify: { position: "top", timeout: 2500 },
  },
};