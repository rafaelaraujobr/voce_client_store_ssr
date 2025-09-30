<script setup>
import { useTenant } from "~/composables/tenant.composable";
definePageMeta({
  layout: "empty",
});
const tenant = useTenant();
</script>
<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">Política de privacidade</div>
      <div>{{ tenant }}</div>

      <div class="text-h2" style="opacity: 0.4">Política de privacidade</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>