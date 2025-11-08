<template>
  <q-page :style-fn="myTweak" padding class="wrapper">
    <q-breadcrumbs class="text-grey q-my-lg text-caption" active-color="purple">
      <template #separator>
        <q-icon size="1.2em" name="mdi-chevron-right" color="purple" />
      </template>
      <q-breadcrumbs-el :label="shop?.name" :to="`/`" />
      <q-breadcrumbs-el :label="category" />
      <q-breadcrumbs-el
        :label="product?.name"
        class="ellipsis"
        style="max-width: 200px"
      />
    </q-breadcrumbs>
    <q-item>
      <q-item-section>
        <ProductCarousel :images="skuSelected?.sku?.images" />
      </q-item-section>
      <q-item-section class="q-gutter-y-sm">
        <q-item-label class="row items-center q-gutter-x-sm">
          <q-icon name="mdi-star" color="primary" size="1.2em" />
          <div class="text-primary">4.8</div>
          <div class="text-grey">(120 avaliações)</div>
          <q-btn
            label="Copiar link"
            color="positive"
            unelevated
            padding="sm md"
            flat
            dense
            icon="mdi-content-copy"
            size="xs"
            @click="copyLink"
          />
        </q-item-label>
        <q-item-label>
          {{ product?.name }}
        </q-item-label>
        <q-item-label v-if="(product as any)?.skus?.length > 1">
          <q-radio
            v-for="(i, index) in (product as any)?.skus"
            :key="index"
            v-model="skuSelectedId"
            :val="i.id"
            :label="i.model"
          />
        </q-item-label>
        <q-item-label
          v-if="skuSelected?.sku?.price_discount < skuSelected?.sku?.price"
          class="text-caption text-negative q-pt-sm"
        >
          {{ numberToReal(skuSelected.sku?.price_discount) }}
        </q-item-label>
        <q-item-label
          v-if="skuSelected?.sku?.price"
          class="text-h5 text-weight-bold"
        >
          {{ numberToReal(skuSelected.sku?.price) }}
          <q-badge
            v-if="
              skuSelected.sku?.price &&
              skuSelected.sku?.price_discount &&
              skuSelected.sku?.price_discount < skuSelected.sku?.price
            "
            :style="{
              backgroundColor: '#FFC107',
              top: '10px',
            }"
            text-color="black"
            class="text-subtitle1 text-weight-bold"
            >-
            {{
              getDiscountPercent(
                skuSelected.sku?.price,
                skuSelected.sku?.price_discount
              )
            }}%</q-badge
          >
        </q-item-label>
        <q-item-label class="text-caption row items-center no-wrap q-mb-md">
          até {{ installments?.installment }}x de
          {{ numberToReal(installments?.value) }}</q-item-label
        >
        <q-item-label
          class="text-caption row items-center no-wrap q-gutter-x-md q-pa-none"
        >
          <q-btn
            label="Comprar agora"
            color="dark"
            unelevated
            padding="sm md"
            :no-caps="false"
          />
          <q-btn
            v-if="!productsInCart.find((p) => p.id === skuSelected.id)"
            label="Adicionar ao carrinho"
            color="default"
            unelevated
            padding="sm md"
            text-color="dark"
            class="bg-default"
            icon="mdi-cart-plus"
            @click="addProductToCart(skuSelected)"
          />
          <q-btn
            v-else
            label="Remover do carrinho"
            color="negative"
            unelevated
            padding="sm md"
            :no-caps="false"
            @click="removeProductFromCart(skuSelected)"
          />
        </q-item-label>
        <q-item-label
          class="text-caption row items-center no-wrap q-gutter-x-sm"
        >
          Vendido por:
          <q-img
            :src="product?.company?.logotipo"
            fit="contain"
            height="50px"
            width="80px"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator spaced inset />
    <div class="q-gutter-y-md q-pt-md">
      <q-list class="rounded-borders">
        <q-expansion-item default-opened expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-text" color="primary" />
            </q-item-section>
            <q-item-section> Descrição do produto </q-item-section>
          </template>
          <q-card>
            <q-card-section>
              {{ product?.description }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-information-outline" color="primary" />
            </q-item-section>
            <q-item-section> Caracteristicas </q-item-section>
          </template>
          <q-card>
            <q-card-section> caracteristicas </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-ruler-square" color="primary" />
            </q-item-section>
            <q-item-section> Dimensões </q-item-section>
          </template>
          <q-card>
            <q-card-section> dimensões </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
      <q-list class="rounded-borders">
        <q-expansion-item expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-check-decagram-outline" color="primary" />
            </q-item-section>
            <q-item-section> Compra segura </q-item-section>
          </template>
          <q-card>
            <q-card-section>compra segura </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-lock-check-outline" color="primary" />
            </q-item-section>
            <q-item-section> Pagamento segura </q-item-section>
          </template>
          <q-card>
            <q-card-section> Pagamento seguro </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-lock-check-outline" color="primary" />
            </q-item-section>
            <q-item-section> Politica de troca e devolução </q-item-section>
          </template>
          <q-card>
            <q-card-section> Politica de troca e devolução </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
    <q-separator spaced inset />
    <RelatedProducts />
  </q-page>
</template>
<script setup lang="ts">
import ProductCarousel from "~/components/ProductCarousel.vue";
import RelatedProducts from "~/components/RelatedProducts.vue";
import { numberToReal, formatDiscount } from "~/utils/functions";
const { getProductById, getRelatedProducts, product, shop, slug } = useShop();
const { addProductToCart, removeProductFromCart, productsInCart } = useCart();
const route = useRoute();
const id = computed(() => route.params.id);
const skuSelectedId = ref<string | null>(null);

watch(product, () => {
  if ((product.value as any)?.skus && (product.value as any)?.skus.length > 0)
    skuSelectedId.value = (product.value as any).skus[0].id;
  else skuSelectedId.value = null;
});

const installments = computed(() => {
  if (
    Array.isArray((product.value as any)?.installments) &&
    (product.value as any)?.installments.length > 0
  ) {
    const count = (product.value as any).installments.length;
    return (product.value as any).installments[count - 1];
  }
  return { installment: 0, value: 0 };
});

const skuSelected = computed(() => {
  if (!product.value) return null;
  const { skus, ...rest } = product.value as any;
  if (Array.isArray(skus))
    return {
      sku: skus.find((sku: any) => sku.id === skuSelectedId.value),
      ...rest,
    };

  return { ...rest, sku: { ...skus[0], images: skus[0].images ?? [] } };
});

const { refresh } = await useLazyAsyncData(`product-${id.value}`, async () => {
  await getProductById(slug.value as string, id.value as string);
  await getRelatedProducts(id.value as string);
});

watch(id, async (newId, oldId) => {
  if (newId && newId !== oldId) await refresh();
});

function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}

