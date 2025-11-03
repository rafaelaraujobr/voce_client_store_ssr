<template>
  <div class="row q-col-gutter-md full-width">
    <div class="col-12 q-pr-md q-py-md">
      <q-card flat bordered>
        <!-- Filtros Ativos -->
        <q-card-section v-if="categoriesApplied.length > 0 || priceApplied.length > 0">
          <div class="row items-center justify-between q-mb-sm">
            <q-item-label class="text-weight-bold">Filtros Ativos</q-item-label>
            <q-btn flat dense size="sm" label="Limpar todos" color="negative" @click="clearAllFilters" />
          </div>
          <div class="q-gutter-xs">
            <q-chip v-for="price in priceApplied" :key="price.value.min" :label="price.label" color="primary"
              text-color="white" removable icon="mdi-currency-usd"
              @remove="removePrice(price.value.min, price.value.max)" />
            <q-chip v-for="category in categoriesApplied" :key="category.id" :label="category.name" color="secondary"
              text-color="white" removable icon="mdi-tag" @remove="removeCategory(category.id)" />
          </div>
        </q-card-section>

        <q-separator v-if="categoriesApplied.length > 0 || priceApplied.length > 0" />

        <!-- Filtro de Categorias -->
        <q-card-section>
          <q-item-label class="text-weight-bold q-mb-sm">
            <q-icon name="mdi-shape" class="q-mr-xs" />
            Categorias
          </q-item-label>
          <div class="scroll" style="max-height: 300px">
            <q-option-group v-model="categoriesSelected" :options="categoriesOptions" option-value="id"
              option-label="name" color="primary" type="checkbox" keep-color :dense="$q.screen.lt.md" />
          </div>
          <div v-if="categoriesOptions.length === 0" class="text-center text-grey-6 q-py-md">
            <q-icon name="mdi-information-outline" size="24px" />
            <div class="text-caption">Nenhuma categoria disponível</div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Filtro de Preço -->
        <q-card-section>
          <q-item-label class="text-weight-bold q-mb-sm">
            <q-icon name="mdi-currency-usd" class="q-mr-xs" />
            Faixa de Preço
          </q-item-label>
          <q-option-group v-model="priceSelected" :options="optionsPrices" color="primary" type="checkbox" keep-color
            :dense="$q.screen.lt.md" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
import { useQuasar } from "quasar";

const $q = useQuasar();
const { setProductQuery, productQuery, getProducts, slug, shop } = useShop();
const priceSelected = ref<{ min: number; max: number }[]>([]);
const optionsPrices = ref([
  {
    label: "Até R$ 50",
    value: {
      min: 0,
      max: 50,
    },
  },
  {
    label: "De R$ 51 a R$ 150",
    value: {
      min: 51,
      max: 150,
    },
  },
  {
    label: "De R$ 151 a R$ 300",
    value: {
      min: 151,
      max: 300,
    },
  },
  {
    label: "De R$ 301 a R$ 500",
    value: {
      min: 301,
      max: 500,
    },
  },
  {
    label: "Mais de R$ 501",
    value: {
      min: 501,
      max: 999999999,
    },
  },
]);

function parsePriceFilter(value: { min: number; max: number }[]) {
  const min = value.map((v) => v.min).sort((a, b) => a - b)[0];
  const max = value.map((v) => v.max).sort((a, b) => b - a)[0];
  return { minPrice: min, maxPrice: max };
}

const categoriesSelected = ref<string[]>([]);
const categoriesOptions = computed(() => shop.value?.categories || []);

const categoriesApplied = computed(() => {
  return categoriesOptions.value.filter((category) =>
    categoriesSelected.value.includes(category.id)
  );
});

const priceApplied = computed(() => {
  return optionsPrices.value.filter((price) =>
    priceSelected.value.includes(price.value)
  );
});

function removeCategory(categoryId: string) {
  categoriesSelected.value = categoriesSelected.value.filter(
    (category) => category !== categoryId
  );
}

function removePrice(min: number, max: number) {
  priceSelected.value = priceSelected.value.filter(
    (price) => price.min !== min || price.max !== max
  );
}

function clearAllFilters() {
  categoriesSelected.value = [];
  priceSelected.value = [];
}

watch(priceSelected, (value) => {
  setProductQuery({
    ...productQuery.value,
    ...parsePriceFilter(value),
    skip: 0,
  });
  getProducts(slug.value as string);
});

watch(categoriesSelected, (value) => {
  setProductQuery({
    ...productQuery.value,
    categories: value.length > 0 ? value : undefined,
    skip: 0,
  });
  getProducts(slug.value as string);
});
</script>
