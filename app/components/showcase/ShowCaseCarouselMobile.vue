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
        <q-item class="col-12">
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
                      {{ $t("from") + " " + numberToReal(product?.price) }}</q-item-label
                    >
                    <div class="row">
                      <q-item-label lines="2" class="text-h5 text-weight-bold">
                        {{
                           $t("by") + " " + numberToReal(product?.price_discount)
                        }}</q-item-label
                      >
                    </div>
                  </div>
                  <div v-else>
                    <q-item-label lines="2" class="text-h5 text-weight-bold">
                      {{ numberToReal(product?.price) }}</q-item-label
                    >
                  </div>
            <q-item-label
              v-if="product.installments?.installment"
              class="text-grey-7 text-caption row items-center no-wrap"
            >
              {{ product.installments?.installment }}x {{ $t("from") }}
              <div class="q-mx-sm">
                {{ numberToReal(product.installments?.value) }}
              </div>
              {{ $t("by") }}
            </q-item-label>
            <q-btn
              :label="$t('checkOut')"
              color="primary"
              unelevated
              padding="sm md"
              style="width: 200px"
              @click="navigateToProduct(product.id)"
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

async function navigateToProduct(productId: string) {
  await navigateTo(`/product/${productId}`);
}
</script>

<style lang="sass"></style>
