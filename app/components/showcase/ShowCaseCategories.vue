<template>
  <q-tabs
    ref="tabsRef"
    v-model="categorySelected"
    inline-label
    no-caps
    active-color="primary"
    outside-arrows
    mobile-arrows
    align="left"
  >
    <q-tab name="all">
      <q-item-section>
        <q-item-label>{{ $t("allProducts") }}</q-item-label>
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

const tabsRef = ref();

const categorySelected = computed({
  get: () => producFilters.value.categories || "all",
  set: (value) => {
    setProductFilters({ categories: value === "all" ? undefined : value });
    setProductQuery({ ...productQuery.value, skip: 0 });
  },
});
const categories = computed(() => shop?.value?.categories || []);

const centerActiveTab = () => {
  nextTick(() => {
    const tabsElement = tabsRef.value?.$el;
    if (!tabsElement) return;

    const activeTab = tabsElement.querySelector('.q-tab--active');
    if (!activeTab) return;

    const scrollContainer = tabsElement.querySelector('.q-tabs__content');
    if (!scrollContainer) return;

    const tabRect = activeTab.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    
    const tabCenter = tabRect.left + tabRect.width / 2 - containerRect.left;
    const containerCenter = containerRect.width / 2;
    const scrollOffset = scrollContainer.scrollLeft + tabCenter - containerCenter;

    scrollContainer.scrollTo({
      left: Math.max(0, scrollOffset),
      behavior: 'smooth'
    });
  });
};

watch(categorySelected, () => {
  getProducts(slug.value as string);
  centerActiveTab();
});

onMounted(() => {
  centerActiveTab();
});
</script>
<style lang="sass"></style>
