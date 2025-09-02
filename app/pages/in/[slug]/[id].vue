<template>
  <q-page :style-fn="myTweak" padding class="wrapper">
    <q-breadcrumbs class="text-grey" active-color="purple">
      <template #separator>
        <q-icon size="1.2em" name="mdi-chevron-right" color="purple" />
      </template>
      <q-breadcrumbs-el :label="shop?.name" :to="`/in/${slug}`" />
      <q-breadcrumbs-el :label="product?.name" class="ellipsis-2" />
    </q-breadcrumbs>
    {{ product }}
  </q-page>
</template>
<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
const { getProductById, product, shop } = useShop();
const route = useRoute();
const id = computed(() => route.params.id);
const slug = computed(() => route.params.slug);

await useLazyAsyncData("product-data", async () => {
  await getProductById(slug.value as string, id.value as string);
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
  const { skus } = product?.value || {};
  if (skus) return skus[0].images[0];
  return "/favicon.ico";
});

const title = computed(() => product?.value?.name || "Produto");
const description = computed(
  () => product?.value?.description || "Confira este produto incrível!"
);

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
