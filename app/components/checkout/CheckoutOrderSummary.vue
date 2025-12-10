<template>
  <q-card class="bg-default" flat>
    <q-card-section v-if="productsInCart.length > 0">
      <q-item
        v-for="product in productsInCart"
        :key="product.id"
        clickable
        @click.stop="navigateToProduct(product)"
      >
        <q-item-section avatar>
          <q-img
            :src="product?.sku?.image || product?.sku?.images[0]"
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
            >{{ product?.name }}
            <q-tooltip>{{ product.name }}</q-tooltip>
          </q-item-label>
          <q-item-label
            class="ellipsis cursor-pointer text-primary"
            style="max-width: 200px"
          >
            <div class="text-primary">
              {{ product.sku?.model }}
            </div>
          </q-item-label>
          <q-item-label class="text-weight-medium text-grey-6"
            >Quantidade: {{ product?.quantity }}</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <div class="row no-wrap items-center q-gutter-x-sm">
            <div class="text-weight-bold text-dark">
              {{
                numberToReal(
                  product.sku?.price_discount * product?.quantity ||
                    product.sku?.price * product?.quantity
                )
              }}
              <div
                v-if="
                  product.sku?.price_discount &&
                  product.sku?.price_discount < product.sku?.price
                "
                class="text-grey-7"
                style="text-decoration: line-through"
              >
                {{ numberToReal(product.sku?.price * product?.quantity) }}
              </div>
            </div>
            <q-btn
              icon="mdi-delete-outline"
              flat
              dense
              color="negative"
              @click="removeProductCart(product)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-separator />
    <q-card-section v-if="productsInCart.length > 0">
      <div class="row items-center q-gutter-x-sm no-wrap">
        <div class="col-12 col-md-9">
          <q-input
            v-model="couponCode"
            type="text"
            label="Cupom de desconto"
            outlined
            dense
            bg-color="white"
            class="full-width"
            clear-icon="mdi-close"
            clearable
            @clear="couponCode = ''"
            @keyup.enter="dialogCoupon"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-btn
            label="Aplicar"
            color="primary"
            dense
            padding="sm lg"
            :loading="loadingCoupon"
            :disable="couponCode.length === 0 || loadingCoupon"
            @click="dialogCoupon"
          />
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-item dense>
        <q-item-section>
          <q-item-label class="text-weight-medium">{{
            $t("subtotal")
          }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-item-label class="text-weight-bold">{{
            numberToReal(getTotalPrice())
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="getTotalDiscount() > 0" dense>
        <q-item-section>
          <q-item-label class="text-weight-medium">{{
            $t("discount")
          }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-item-label class="text-weight-bold"
            >-{{ numberToReal(getTotalDiscount()) }}</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item v-if="productsInCart.length > 0" dense>
        <q-item-section>
          <q-item-label class="text-weight-medium">{{
            $t("freight")
          }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-item-label class="text-weight-bold">{{
            formatValueShipping(freightTotal || 0)
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-bold">{{
            $t("totalToPay")
          }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-item-label class="text-weight-bold">{{
            numberToReal(getTotalPrice() + (freightTotal || 0))
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { useCart } from "~/composables/cart.composable";
const {
  productsInCart,
  removeProductCart,
  getTotalPrice,
  getTotalDiscount,
  freightTotal,
} = useCart();
const couponCode = ref<string>("");
const loadingCoupon = ref<boolean>(false);
function dialogCoupon() {
  loadingCoupon.value = true;
  setTimeout(() => {
    loadingCoupon.value = false;
    Dialog.create({
      title:
        "<span class='text-dark text-weight-bold'>Cupom inválido ou expirado</span>",
      html: true,
      message: `<span class="text-dark">O cupom de desconto <span class="text-negative text-weight-bold">${couponCode.value}</span> não é válido. Por favor, tente novamente.</span>`,
      ok: true,
      cancel: false,
      persistent: true,
    });
  }, 1000);
}

function navigateToProduct(product: any) {
  navigateTo(`/product/${product.id}`);
}
</script>
