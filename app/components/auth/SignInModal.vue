<template>
  <q-dialog v-model="modalSignIn" @@before-hide="closeModal">
    <q-card style="width: 420px" class="q-pa-sm">
      <q-toolbar>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="mdi-close"
          class="q-mr-xs"
          @click="closeModal"
        />
      </q-toolbar>

      <q-card-section>
        <div class="text-h5 text-weight-bold text-center">Acessar conta</div>
        <div class="text-weight-medium text-center">
          Acesse sua conta para continuar com sua compra
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="handleSubmit">
          <q-input
            v-model="email"
            label="E-mail"
            color="primary"
            type="email"
          />
          <q-input
            v-model="password"
            label="Password"
            color="primary"
            :type="showPassword ? 'text' : 'password'"
          >
            <template #append>
              <q-icon
                :name="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                color="primary"
                class="cursor-pointer"
                @click="togglePassword"
              />
            </template>
          </q-input>
          <q-btn
            label="Entrar"
            :loading="loading"
            color="primary"
            type="submit"
            padding="sm md"
            class="full-width"
          />
          <div class="row items-center q-my-md">
            <div class="col-5">
                <q-separator  />
            </div>
            <div class="col-2">
               <div class="text-weight-medium text-center">ou</div>
            </div>
            <div class="col-5">
              <q-separator  />
            </div>
          </div>
          <q-btn
            label="Entrar com Google"
            color="white"
            text-color="dark"
            type="submit"
            padding="sm md"
            unelevated
            :icon="`img:${GoogleIcon}`"
            class="full-width border-primary bg-white border-1"
          />
          <div class="text-weight-medium text-center q-mt-md">
            Ainda não tem uma conta?
            <router-link to="/signup" class="link-decoration-none">Criar conta</router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import GoogleIcon from "@/assets/images/google-icon.svg";
import { useShop } from "~/composables/shop.composable";
const { shop } = useShop();
const route = useRoute();
const router = useRouter();
const modalSignIn = computed<boolean>(() => route.query.modal === "signin");
const email = ref<string>("");
const password = ref<string>("");
const showPassword = ref<boolean>(false);
const loading = ref<boolean>(false);
async function closeModal() {
  const currentQuery = { ...route.query };
  delete currentQuery.modal;
  await router.push({
    path: route.path,
    query: currentQuery,
  });
}
function handleSubmit() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
}
function togglePassword() {
  showPassword.value = !showPassword.value;
}

const currentUrl = computed(() => {
  if (import.meta.client && window?.location) return window.location.href;
  return `${process.env.SITE_URL || "https://seu-dominio.com"}${
    route.fullPath
  }`;
});

const image = computed(() => shop?.value?.logotipo || "/favicon.ico");

useSeoMeta({
  title: `${shop?.value?.name} - Acessar conta`,
  description: "Acesse sua conta para continuar com sua compra",
  ogTitle: `${shop?.value?.name} - Acessar conta`,
  ogDescription: "Acesse sua conta para continuar com sua compra",
  ogImage: image,
  ogUrl: currentUrl,
  ogSiteName: shop?.value?.name,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: `${shop?.value?.name} - Acessar conta`,
  twitterImage: image,
});


</script>
