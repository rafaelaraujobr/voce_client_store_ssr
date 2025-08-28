<template>
  <q-page :style-fn="myTweak" padding class="wrapper">
    <!-- Estado de carregamento da loja -->
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-ios size="3em" color="primary" />
    </div>
    
    <!-- Estado de erro -->
    <div v-else-if="error" class="flex flex-center q-pa-xl">
      <q-card flat bordered class="q-pa-md text-center" style="max-width: 400px">
        <q-card-section>
          <q-icon name="error_outline" size="3em" color="negative" class="q-mb-md" />
          <div class="text-h6 q-mb-sm">Ops! Algo deu errado</div>
          <div class="text-body2 text-grey-7 q-mb-md">{{ error }}</div>
          <q-btn 
            color="primary" 
            label="Tentar novamente"
            unelevated
            @click="reloadShop" 
          />
        </q-card-section>
      </q-card>
    </div>
    
    <!-- Conteúdo principal -->
    <div v-else-if="shop">
      <ShowCaseList />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
const { getShopBySlug, shop, loading } = useShop();

// Estado de erro local
const error = ref<string | null>(null);

const route = useRoute();
const slug = computed(() => route.params.slug);

// Variável reativa para URL compatível com SSR
const currentUrl = computed(() => {
  if (import.meta.client && window?.location) {
    return window.location.href;
  }
  // Fallback para SSR usando route
  return `${process.env.SITE_URL || 'https://seu-dominio.com'}${route.fullPath}`;
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

function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}

// Função para carregar a loja com tratamento de erro
async function loadShop() {
  try {
    error.value = null;
    await getShopBySlug(slug.value as string);
  } catch (err) {
    console.error('Erro ao carregar loja:', err);
    error.value = 'Não foi possível carregar as informações da loja. Verifique sua conexão e tente novamente.';
  }
}

// Função para recarregar
async function reloadShop() {
  await loadShop();
}

onMounted(async () => {
  await loadShop();
});
</script>
