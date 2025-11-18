<template>
  <q-layout view="lHr LpR lFf">
    <q-header class="text-dark backdrop-blur bg-white" bordered>
      <div class="wrapper">
        <!-- Header Mobile -->
        <q-toolbar v-if="$q.screen.lt.md" class="q-px-sm">
          <q-btn flat dense round icon="mdi-menu" @click="menuDrawerOpen = !menuDrawerOpen" />

          <q-img v-if="shop?.logotipo" :src="shop?.logotipo" height="32px" width="48px" spinner-color="primary"
            spinner-size="82px" fit="contain" alt="Logo" class="cursor-pointer q-ml-sm" @click="navigateToHome" />
          <div v-else class="link-decoration-none text-weight-bold text-dark cursor-pointer text-body2 q-ml-sm"
            @click="navigateToHome">
            {{ shop?.name }}
          </div>

          <q-space />

          <q-btn flat dense round icon="mdi-account-outline" @click="navigateTo(`${route.path}?modal=signin`)" />
          <q-btn flat dense round icon="mdi-cart-outline" @click="leftDrawerOpen = !leftDrawerOpen">
            <ClientOnly>
              <q-badge v-if="qtdProductsInCart > 0" color="negative" floating>
                {{ qtdProductsInCart }}
              </q-badge>
            </ClientOnly>
          </q-btn>
        </q-toolbar>

        <!-- Barra de busca mobile -->
        <div v-if="$q.screen.lt.md" class="q-px-md q-pb-sm">
          <q-input v-model="currentSearch" placeholder="O que você está buscando?" color="primary" outlined dense
            rounded @keyup.enter="navigateToSearch(currentSearch as string)">
            <template #append>
              <q-icon name="eva-search-outline" class="cursor-pointer" color="primary"
                @click="navigateToSearch(currentSearch as string)" />
            </template>
          </q-input>
        </div>

        <!-- Header Desktop -->
        <q-toolbar v-if="$q.screen.gt.sm">
          <q-toolbar-title>
            <q-img v-if="shop?.logotipo" :src="shop?.logotipo" height="40px" width="100px" spinner-color="primary"
              spinner-size="82px" fit="contain" alt="Logo" class="cursor-pointer" @click="navigateToHome" />
            <div v-else class="link-decoration-none text-weight-bold text-dark cursor-pointer" @click="navigateToHome">
              {{ shop?.name }}
            </div>
          </q-toolbar-title>
          <div class="row items-center q-gutter-x-sm">
            <q-input v-model="currentSearch" placeholder="O que você esta buscando?" color="primary" outlined dense
              style="min-width: 300px" @keyup.enter="navigateToSearch(currentSearch as string)">
              <template #append>
                <q-icon name="eva-search-outline" class="cursor-pointer" color="primary"
                  @click="navigateToSearch(currentSearch as string)" />
              </template>
            </q-input>
            <q-btn color="primary" label="Entrar" icon="mdi-account-outline" flat padding="sm md"
              class="text-weight-medium" @click="navigateTo(`${route.path}?modal=signin`)" />
            <q-btn color="primary" label="Criar conta" flat padding="sm md" class="text-weight-medium" />
            <q-btn color="primary" label="Carrinho" icon="mdi-cart-outline" flat padding="sm md"
              class="text-weight-medium" :class="{ 'text-weight-bold bg-default': qtdProductsInCart > 0 }"
              @click="leftDrawerOpen = !leftDrawerOpen">
              <ClientOnly>
                <q-badge v-if="qtdProductsInCart > 0" class="absolute-top-right" :label="qtdProductsInCart"
                  color="primary" />
              </ClientOnly>
            </q-btn>
          </div>
        </q-toolbar>
      </div>
    </q-header>

    <!-- Menu Drawer -->
    <q-drawer v-model="menuDrawerOpen" side="left" overlay behavior="mobile" bordered :width="280" class="bg-grey-2">
      <div class="fit column">
        <!-- Header -->
        <div class="bg-grey-3 q-pa-md row items-center justify-between">
          <div class="text-h6 text-weight-medium">Bem-vindo(a)</div>
          <q-btn flat dense round icon="mdi-close" @click="menuDrawerOpen = false" />
        </div>

        <!-- Buttons -->
        <div class="q-pa-md">
          <q-btn unelevated color="primary" label="Entrar" class="full-width" no-caps
            @click="navigateTo(`${route.path}?modal=signin`); menuDrawerOpen = false" />
        </div>

        <!-- Scroll Area -->
        <q-scroll-area class="col bg-white">
          <q-list padding>
            <!-- Home -->
            <q-item v-ripple clickable class="q-py-sm" @click="navigateToHome(); menuDrawerOpen = false">
              <q-item-section avatar>
                <q-icon name="mdi-home-outline" color="primary" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-primary text-weight-medium">Home</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="q-my-sm" />

            <!-- Todos os departamentos -->
            <q-item v-ripple clickable class="q-py-sm" @click="navigateTo('/search'); menuDrawerOpen = false">
              <q-item-section>
                <q-item-label class="text-primary text-weight-bold">Todos os departamentos</q-item-label>
              </q-item-section>
            </q-item>

            <!-- Categories -->
            <q-item v-for="category in shopCategories" :key="category.id" v-ripple clickable class="q-py-sm"
              @click="navigateToCategory(category.id); menuDrawerOpen = false">
              <q-item-section>
                <q-item-label class="text-primary">{{ category.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <!-- Sair - só aparece se estiver logado -->
        <div v-if="false" class="q-pa-md">
          <q-item v-ripple clickable class="q-py-sm">
            <q-item-section>
              <q-item-label class="text-negative text-weight-medium">Sair</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-drawer>

    <!-- Cart Drawer -->
    <ClientOnly>
      <q-drawer v-model="leftDrawerOpen" side="right" overlay behavior="mobile" bordered :width="cartDrawerWidth"
        class="bg-white">
        <q-toolbar class="q-pa-md">
          <q-toolbar-title> Seu carrinho </q-toolbar-title>
          <q-btn flat round dense icon="mdi-close" @click="leftDrawerOpen = false" />
        </q-toolbar>
        <ShoppingCart />
      </q-drawer>
    </ClientOnly>
    <q-page-container>
      <slot />
      <Footer />
    </q-page-container>
    <q-page-scroller v-show="!loadingProducts" position="bottom-right" :scroll-offset="150" :offset="[18, 18]"
      class="scroll-to-top-btn">
      <q-btn fab icon="mdi-arrow-up" color="accent" />
    </q-page-scroller>
    <SignInModal />
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import Footer from "~/components/LayoutFooter.vue";
import ShoppingCart from "~/components/ShoppingCart.vue";
import SignInModal from "~/components/auth/SignInModal.vue";
import { useShop } from "~/composables/shop.composable";
import { useCart } from "~/composables/cart.composable";
const route = useRoute();
const $q = useQuasar();
const { getTotalQuantity } = useCart();
const {
  getShopBySlug,
  shop,
  setProductQuery,
  productQuery,
  loadingProducts,
  slug,
  search,
  setSearch,
  setProductFilters,
} = useShop();

watch(slug, async (newVal) => {
  if (newVal && shop.value === null) await getShopBySlug(newVal as string);
});

const qtdProductsInCart = computed(() => {
  return getTotalQuantity() || 0;
});

const shopCategories = computed(() => {
  return shop.value?.categories || [];
});

const cartDrawerWidth = computed(() => {
  if ($q.screen.lt.sm) return window.innerWidth;
  if ($q.screen.lt.md) return 400;
  return 500;
});

const currentSearch = ref<string | null>(search.value);
const leftDrawerOpen = ref<boolean>(false);
const menuDrawerOpen = ref<boolean>(false);
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

async function navigateToCategory(categoryId: string) {
  setProductFilters({ categories: categoryId });
  await navigateTo("/search");
}

const currentUrl = computed(() => {
  if (import.meta.client && window?.location) return window.location.href;
  return `${process.env.SITE_URL || "https://seu-dominio.com"}${route.fullPath
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

<style lang="sass">
.scroll-to-top-btn
  z-index: 3000 !important
  
  button
    z-index: 3000 !important
</style>
