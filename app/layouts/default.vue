<template>
  <q-layout view="lHh LpR lFf">
    <q-header class="text-dark backdrop-blur bg-white" bordered>
      <div class="wrapper">
        <q-toolbar>
          <q-toolbar-title>
            <q-img
              :src="shop?.logotipo"
              height="40px"
              width="100px"
              spinner-color="primary"
              spinner-size="82px"
              fit="contain"
              alt="Logo"
              class="cursor-pointer"
              @click="navigateTo(`/in/${slug}`)"
            />
          </q-toolbar-title>
          <div class="row items-center q-gutter-x-sm">
            <q-input
              v-model="search"
              placeholder="O que você esta buscando?"
              color="primary"
              outlined
              dense
              style="min-width: 300px"
            >
              <template #append>
                <q-icon name="eva-search-outline" color="primary" />
              </template>
            </q-input>
            <q-btn
              color="primary"
              label="Entrar"
              icon="mdi-account-outline"
              flat
              padding="sm md"
              class="text-weight-medium"
            />
            <q-btn
              color="primary"
              label="Criar conta"
              flat
              padding="sm md"
              class="text-weight-medium"
            />
            <q-btn
              color="primary"
              label="Carrinho"
              icon="mdi-cart-outline"
              flat
              padding="sm md"
              class="text-weight-medium"
            />
          </div>
        </q-toolbar>
      </div>
    </q-header>

    <q-page-container>
      <slot />
      <q-page-scroller
        v-show="!loadingProducts"
        position="bottom-right"
        :scroll-offset="150"
        :offset="[18, 18]"
      >
        <q-btn fab icon="mdi-arrow-up" color="accent" />
      </q-page-scroller>
      <Footer />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
import Footer from "~/components/LayoutFooter.vue";
const {
  getShopBySlug,
  shop,
  setProductQuery,
  productQuery,
  getProducts,
  loadingProducts,
} = useShop();
const search = ref("");
const route = useRoute();
const slug = computed(() => route.params.slug);

watch(slug, async (newVal) => {
  if (newVal && shop.value === null) await getShopBySlug(newVal as string);
});

watch(search, async (newVal) => {
  if (newVal) {
    setProductQuery({
      ...productQuery.value,
      search: newVal,
    });
    await getProducts(slug.value as string);
    navigateTo(`/in/${slug.value}?search=${newVal}`);
  }
});

const currentUrl = computed(() => {
  if (import.meta.client && window?.location) return window.location.href;
  return `${process.env.SITE_URL || "https://seu-dominio.com"}${
    route.fullPath
  }`;
});

await useLazyAsyncData("shop-data", async () => {
  if (!slug.value) return null;
  await getShopBySlug(slug.value as string);
  return shop.value;
});

const title = computed(() => shop?.value?.name || "Carregando...");
const description = computed(() => shop?.value?.description || "Carregando...");
const image = computed(() => shop?.value?.logotipo || "/favicon.ico");

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

<style lang="sass"></style>
