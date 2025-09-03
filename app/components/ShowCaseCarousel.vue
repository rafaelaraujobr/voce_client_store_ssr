<template>
  <client-only>
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      animated
      control-color="primary"
      height="400px"
      navigation
      navigation-icon="mdi-radiobox-blank"
      navigation-active-icon="mdi-radiobox-marked"
      arrows
    >
      <q-carousel-slide
        v-for="(product, index) in products.flat().slice(0, 5)"
        :key="product.id"
        :name="index + 1"
        class="bg-default row no-wrap items-center justify-center product-card"
      >
        <q-item class="col-7">
          <q-item-section>
            <q-img
              :src="product.image"
              fit="contain"
              height="300px"
              class="product-image"
              spinner-size="82px"
            />
          </q-item-section>
          <q-item-section class="q-gutter-y-sm">
            <q-item-label
              class="text-subtitle1 q-mb-sm text-weight-medium"
              lines="2"
            >
              {{ product.name }}
            </q-item-label>
            <q-item-label
              v-if="product.price_discount"
              class="text-grey-7 text-caption row items-center no-wrap"
            >
              de
              <div class="q-mx-sm">
                {{
                  product.price_discount
                    ? numberToReal(product.price_discount)
                    : numberToReal(product.price)
                }}
              </div>
              por
            </q-item-label>
            <q-item-label class="text-h3 text-weight-bold">{{
              numberToReal(product.price)
            }}</q-item-label>
            <q-item-label
              v-if="product.installments?.installment"
              class="text-grey-7 text-caption row items-center no-wrap"
            >
              ou {{ product.installments?.installment }}x de
              {{ numberToReal(product.installments?.value) }}</q-item-label
            >
            <q-btn
              label="Confira!"
              color="primary"
              unelevated
              padding="sm md"
              style="width: 200px"
            />
          </q-item-section>
        </q-item>
      </q-carousel-slide>
    </q-carousel>
  </client-only>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useShop } from "~/composables/shop.composable";
import { numberToReal } from "~/utils/functions";
const slide = ref<number | string | null>(null);
const { products } = useShop();
watch(products, async () => {
  await nextTick();
  slide.value = 1;
});
</script>

<style lang="sass">
</style>
