<template>
  <client-only>
    <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left" animated
      control-color="primary" :height="$q.screen.lt.md ? '480px' : '400px'" navigation
      navigation-icon="mdi-radiobox-blank" navigation-active-icon="mdi-radiobox-marked" arrows>
      <q-carousel-slide v-for="(product, index) in products.flat().slice(0, 5)" :key="product.id" :name="index + 1"
        :class="$q.screen.lt.md ? 'bg-default column items-center justify-center product-card q-pa-md' : 'bg-default row no-wrap items-center justify-center product-card'">
        <div :class="$q.screen.lt.md ? 'full-width q-mb-md' : 'col-7'">
          <q-img :src="product.image" fit="contain" :height="$q.screen.lt.md ? '200px' : '300px'" class="product-image"
            spinner-size="82px" />
        </div>
        <div :class="$q.screen.lt.md ? 'full-width q-px-lg text-center' : 'col-5'" class="q-gutter-y-sm">
          <q-item-label :class="$q.screen.lt.md ? 'text-body2' : 'text-subtitle1'" class="q-mb-sm text-weight-medium"
            lines="2">
            {{ product.name }}
          </q-item-label>
          <q-item-label v-if="product.price_discount" class="text-grey-7 text-caption row items-center no-wrap"
            :class="$q.screen.lt.md ? 'justify-center' : ''">
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
          <q-item-label :class="$q.screen.lt.md ? 'text-h5' : 'text-h3'" class="text-weight-bold">{{
            numberToReal(product.price)
          }}</q-item-label>
          <q-item-label v-if="product.installments?.installment"
            class="text-grey-7 text-caption row items-center no-wrap" :class="$q.screen.lt.md ? 'justify-center' : ''">
            ou {{ product.installments?.installment }}x de
            {{ numberToReal(product.installments?.value) }}</q-item-label>
          <div :class="$q.screen.lt.md ? 'flex justify-center' : ''">
            <q-btn label="Confira!" color="primary" unelevated padding="sm md"
              :style="$q.screen.lt.md ? 'width: 90%' : 'width: 200px'" />
          </div>
        </div>
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
