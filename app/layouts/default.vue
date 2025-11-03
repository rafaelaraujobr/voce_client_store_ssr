<template>
  <q-layout view="lHr LpR lFf">
    <q-header class="text-dark backdrop-blur bg-white" bordered>
      <div class="wrapper">
        <q-toolbar :class="$q.screen.lt.md ? 'justify-center' : ''">
          <!-- Botão hambúrguer para menu lateral (mobile) -->
          <q-btn flat dense round icon="mdi-menu" class="lt-md absolute-left"
            @click="menuDrawerOpen = !menuDrawerOpen" />

          <q-toolbar-title :class="$q.screen.lt.md ? 'absolute-center' : ''">
            <q-img v-if="shop?.logotipo" :src="shop?.logotipo" :height="$q.screen.lt.md ? '32px' : '40px'"
              :width="$q.screen.lt.md ? '80px' : '100px'" spinner-color="primary" spinner-size="82px" fit="contain"
              alt="Logo" class="cursor-pointer" @click="navigateToHome" />
            <div v-else class="link-decoration-none text-weight-bold text-dark cursor-pointer"
              :class="$q.screen.lt.md ? 'text-body2' : ''" @click="navigateToHome">
              {{ shop?.name }}
            </div>
          </q-toolbar-title>

          <!-- Desktop: Barra de busca e botões -->
          <div class="row items-center q-gutter-x-sm gt-sm">
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
              @click="cartDrawerOpen = !cartDrawerOpen">
              <q-badge v-if="qtdProductsInCart > 0" class="absolute-top-right" :label="qtdProductsInCart"
                color="primary" />
            </q-btn>
          </div>

          <!-- Mobile: Apenas ícones essenciais -->
          <!-- <div class="row items-center q-gutter-x-xs gt-md">
            <q-btn flat dense round icon="eva-search-outline" color="primary" @click="showSearchDialog = true" />
            <q-btn flat dense round icon="mdi-cart-outline" color="primary" @click="cartDrawerOpen = !cartDrawerOpen">
              <q-badge v-if="qtdProductsInCart > 0" class="absolute-top-right" :label="qtdProductsInCart"
                color="primary" floating />
            </q-btn>
          </div> -->
        </q-toolbar>
      </div>
    </q-header>

    <!-- Menu lateral de navegação -->
    <q-drawer v-model="menuDrawerOpen" side="left" :overlay="$q.screen.lt.md"
      :behavior="$q.screen.lt.md ? 'mobile' : 'desktop'" bordered :width="280" :breakpoint="992" class="bg-white">
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-weight-bold">Menu</q-item-label>

          <q-item v-ripple clickable @click="navigateToHome">
            <q-item-section avatar>
              <q-icon name="mdi-home-outline" />
            </q-item-section>
            <q-item-section>Início</q-item-section>
          </q-item>

          <q-item v-ripple clickable @click="navigateTo('/search')">
            <q-item-section avatar>
              <q-icon name="mdi-view-grid-outline" />
            </q-item-section>
            <q-item-section>Produtos</q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item-label header class="text-weight-bold lt-md">Conta</q-item-label>

          <q-item v-ripple clickable class="lt-md" @click="navigateTo(`${route.path}?modal=signin`)">
            <q-item-section avatar>
              <q-icon name="mdi-account-outline" />
            </q-item-section>
            <q-item-section>Entrar</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Drawer do carrinho -->
    <q-drawer v-model="cartDrawerOpen" side="right" overlay behavior="mobile" bordered
      :width="$q.screen.lt.sm ? Math.min($q.screen.width, 400) : 500" class="bg-white">
      <q-toolbar class="q-pa-md">
        <q-toolbar-title> Seu carrinho </q-toolbar-title>
        <q-btn flat round dense icon="mdi-close" @click="cartDrawerOpen = false" />
      </q-toolbar>
      <ShoppingCart />
    </q-drawer>

    <!-- Dialog de busca (mobile) -->
    <q-dialog v-model="showSearchDialog" position="top">
      <q-card style="width: 100%; max-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Buscar produtos</div>
          <q-space />
          <q-btn v-close-popup icon="mdi-close" flat round dense />
        </q-card-section>

        <q-card-section>
          <div class="row">
            <div class="col-12">
              <q-input v-model="currentSearch" placeholder="O que você esta buscando?" color="primary" outlined
                autofocus @keyup.enter="handleMobileSearch">
                <template #append>
                  <q-icon name="eva-search-outline" class="cursor-pointer" color="primary"
                    @click="handleMobileSearch" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-container>
      <slot />
      <q-page-scroller v-show="!loadingProducts" position="bottom-right" :scroll-offset="150" :offset="[18, 18]"
        class="page-scroller-mobile-fix gt-sm">
        <q-btn fab icon="mdi-arrow-up" color="accent" />
      </q-page-scroller>
      <!-- Footer desktop -->
      <Footer class="gt-sm" />
    </q-page-container>

    <!-- Barra de navegação inferior (mobile) -->
    <q-footer v-if="$q.screen.lt.md" class="bg-white text-dark border-top">
      <q-tabs v-model="activeTab" dense active-color="primary" indicator-color="primary" class="text-grey-7" stretch>
        <q-tab name="home" icon="mdi-home-outline" label="Início" @click="navigateToHome" />
        <q-tab name="search" icon="mdi-magnify" label="Buscar" @click="openSearchModal" />
        <q-tab name="products" icon="mdi-view-grid-outline" label="Produtos" @click="navigateTo('/search')" />
        <q-tab name="cart" icon="mdi-cart-outline" label="Carrinho" @click="openCartDrawer">
          <q-badge v-if="qtdProductsInCart > 0" color="primary" floating>
            {{ qtdProductsInCart }}
          </q-badge>
        </q-tab>
      </q-tabs>
    </q-footer>

    <SignInModal />
  </q-layout>
