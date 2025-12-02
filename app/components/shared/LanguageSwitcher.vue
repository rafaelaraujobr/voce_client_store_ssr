<template>
  <q-btn
    flat
    dense
    :icon="`img:${flags[currentLocale?.code as 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR']}`"
  >
    <q-menu auto-close>
      <q-list>
        <q-item
          v-for="item in locales"
          :key="item.code"
          clickable
          @click="
            setLanguage(item.code as 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR')
          "
        >
          <q-item-section side>
            <q-img
              :src="flags[item.code as 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR']"
              height="32px"
              width="32px"
              fit="contain"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script setup lang="ts">
import flagBr from "~/assets/images/flags/flag-br.svg";
import flagUs from "~/assets/images/flags/flag-us.svg";
import flagEs from "~/assets/images/flags/flag-es.svg";
import flagFr from "~/assets/images/flags/flag-fr.svg";

const { locales, setLocale, locale } = useI18n();
const currentLocale = computed(() => {
  return locales.value.find((item) => item.code === locale.value);
});
const flags = {
  "pt-BR": flagBr,
  "en-US": flagUs,
  "es-ES": flagEs,
  "fr-FR": flagFr,
};

async function setLanguage(value: "pt-BR" | "en-US" | "es-ES" | "fr-FR") {
  setLocale(value as any);
}
</script>
