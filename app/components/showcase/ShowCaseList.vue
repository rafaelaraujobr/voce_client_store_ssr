<template>
  <q-infinite-scroll ref="scrollTargetRef" :offset="800" debounce="500">
    <!-- @load="onScroll" -->
    <div class="row q-col-gutter-md full-width">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-xs-12 col-sm-6 col-md-3"
      >
        <q-card
          flat
          bordered
          class="cursor-pointer product-card border-default"
          role="button"
          :aria-label="`Ver produto ${product.name}`"
          tabindex="0"
          @click="navigateToProduct(product)"
          @keydown.enter="navigateToProduct(product)"
          @keydown.space="navigateToProduct(product)"
        >
          <q-card-section
            class="row q-pa-none q-ma-none justify-center items-center"
          >
            <div class="col-4 col-md-12 bg-default q-py-sm">
              <q-img
                :src="product.image"
                fit="contain"
                spinner-color="primary"
                class="product-image"
                height="118px"
                spinner-size="82px"
                loading="lazy"
                placeholder-src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNhYWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW08L3RleHQ+Cjwvc3ZnPg=="
              >
                <template #error>
                  <div
                    class="absolute-full flex flex-center bg-secondary text-white text-center"
                    style="max-width: 150px; margin: 0 auto"
                  >
                    Imagem indisponível
                  </div>
                </template>
              </q-img>
            </div>
            <div class="col-8 col-md-12 q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label lines="2" class="q-mb-sm text-grey-6">{{
                    product?.name
                  }}</q-item-label>
                  <div
                    v-if="
                      product.price &&
                      product.price_discount &&
                      product.price_discount < product.price
                    "
                  >
                    <q-item-label
                      lines="2"
                      class="text-subtitle1 text-negative"
                      style="text-decoration: line-through"
                    >
                      {{ numberToReal(product?.price) }}</q-item-label
                    >
                    <div class="row">
                      <q-item-label lines="2" class="text-h5 text-weight-bold">
                        {{
                          numberToReal(product?.price_discount)
                        }}</q-item-label
                      >
                    </div>
                  </div>
                  <div v-else>
                    <q-item-label lines="2" class="text-h5 text-weight-bold">
                      {{ numberToReal(product?.price) }}</q-item-label
                    >
                  </div>
                  <div
                    v-if="
                      product?.installments &&
                      product.installments.installment > 2
                    "
                    class="text-grey-6 text-caption"
                  >
                    <b>3x</b>
                    sem juros de
                    <b>{{
                      numberToReal(
                        (product.installments.value /
                          product.installments.installment) *
                          3
                      )
                    }}</b>
                  </div>
                </q-item-section>
              </q-item>
            </div>
            <q-badge
              v-if="
                product.price &&
                product.price_discount &&
                product.price_discount < product.price
              "
              :style="{
                backgroundColor: '#FFC107',
                top: '10px',
                borderRadius: '0 5px 5px 0',
              }"
              text-color="black"
              class="text-subtitle1 text-weight-bold absolute-top-left"
              >-
              {{
                getDiscountPercent(product.price, product.price_discount)
              }}%</q-badge
            >
            <q-btn
              color="primary"
              icon="mdi-cart-plus"
              class="absolute-top-right"
              flat
              dense
              :style="{
                top: '8px',
                right: '8px',
              }"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center items-center q-mt-md q-py-md">
      <q-btn
        v-if="!loadingProducts && products.length < totalProducts"
        :loading="loadingProducts"
        color="primary"
        label="Carregar mais produtos"
        class="q-mt-md"
        padding="sm md"
        @click="loadMoreProducts(slug as string)"
      />
    </div>
    <div
      v-if="isLoadingMore"
      class="row justify-center items-center q-mt-md q-py-md"
    >
      <q-spinner-dots color="primary" size="40px" />
      <span class="q-ml-sm text-grey-6">Carregando mais produtos...</span>
    </div>

    <div
      v-else-if="
        !loadingProducts &&
        products.length >= totalProducts &&
        products.length > 0
      "
      class="row justify-center items-center q-mt-md q-py-md"
    >
      <span class="text-grey-6">Todos os produtos foram carregados</span>
    </div>
  </q-infinite-scroll>
</template>

<script setup lang="ts">
import type { Product } from "~/types/shop.types";
import { useShop } from "~/composables/shop.composable";
import { formatDiscount, numberToReal } from "~/utils/functions";

const {
  products,
  getProducts,
  totalProducts,
  productQuery,
  setProductQuery,
  loadingProducts,
  loadMoreProducts,
  slug,
} = useShop();

const isLoadingMore = ref(false);
const scrollTargetRef = ref<any>(null);
function getDiscountPercent(
  price: number,
  priceDiscount: number
): string | number {
  if (!price || !priceDiscount || priceDiscount >= price) return 0;
  const percent = 100 - (priceDiscount / price) * 100;
  return formatDiscount(percent);
}

function navigateToProduct(product: Product) {
  navigateTo(`/product/${product.id}`);
}

// async function onScroll(_: number, done: () => void) {
//   if (
//     isLoadingMore.value ||
//     loadingProducts.value ||
//     products.value.length >= totalProducts.value
//   ) {
//     done();
//     return;
//   }

//   try {
//     isLoadingMore.value = true;
//     await loadMoreProducts(slug.value as string);
//   } finally {
//     isLoadingMore.value = false;
//     done();
//   }
// }

watch(
  () => slug.value,
  async () => {
    setProductQuery({ ...productQuery.value, skip: 0 });
    await getProducts(slug.value as string);
  }
);

onMounted(async () => {
  await getProducts(slug.value as string);
});
</script>

<style lang="sass"></style>
