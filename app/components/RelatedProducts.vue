<template>
  <q-card v-if="relatedProducts && relatedProducts?.length > 0" flat class="related-products">
    <q-card-section>
      <div class="text-h5 text-weight-bold text-center">
        Produtos relacionados
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-tab-panels v-model="currentGroup" animated>
        <q-tab-panel
          v-for="(group, index) in productRelatedGroup"
          :key="index"
          :name="index"
        >
          <div class="row q-col-gutter-md">
            <div v-for="product in group" :key="product.id" class="col-3">
              <q-card
                flat
                bordered
                class="cursor-pointer product-card border-default col-3"
                role="button"
                :aria-label="`Ver produto ${product.name}`"
                tabindex="0"
                @click="navigateToProduct(product.id)"
                @keydown.enter="navigateToProduct(product.id)"
                @keydown.space="navigateToProduct(product.id)"
              >
                <q-card-section class="row q-pa-none q-ma-none items-center">
                  <div class="col-12 bg-default q-py-sm">
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
                          class="absolute-full flex flex-center bg-secondary text-white"
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
                            <q-item-label
                              lines="2"
                              class="text-h5 text-weight-bold"
                            >
                              {{
                                numberToReal(product?.price_discount)
                              }}</q-item-label
                            >
                          </div>
                        </div>
                        <div v-else>
                          <q-item-label
                            lines="2"
                            class="text-h5 text-weight-bold"
                          >
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
        </q-tab-panel>
      </q-tab-panels>
      <div class="row justify-end q-gutter-x-sm q-mt-md">
        <q-btn
          icon="mdi-chevron-left"
          dense
          padding="sm"
          text-color="primary"
          class="bg-default"
          :disable="currentGroup === 0"
          @click="prevProductGroup"
        />
        <q-btn
          icon="mdi-chevron-right"
          class="bg-default"
          dense
          padding="sm"
          text-color="primary"
          :disable="currentGroup === productRelatedGroup.length - 1"
          @click="nextProductGroup"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
import { numberToReal, formatDiscount } from "~/utils/functions";
const { relatedProducts } = useShop();
const currentGroup = ref<number>(0);
const productRelatedGroup = computed(() => {
  if (!relatedProducts.value || !Array.isArray(relatedProducts.value)) return [];
  const products = relatedProducts.value;
  const groups = [];
  for (let i = 0; i < products.length; i += 4) {
    groups.push(products.slice(i, i + 4));
  }
  return groups;
});

function nextProductGroup() {
  currentGroup.value++;
}

function prevProductGroup() {
  currentGroup.value--;
}

function navigateToProduct(productId: string) {
  navigateTo(`/product/${productId}`);
}

function getDiscountPercent(
  price: number,
  priceDiscount: number
): string | number {
  if (!price || !priceDiscount || priceDiscount >= price) return 0;
  const percent = 100 - (priceDiscount / price) * 100;
  return formatDiscount(percent);
}
</script>

<style lang="sass">

.related-products .q-tab-panel
  padding: 0 !important
</style>
