<template>
  <q-layout view="lHh LpR lFf">
    <q-header class="text-dark backdrop-blur bg-white" bordered>
      <q-toolbar>
        <q-toolbar-title>
          <q-img
            :src="shop?.logotipo"
            height="40px"
            width="100px"
            spinner-color="primary"
            spinner-size="82px"
            fit="contain"
          />
        </q-toolbar-title>
        <div class="row items-center q-gutter-x-sm">
          <q-input
            v-model="search"
            placeholder="Pesquisar..."
            color="primary"
            outlined
            dense
          >
            <template #prepend>
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
    </q-header>
    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
const search = ref("");
const { getShopBySlug, shop, setProductQuery, productQuery, getProducts } =
  useShop();

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
useHead(() => ({
  title: shop?.value?.name || "Carregando...",
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: shop?.value?.logotipo || "/favicon.ico",
    },
  ],
  meta: [
    {
      name: "description",
      content: shop?.value?.description || "",
    },
    {
      property: "og:title",
      content: shop?.value?.name || "",
    },
    {
      property: "og:description",
      content: shop?.value?.description || "",
    },
    {
      property: "og:image",
      content: shop?.value?.logotipo || "",
    },
    {
      property: "og:url",
      content: currentUrl.value,
    },
    {
      property: "og:site_name",
      content: shop?.value?.name || "",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: shop?.value?.name || "",
    },
    {
      name: "twitter:description",
      content: shop?.value?.description || "",
    },
    {
      name: "twitter:image",
      content: shop?.value?.logotipo || "",
    },
  ],
}));

onMounted(async () => {
  if (slug.value && shop.value === null)
    await getShopBySlug(slug.value as string);
});
</script>

<style lang="sass"></style>
