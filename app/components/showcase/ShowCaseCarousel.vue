<template>
  <client-only>
    <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left" animated
      control-color="primary" :height="$q.screen.lt.md ? 'auto' : '400px'" navigation
      navigation-icon="mdi-radiobox-blank" navigation-active-icon="mdi-radiobox-marked" :arrows="$q.screen.gt.sm"
      class="carousel-showcase">
      <q-carousel-slide v-for="(product, index) in products.flat().slice(0, 5)" :key="product.id" :name="index + 1"
        :class="$q.screen.lt.md ? 'bg-default column items-center q-pa-md q-pb-xl' : 'bg-default row no-wrap items-center justify-center product-card'"
        :style="$q.screen.lt.md ? 'padding-bottom: 48px !important;' : ''">
        <!-- Mobile Layout -->
        <template v-if="$q.screen.lt.md">
          <q-img :src="product.image" fit="contain" :height="$q.screen.lt.sm ? '200px' : '250px'"
            class="product-image q-mb-md" spinner-size="82px" style="width: 100%; max-width: 300px;" />

          <div class="q-gutter-y-sm" style="width: 100%; max-width: 340px;">
            <div class="text-h6 text-weight-bold text-center" style="line-height: 1.4; min-height: 48px;">
              {{ product.name }}
            </div>

            <div v-if="product.price_discount" class="text-grey-7 text-caption text-left">
              de {{ product.price_discount ? numberToReal(product.price_discount) : numberToReal(product.price) }} por
            </div>

            <div class="text-h4 text-weight-bold text-left">
              {{ numberToReal(product.price) }}
            </div>

            <div v-if="product.installments?.installment" class="text-grey-7 text-caption text-left">
              até {{ product.installments?.installment }}x sem juros
            </div>

            <q-btn label="CONFIRA !" color="primary" unelevated no-caps class="q-mt-md q-mb-lg"
              style="width: 100%; max-width: 320px; border-radius: 8px; font-weight: 500;" padding="12px"
              @click="navigateToProduct(product.id)" />
          </div>
        </template>

        <!-- Desktop Layout -->
        <q-item v-else class="col-7">
          <q-item-section>
            <q-img :src="product.image" fit="contain" height="300px" class="product-image" spinner-size="82px" />
          </q-item-section>
          <q-item-section class="q-gutter-y-sm">
            <q-item-label class="text-subtitle1 q-mb-sm text-weight-medium" lines="2">
              {{ product.name }}
            </q-item-label>
            <q-item-label v-if="product.price_discount" class="text-grey-7 text-caption row items-center no-wrap">
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
            <q-item-label v-if="product.installments?.installment"
              class="text-grey-7 text-caption row items-center no-wrap">
              ou {{ product.installments?.installment }}x de
              {{ numberToReal(product.installments?.value) }}</q-item-label>
            <q-btn label="Confira!" color="primary" unelevated padding="sm md" style="width: 200px"
              @click="navigateToProduct(product.id)" />
          </q-item-section>
        </q-item>
      </q-carousel-slide>
    </q-carousel>
  </client-only>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useShop } from "~/composables/shop.composable";
import { numberToReal } from "~/utils/functions";

const slide = ref<number>(1);
const { products } = useShop();

watch(products, async (newProducts) => {
  if (newProducts && newProducts.length > 0) {
    await nextTick();
    slide.value = 1;
  }
}, { immediate: true });

async function navigateToProduct(productId: string) {
  await navigateTo(`/product/${productId}`);
}
</script>

<style lang="sass">
</style>
