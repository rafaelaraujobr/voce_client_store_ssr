<template>
  <div v-if="loadingProducts" class="row q-col-gutter-sm full-width">
    <div v-for="n in 12" :key="n" class="q-pa-sm col-xs-12 col-sm-6 col-md-3">
      <q-card flat bordered class="product-card">
        <q-card-section
          class="row q-pa-none q-ma-none justify-center items-center"
        >
          <div class="col-4 col-md-12 bg-default q-py-sm">
            <q-skeleton height="118px" />
          </div>
          <div class="col-8 col-md-12 q-py-md">
            <q-item>
              <q-item-section>
                <q-skeleton type="text" class="q-mb-sm" />
                <q-skeleton type="text" width="60%" />
                <q-skeleton type="text" width="40%" class="q-mt-sm" />
              </q-item-section>
            </q-item>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <q-table
    v-else
    ref="refProductsTable"
    :rows="products"
    row-key="id"
    grid
    hide-pagination
    :pagination="pagination"
  >
    <template #item="props">
      <div class="q-pa-sm col-xs-12 col-sm-6 col-md-3">
        <q-card
          flat
          bordered
          class="cursor-pointer product-card border-default"
          role="button"
          :aria-label="`Ver produto ${props.row.name}`"
          tabindex="0"
          @click="navigateToProduct(props.row)"
          @keydown.enter="navigateToProduct(props.row)"
          @keydown.space="navigateToProduct(props.row)"
        >
          <q-card-section
            class="row q-pa-none q-ma-none justify-center items-center"
          >
            <div class="col-4 col-md-12 bg-default q-py-sm">
              <q-img
                :src="props.row.image"
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
                    props.row?.name
                  }}</q-item-label>
                  <div
                    v-if="
                      props.row.price &&
                      props.row.price_discount &&
                      props.row.price_discount < props.row.price
                    "
                  >
                    <q-item-label
                      lines="2"
                      class="text-subtitle1 text-negative"
                      style="text-decoration: line-through"
                    >
                      {{ numberToReal(props.row?.price) }}</q-item-label
                    >
                    <div class="row">
                      <q-item-label lines="2" class="text-h5 text-weight-bold">
                        {{
                          numberToReal(props.row?.price_discount)
                        }}</q-item-label
                      >
                    </div>
                  </div>
                  <div v-else>
                    <q-item-label lines="2" class="text-h5 text-weight-bold">
                      {{ numberToReal(props.row?.price) }}</q-item-label
                    >
                  </div>
                  <div
                    v-if="
                      props.row?.installments &&
                      props.row.installments.installment > 2
                    "
                    class="text-grey-6 text-caption"
                  >
                    <b>3x</b>
                    sem juros de
                    <b>{{
                      numberToReal(
                        (props.row.installments.value /
                          props.row.installments.installment) *
                          3
                      )
                    }}</b>
                  </div>
                </q-item-section>
              </q-item>
            </div>
            <q-badge
              v-if="
                props.row.price &&
                props.row.price_discount &&
                props.row.price_discount < props.row.price
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
                getDiscountPercent(props.row.price, props.row.price_discount)
              }}%</q-badge
            >
          </q-card-section>
        </q-card>
      </div>
    </template>
  </q-table>

  <div v-if="!loadingProducts" class="row justify-center items-center q-mt-md">
    <q-pagination
      v-model="pagination.page"
      :max="maxPages"
      :max-pages="6"
      active-design="unelevated"
      active-color="primary"
      color="primary"
      direction-links
      gutter="sm"
    />
  </div>
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
} = useShop();

const refProductsTable = ref<HTMLElement | null>(null);
const route = useRoute();
const slug = computed(() => route.params.slug);
const pagination = reactive({
  sort: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 24,
});

const maxPages = computed(() =>
  Math.ceil(totalProducts.value / productQuery.value.take)
);
function getDiscountPercent(price: number, priceDiscount: number) {
  if (!price || !priceDiscount || priceDiscount >= price) return 0;
  const percent = 100 - (priceDiscount / price) * 100;
  return formatDiscount(percent);
}

// Função para navegar para detalhes do produto
function navigateToProduct(product: Product) {
  // Implementar navegação para página do produto
  console.log("Navegar para produto:", product);
}

watch(
  () => pagination.page,
  async (newPage) => {
    const skip = (newPage - 1) * productQuery.value.take;
    setProductQuery({ ...productQuery.value, skip });
    await getProducts(slug.value as string);
  }
);

onMounted(async () => {
  await getProducts(slug.value as string);
});
</script>

<style lang="sass">
.product-card
  min-height: 140px
  height: 100%
  display: flex
  flex-direction: column
  z-index: 1

.product-image
  mix-blend-mode: multiply
</style>
