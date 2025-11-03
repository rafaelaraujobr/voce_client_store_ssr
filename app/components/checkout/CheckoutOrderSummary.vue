<template>
  <q-card class="bg-default" flat>
    <q-card-section>
      <q-item v-for="product in productsInCart" :key="product.id">
        <q-item-section avatar>
          <q-img
            :src="product.image || product.images[0]"
            fit="contain"
            spinner-color="primary"
            class="product-image"
            width="48px"
            spinner-size="40px"
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
        </q-item-section>
        <q-item-section>
          <q-item-label
            class="ellipsis cursor-pointer text-weight-medium"
            style="max-width: 200px"
            >{{ product.name }}
            <q-tooltip>{{ product.name }}</q-tooltip>
          </q-item-label>
          <q-item-label class="text-weight-medium text-grey-6"
            >Quantidade: {{ product.quantity }}</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <div class="row no-wrap items-center q-gutter-x-sm">
            <div class="text-weight-bold text-dark">
              {{
                numberToReal(
                  product.price_discount * product.quantity ||
                    product.price * product.quantity
                )
              }}
            </div>
            <q-btn
              icon="mdi-delete-outline"
              flat
              dense
              color="negative"
              @click="removeProductFromCart(product)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-item dense>
        <q-item-section>
          <q-item-label class="text-weight-medium">Subtotal</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-item-label class="text-weight-medium">{{
            numberToReal(getTotalPrice())
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item dense>
        <q-item-section>
          <q-item-label class="text-weight-medium">Frete</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-item-label class="text-weight-medium">{{
            numberToReal(shipping)
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-bold">Total a pagar</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-item-label class="text-weight-bold">{{
            numberToReal(getTotalPrice() + shipping)
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { useCart } from "~/composables/cart.composable";
const { productsInCart, removeProductFromCart, getTotalPrice } = useCart();
const shipping = ref(10);
</script>