const currentUrl = computed(() => {
  if (import.meta.client && window?.location) return window.location.href;

  return `${process.env.SITE_URL || "https://seu-dominio.com"}${
    route.fullPath
  }`;
});
const image = computed(() => {
  const skus = (product.value as any)?.skus;
  if (Array.isArray(skus) && skus.length > 0 && skus[0]?.images?.length > 0) {
    return skus[0].images[0];
  }
  return "/favicon.ico";
});

const title = computed(() => product?.value?.name || "Produto");
const description = computed(() =>
  product?.value?.description
    ? product.value.description
    : "Confira este produto incrível!"
);
const category = computed(() =>
  product?.value?.category_id ? product.value.category_id : "Produto"
);

function copyLink() {
  navigator.clipboard.writeText(currentUrl.value);
  Notify.create({
    message: "Link copiado para a área de transferência",
    color: "positive",
    icon: "mdi-content-copy",
  });
}

function getDiscountPercent(price: number, priceDiscount: number) {
  if (!price || !priceDiscount || priceDiscount >= price) return 0;
  const percent = 100 - (priceDiscount / price) * 100;
  return formatDiscount(percent);
}

useSeoMeta({
  title: title,
  description: description,
  ogTitle: title,
  ogDescription: description,
  ogImage: image,
  ogUrl: currentUrl,
  ogSiteName: shop?.value?.name || title,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: image,
});

useHead(() => ({
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: image.value,
    },
  ],
}));
</script>
