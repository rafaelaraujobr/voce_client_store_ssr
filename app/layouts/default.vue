<template>
  <q-layout view="lHr LpR lFf">
    <q-header class="text-dark backdrop-blur bg-white" bordered>
      <div class="wrapper">
        <q-toolbar>
          <q-btn v-if="isMobile" flat dense icon="mdi-menu" size="lg" />
          <q-toolbar-title :class="{ 'text-center q-ml-xl': isMobile }">
            <q-img
              v-if="shop?.logotipo"
              :src="shop?.logotipo"
              height="40px"
              width="100px"
              spinner-color="primary"
              spinner-size="82px"
              fit="contain"
              alt="Logo"
              class="cursor-pointer"
              @click="navigateToHome"
            />
            <div
              v-else
              class="link-decoration-none text-weight-bold text-dark cursor-pointer"
              @click="navigateToHome"
            >
              {{ shop?.name }}
            </div>
          </q-toolbar-title>
          <div class="row items-center q-gutter-x-sm">
            <q-input
              v-if="!isMobile"
              v-model="currentSearch"
              :placeholder="$t('searchPlaceholder')"
              color="primary"
              outlined
              dense
              style="min-width: 300px"
              @keyup.enter="navigateToSearch(currentSearch as string)"
            >
              <template #append>
                <q-icon
                  name="eva-search-outline"
                  class="cursor-pointer"
                  color="primary"
                  @click="navigateToSearch(currentSearch as string)"
                />
              </template>
            </q-input>
            <q-btn
              color="primary"
              :label="isMobile ? '' : $t('login')"
              icon="mdi-account-outline"
              flat
              :padding="isMobile ? 'xs sm' : 'sm md'"
              class="text-weight-medium"
              @click="navigateTo(`${route.path}?modal=signin`)"
            />
            <q-btn
              v-if="!isMobile"
              color="primary"
              :label="$t('createAccount')"
              flat
              :padding="isMobile ? 'xs sm' : 'sm md'"
              class="text-weight-medium"
              :to="`/auth/sign-up`"
            />
            <q-btn
              color="primary"
              :label="isMobile ? '' : $t('cart')"
              icon="mdi-cart-outline"
              flat
              :padding="isMobile ? 'xs sm' : 'sm md'"
              class="text-weight-medium"
              :class="{ 'text-weight-bold bg-default': qtdProductsInCart > 0 }"
              @click="leftDrawerOpen = !leftDrawerOpen"
            >
              <q-badge
                v-if="qtdProductsInCart > 0"
                class="absolute-top-right"
                :label="qtdProductsInCart"
                color="primary"
              />
            </q-btn>
            <LanguageSwitcher />
          </div>
        </q-toolbar>
      </div>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      side="right"
      overlay
      behavior="desktop"
      bordered
      :width="500"
      class="bg-white"
    >
      <q-toolbar class="q-pa-md">
        <q-toolbar-title> {{ $t("yourCart") }} </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="mdi-close"
          @click="leftDrawerOpen = false"
        />
      </q-toolbar>
      <ShoppingCart />
    </q-drawer>
    <q-page-container>
      <q-page-scroller
        v-show="!loadingProducts"
        position="bottom-right"
        :scroll-offset="150"
        :offset="[18, 18]"
        class="z-max"
      >
        <q-btn fab icon="mdi-arrow-up" color="accent" class="z-max" />
      </q-page-scroller>
      <slot />

      <Footer v-if="!isMobile" />
      <LayoutFooterMobile v-else />
    </q-page-container>
    <SignInModal />
    <RegisterModal />
  </q-layout>
</template>

<script setup lang="ts">
import LanguageSwitcher from "~/components/shared/LanguageSwitcher.vue";
import Footer from "~/components/LayoutFooter.vue";
import LayoutFooterMobile from "~/components/LayoutFooterMobile.vue";
import ShoppingCart from "~/components/ShoppingCart.vue";
import SignInModal from "~/components/auth/SignInModal.vue";
import { useShop } from "~/composables/shop.composable";
import { useCart } from "~/composables/cart.composable";
const route = useRoute();
const { getTotalQuantity, productsInCart } = useCart();
const {
  getShopBySlug,
  shop,
  setProductQuery,
  productQuery,
  loadingProducts,
  slug,
  search,
  setSearch,
} = useShop();

const isMobile = computed(() => {
  return useQuasar().screen.lt.sm;
});

watch(slug, async (newVal) => {
  if (newVal && shop.value === null) await getShopBySlug(newVal as string);
});

const qtdProductsInCart = computed(() => {
  return getTotalQuantity() || 0;
});

const currentSearch = ref<string | null>(search.value);
const leftDrawerOpen = ref<boolean>(false);
watch(search, (newVal) => {
  currentSearch.value = newVal;
});

watch(
  () => route.query.search,
  (newVal) => {
    if (newVal && newVal !== search.value) {
      setSearch(newVal as string);
      currentSearch.value = newVal as string;
    }
  }
);

watch(productsInCart, (newVal) => {
  if (newVal.length === 0) leftDrawerOpen.value = false;
});

async function navigateToSearch(value: string) {
  setSearch(value);
  setProductQuery({ ...productQuery.value, search: value, skip: 0 });
  if (value) navigateTo(`/search?search=${value}`);
  else navigateTo("/search");
}

function navigateToHome() {
  setSearch("");
  setProductQuery({ ...productQuery.value, search: "", skip: 0 });
  currentSearch.value = "";
  navigateTo("/");
}

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
