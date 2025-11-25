<template>
  <div class="row q-col-gutter-md full-width">
    <div class="col-12">
      <q-card flat>
        <q-card-section>
          <q-item-label class="text-weight-bold">{{ $t("filters") }}</q-item-label>
          <div class="q-gutter-x-sm">
            <q-chip
              v-for="price in priceApplied"
              :key="price.value.min"
              :label="price.label"
              color="primary-light"
              text-color="white"
              removable
              dense
              class="q-px-sm"
              @remove="removePrice(price.value.min, price.value.max)"
            />
            <q-chip
              v-for="category in categoriesApplied"
              :key="category.id"
              :label="category.name"
              color="primary-light"
              text-color="white"
              removable
              dense
              class="q-px-sm"
              @remove="removeCategory(category.id)"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-item-label class="text-weight-bold q-mb-sm"
            >{{ $t("categories") }}</q-item-label
          >
          <div class="scroll" style="max-height: 300px">
            <q-option-group
              v-model="categoriesSelected"
              :options="categoriesOptions"
              option-value="id"
              option-label="name"
              color="primary"
              type="checkbox"
              keep-color
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-item-label class="text-weight-bold q-mb-sm">{{ $t("price") }}</q-item-label>
          <q-option-group
            v-model="priceSelected"
            :options="optionsPrices"
            color="primary"
            type="checkbox"
            keep-color
          />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
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
