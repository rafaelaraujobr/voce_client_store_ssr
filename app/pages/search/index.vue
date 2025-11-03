<template>
  <q-page :style-fn="myTweak" padding class="q-gutter-y-sm">
    <div class="wrapper row">
      <!-- Termo de busca -->
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

      <!-- Botão de filtros (Mobile) -->
      <div class="col-12 lt-md q-my-md">
        <q-btn unelevated color="primary" icon="mdi-filter-variant" label="Filtros" class="full-width" @click="showFilters = true">
          <q-badge v-if="activeFiltersCount > 0" color="negative" floating>
            {{ activeFiltersCount }}
          </q-badge>
        </q-btn>
      </div>

      <!-- Filtros Desktop -->
      <div class="col-3 gt-sm">
        <FilterList />
      </div>

      <!-- Lista de produtos -->
      <div class="col-12 col-md-9">
        <SeachList />
      </div>
    </div>

    <!-- Drawer de filtros (Mobile) -->
    <q-drawer
      v-model="showFilters"
      side="left"
      overlay
      behavior="mobile"
      :width="Math.min($q.screen.width * 0.85, 400)"
      class="lt-md"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            <div class="row items-center">
              <q-icon name="mdi-filter-variant" class="q-mr-sm" />
              Filtros
            </div>
          </q-toolbar-title>
          <q-btn flat round dense icon="mdi-close" @click="showFilters = false" />
        </q-toolbar>

        <div class="q-pa-md">
          <FilterList />
        </div>

        <!-- Ações do Drawer -->
        <div class="absolute-bottom bg-white q-pa-md border-top">
          <div class="row q-gutter-sm">
            <div class="col">
              <q-btn outline color="primary" label="Limpar" class="full-width" @click="clearFilters" />
            </div>
            <div class="col">
              <q-btn unelevated color="primary" label="Aplicar" class="full-width" @click="showFilters = false" />
            </div>
          </div>
        </div>
      </q-scroll-area>
    </q-drawer>
  </q-page>
</template>

<script setup lang="ts">
import SeachList from "~/components/search/SeachList.vue";
import FilterList from "~/components/search/FilterList.vue";
import { useShop } from "~/composables/shop.composable";
import { useQuasar } from "quasar";

const route = useRoute();
const $q = useQuasar();
const { search, getProducts, slug, productQuery, setProductQuery } = useShop();

const showFilters = ref(false);

const currentSearchTerm = computed<string>(() => {
  return (route.query.search as string) || search.value || "";
});

// Conta quantos filtros estão ativos
const activeFiltersCount = computed(() => {
  let count = 0;
  if (productQuery.value.categories && productQuery.value.categories.length > 0) {
    count += productQuery.value.categories.length;
  }
  if (productQuery.value.minPrice !== undefined || productQuery.value.maxPrice !== undefined) {
    count += 1;
  }
  return count;
});

function clearFilters() {
  setProductQuery({
    ...productQuery.value,
    categories: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    skip: 0,
  });
  getProducts(slug.value as string);
}

function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}

onMounted(() => {
  getProducts(slug.value as string);
});
</script>

<style lang="sass" scoped>
.border-top
  border-top: 1px solid rgba(0, 0, 0, 0.12)

// Ajuste do drawer de filtros
:deep(.q-drawer)
  .q-scrollarea__content
    padding-bottom: 80px // Espaço para os botões de ação
</style>
