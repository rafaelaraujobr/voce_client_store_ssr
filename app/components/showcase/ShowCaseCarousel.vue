<template>
  <client-only>
    <q-carousel
      v-if="isMobile"
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      animated
      swipeable
      control-color="primary"
      height="auto"
      class="mobile-showcase"
    >
      <q-carousel-slide
        v-for="(product, index) in products.flat().slice(0, 5)"
        :key="product.id"
        :name="index + 1"
        class="bg-default column items-center q-pa-md q-pb-xl"
      >
        <q-img
          :src="product.image"
          fit="contain"
          height="200px"
          width="100%"
          class="product-image q-mb-md"
          spinner-size="48px"
          @click="navigateToProduct(product.id)"
        />

        <div class="text-center full-width q-gutter-y-xs">
          <div class="text-subtitle1 text-weight-medium ellipsis-2-lines">
            {{ product.name }}
          </div>

          <div v-if="product.price_discount" class="text-grey-7 text-caption">
            {{ $t("from") }}
            <span class="text-strike q-mx-xs">
              {{ numberToReal(product.price_discount) }}
            </span>
            {{ $t("by") }}
          </div>

          <div class="text-h4 text-weight-bold text-primary">
            {{ numberToReal(product.price) }}
          </div>

          <div
            v-if="product.installments?.installment"
            class="text-grey-7 text-caption"
          >
            {{ product.installments?.installment }}x {{ $t("from") }}
            {{ numberToReal(product.installments?.value) }}
          </div>

          <q-btn
            :label="$t('checkOut')"
            color="primary"
            unelevated
            padding="sm lg"
            class="full-width q-mt-sm q-mb-lg"
            @click="navigateToProduct(product.id)"
          />
        </div>
      </q-carousel-slide>

      <template #control>
        <q-carousel-control position="bottom">
          <div class="row justify-center q-gutter-xs">
            <div
              v-for="(_, index) in products.flat().slice(0, 5)"
              :key="index"
              class="carousel-indicator"
              :class="{ 'carousel-indicator-active': slide === index + 1 }"
              @click="slide = index + 1"
            />
          </div>
        </q-carousel-control>
      </template>
    </q-carousel>

    <q-carousel
      v-else
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
              {{ $t("from") }}
              <div class="q-mx-sm">
                {{
                  product.price_discount
                    ? numberToReal(product.price_discount)
                    : numberToReal(product.price)
                }}
              </div>
              {{ $t("by") }}
            </q-item-label>
            <q-item-label class="text-h3 text-weight-bold">{{
              numberToReal(product.price)
            }}</q-item-label>
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

const isMobile = computed(() => {
  return useQuasar().screen.lt.sm;
});
</script>

<style lang="sass" scoped>
.mobile-showcase
  border-radius: 12px
  overflow: hidden

  :deep(.q-carousel__slide)
    min-height: 380px

.ellipsis-2-lines
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden
  text-overflow: ellipsis
  max-height: 3em

.carousel-indicator
  width: 8px
  height: 8px
  border-radius: 50%
  background: rgba(255, 255, 255, 0.5)
  cursor: pointer
  transition: all 0.3s ease

.carousel-indicator-active
  background: white
  width: 20px
  border-radius: 4px
</style>