</template>

<script setup lang="ts">
import Footer from "~/components/LayoutFooter.vue";
import ShoppingCart from "~/components/ShoppingCart.vue";
import SignInModal from "~/components/auth/SignInModal.vue";
import { useShop } from "~/composables/shop.composable";
import { useCart } from "~/composables/cart.composable";
import { useQuasar } from "quasar";

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
} = useShop();

watch(slug, async (newVal) => {
  if (newVal && shop.value === null) await getShopBySlug(newVal as string);
});

const qtdProductsInCart = computed(() => {
  return getTotalQuantity() || 0;
});

const currentSearch = ref<string | null>(search.value);
const menuDrawerOpen = ref<boolean>(false);
const cartDrawerOpen = ref<boolean>(false);
const showSearchDialog = ref<boolean>(false);
const activeTab = ref<string>("home");

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

watch(
  () => route.path,
  (newPath) => {
    // Atualiza a tab ativa baseado na rota
    if (newPath === "/") {
      activeTab.value = "home";
    } else if (newPath.includes("/search")) {
      activeTab.value = "search";
    } else if (newPath.includes("/product")) {
      activeTab.value = "products";
    }
  },
  { immediate: true }
);

// Quando o drawer do carrinho é fechado, volta a marcar a aba baseada na rota atual
watch(cartDrawerOpen, (isOpen) => {
  if (!isOpen) {
    // Pequeno delay para garantir que o drawer fechou completamente
    setTimeout(() => {
      const currentPath = route.path;
      if (currentPath === "/") {
        activeTab.value = "home";
      } else if (currentPath.includes("/search")) {
        activeTab.value = "search";
      } else if (currentPath.includes("/product")) {
        activeTab.value = "products";
      }
    }, 100);
  }
});

async function navigateToSearch(value: string) {
  setSearch(value);
  setProductQuery({ ...productQuery.value, search: value, skip: 0 });
  if (value) navigateTo(`/search?search=${value}`);
  else navigateTo("/search");
}

function openSearchModal() {
  activeTab.value = "search";
  showSearchDialog.value = true;
}

function openCartDrawer() {
  activeTab.value = "cart";
  cartDrawerOpen.value = true;
}

function handleMobileSearch() {
  navigateToSearch(currentSearch.value as string);
  showSearchDialog.value = false;
}

function navigateToHome() {
  setSearch("");
  setProductQuery({ ...productQuery.value, search: "", skip: 0 });
  currentSearch.value = "";
  navigateTo("/");
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

<style lang="sass" scoped>
.border-top
  border-top: 1px solid rgba(0, 0, 0, 0.12)

.q-footer
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05)
</style>
