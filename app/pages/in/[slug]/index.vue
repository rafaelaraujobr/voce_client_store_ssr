<template>
  <q-page :style-fn="myTweak" padding class="wrapper">
    <ShowCaseList />
  </q-page>
</template>

<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
const { getShopBySlug, getProducts } = useShop();
useSeoMeta({
  title: "LAB Vue",
  description: "LAB Vue",
});
const route = useRoute();
const slug = computed(() => route.params.slug);

function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}

onMounted(async () => {
  await getShopBySlug(slug.value as string);
  await getProducts(slug.value as string);
});

</script>
