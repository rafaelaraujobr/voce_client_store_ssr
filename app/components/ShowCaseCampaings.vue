<template>
  <q-tabs v-model="tab" inline-label active-color="transparent">
    <q-tab v-for="campaign in campaigns" :key="campaign.id" name="mails">
      <q-img
        :src="campaign?.logotipo"
        fit="contain"
        width="100px"
        class="img-campaign"
      />
    </q-tab>
  </q-tabs>
</template>
<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
const tab = ref<string>("mails");
const { shop } = useShop();
const campaigns = computed(() => shop?.value?.campaigns || []);
</script>
<style lang="sass">
.img-campaign
    filter: grayscale(100%);
    opacity: 0.5;
    transition: all 0.3s ease;
    &:hover
        filter: grayscale(0%);
        opacity: 1;
</style>
