<template>
  <q-page :style-fn="myTweak" padding class="q-gutter-y-sm">
    <div class="wrapper">
      <ShowCaseCategories />
    </div>
    <q-separator spaced />
    <div class="wrapper row">
      <div v-if="currentSearchTerm" class="col-12">
        <div class="row items-center q-mb-md">
          <div class="text-h6 text-weight-medium row items-center">
            Resultados da busca:
            <div class="text-negative text-weight-bold text-h6 q-ml-sm">
              "{{ currentSearchTerm }}"
            </div>
          </div>
        </div>
      </div>
      <div class="col-3">
        <FilterList />
      </div>
      <div class="col-9">
        <SeachList />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SeachList from "~/components/search/SeachList.vue";
import FilterList from "~/components/search/FilterList.vue";
import ShowCaseCategories from "~/components/showcase/ShowCaseCategories.vue";
import { useShop } from "~/composables/shop.composable";

const route = useRoute();
const { search, getProducts, slug } = useShop();

const currentSearchTerm = computed<string>(() => {
  return (route.query.search as string) || search.value || "";
});

function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}

onMounted(() => {
  getProducts(slug.value as string);
});
</script>
