<template>
  <q-page :style-fn="myTweak" padding class="wrapper">
    <q-breadcrumbs class="text-grey" active-color="purple">
      <template #separator>
        <q-icon size="1.2em" name="mdi-chevron-right" color="purple" />
      </template>
      <q-breadcrumbs-el :label="shop?.name" :to="`/in/${slug}`" />
      <q-breadcrumbs-el :label="product?.name" class="ellipsis-2" />
    </q-breadcrumbs>
    {{ product }}
  </q-page>
</template>
<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
const { getProductById, product, shop } = useShop();
const route = useRoute();
const id = computed(() => route.params.id);
const slug = computed(() => route.params.slug);

function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}

onMounted(async () => {
  await getProductById(slug.value as string, id.value as string);
});
</script>
