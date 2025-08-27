<template>
  <q-table
    ref="refProductsTable"
    :rows="products"
    row-key="id"
    grid
    hide-pagination
    :pagination="{
      rowsPerPage: 12,
    }"
  >
    <template #item="props">
      <div class="q-pa-sm col-xs-12 col-sm-6 col-md-3">
        <q-card flat bordered class="cursor-pointer product-card">
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
</template>

<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
import { formatDiscount, numberToReal } from "~/utils/functions";
const { products } = useShop();
const refProductsTable = ref<any>(null);
function getDiscountPercent(price: number, priceDiscount: number) {
  if (!price || !priceDiscount || priceDiscount >= price) return 0;
  const percent = 100 - (priceDiscount / price) * 100;
  return formatDiscount(percent);
}
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
