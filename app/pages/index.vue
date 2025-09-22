<template>
  <q-page :style-fn="myTweak" padding class="q-gutter-y-sm">
    <div class="wrapper">
      <ShowCaseCategories />
    </div>
    <ShowCaseCarousel />
    <div class="wrapper">
      <ShowCaseCampaings />
      <SkeletonShowCaseList v-show="loadingProducts" />
      <ShowCaseList v-show="!loadingProducts" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
import SkeletonShowCaseList from "~/components/showcase/ShowCaseSkeletonList.vue";
import ShowCaseList from "~/components/showcase/ShowCaseList.vue";
import ShowCaseCarousel from "~/components/showcase/ShowCaseCarousel.vue";
import ShowCaseCampaings from "~/components/showcase/ShowCaseCampaings.vue";
import ShowCaseCategories from "~/components/showcase/ShowCaseCategories.vue";
const { loadingProducts } = useShop();

function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}
</script>
