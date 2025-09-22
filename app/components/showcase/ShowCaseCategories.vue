<template>
  <q-tabs
    v-model="categorySelected"
    inline-label
    no-caps
    active-color="primary"
    outside-arrows
    mobile-arrows
  >
    <q-tab name="all">
      <q-item-section>
        <q-item-label>Todos os produtos</q-item-label>
      </q-item-section>
    </q-tab>
    <q-tab
      v-for="category in categories"
      :key="category.id"
      :name="category.id"
    >
      <q-item-section>
        <q-item-label>{{ category.name }}</q-item-label>
      </q-item-section>
    </q-tab>
  </q-tabs>
</template>
<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
const {
  shop,
  setProductFilters,
  producFilters,
  slug,
  getProducts,
  setProductQuery,
  productQuery,
} = useShop();

const categorySelected = computed({
  get: () => producFilters.value.categories,
  set: (value) => {
    setProductFilters({ categories: value === "all" ? undefined : value });
    setProductQuery({ ...productQuery.value, skip: 0 });
  },
});
const categories = computed(() => shop?.value?.categories || []);
watch(categorySelected, () => {
  getProducts(slug.value as string);
});
</script>
<style lang="sass"></style>
