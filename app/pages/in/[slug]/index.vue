<template>
  <q-page :style-fn="myTweak" padding class="wrapper">
    <SkeletonShowCaseList v-show="loadingProducts" />
    <ShowCaseList v-show="!loadingProducts" />
  </q-page>
</template>

<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
import SkeletonShowCaseList from "~/components/SkeletonShowCaseList.vue";
import ShowCaseList from "~/components/ShowCaseList.vue";
const { loadingProducts } = useShop();

function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}
</script>
