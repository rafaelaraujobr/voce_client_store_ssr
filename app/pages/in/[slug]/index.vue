<template>
  <q-page :style-fn="myTweak" padding class="wrapper q-gutter-y-sm">
    <ShowCaseCategories />
    <ShowCaseCarousel />
    <ShowCaseCampaings />
    <SkeletonShowCaseList v-show="loadingProducts" />
    <ShowCaseList v-show="!loadingProducts" />
  </q-page>
</template>

<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
import SkeletonShowCaseList from "~/components/SkeletonShowCaseList.vue";
import ShowCaseList from "~/components/ShowCaseList.vue";
import ShowCaseCarousel from "~/components/ShowCaseCarousel.vue";
import ShowCaseCampaings from "~/components/ShowCaseCampaings.vue";
import ShowCaseCategories from "~/components/ShowCaseCategories.vue";
const { loadingProducts } = useShop();

function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}
</script>
