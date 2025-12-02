<template>
  <ClientOnly>
    <q-list
      v-if="productsInCart.length > 0"
      class="scroll"
      style="height: calc(100vh - 200px)"
    >
      <q-item v-for="product in productsInCart" :key="product.id">
        <q-item-section avatar>
          <q-img
            :src="product.sku?.image || product.sku?.images[0]"
            fit="contain"
            spinner-color="primary"
            class="product-image"
            width="100px"
            spinner-size="82px"
            loading="lazy"
            placeholder-src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNhYWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW08L3RleHQ+Cjwvc3ZnPg=="
          >
            <template #error>
              <div
                class="absolute-full flex flex-center bg-secondary text-white text-center"
                style="max-width: 150px; margin: 0 auto"
              >
                {{ $t("imageUnavailable") }}
              </div>
            </template>
          </q-img>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium"
            >{{ product.name }} -
            <span class="text-primary">{{
              product.sku?.model
            }}</span></q-item-label
          >
          <q-item-label>
            <div
              v-if="
                product.sku?.price_discount &&
                product.sku?.price_discount < product.sku?.price
              "
              class="no-wrap row items-center q-gutter-x-sm"
            >
              <div class="text-grey-7" style="text-decoration: line-through">
                {{ numberToReal(product.sku?.price) }}
              </div>
              <div class="text-weight-bold">
                {{ numberToReal(product.sku?.price_discount) }}
              </div>
            </div>
            <div v-else class="text-weight-bold">
              {{ numberToReal(product.sku?.price) }}
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <div
            class="row items-center bg-default justify-between no-wrap rounded-borders"
          >
            <q-btn
              v-if="product.quantity > 1"
              icon="mdi-minus"
              flat
              dense
              color="primary"
              @click="decrementProductQuantity(product)"
            />
            <q-btn
              v-else
              icon="eva-trash-2-outline"
              flat
              dense
              color="negative"
              @click="removeProductFromCart(product)"
            />
            <div class="text-weight-medium text-center q-px-sm">
              {{ product?.quantity }}
            </div>
            <q-btn
              icon="mdi-plus"
              flat
              dense
              color="primary"
              @click="incrementProductQuantity(product)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-item v-else>
      <q-item-section>
        <q-item-label class="text-grey-6">{{
          $t("yourCartIsEmpty")
        }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-card
      v-if="productsInCart.length > 0"
      class="absolute-bottom bg-default"
      flat
    >
      <q-card-section class="q-pa-md q-gutter-y-md">
        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("total") }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-item-label>{{ numberToReal(getTotalPrice()) }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-btn
          :label="$t('finishPurchase')"
          color="primary"
          class="full-width"
          unelevated
          padding="sm md"
          @click="navigateTo('/checkout')"
        />
      </q-card-section>
    </q-card>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useCart } from "~/composables/cart.composable";
import { numberToReal } from "~/utils/functions";
const {
  productsInCart,
  incrementProductQuantity,
  decrementProductQuantity,
  removeProductFromCart,
  getTotalPrice,
} = useCart();
</script>
