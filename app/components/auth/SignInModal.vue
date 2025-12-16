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
        <div class="text-h5 text-weight-bold text-center">
          {{ $t("accessAccount") }}
        </div>
        <div class="text-weight-medium text-center">
          {{ $t("accessAccountDescription") }}
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
            :label="$t('login')"
            :loading="loading"
            color="primary"
            type="submit"
            padding="sm md"
            class="full-width"
          />
          <div class="row items-center q-my-md">
            <div class="col-5">
              <q-separator />
            </div>
            <div class="col-2">
              <div class="text-weight-medium text-center">{{ $t("or") }}</div>
            </div>
            <div class="col-5">
              <q-separator />
            </div>
          </div>
          <q-btn
            :label="$t('loginWithGoogle')"
            color="white"
            text-color="dark"
            type="submit"
            padding="sm md"
            unelevated
            :icon="`img:${GoogleIcon}`"
            class="full-width border-primary bg-white border-1"
            @click="onLoginGoogle"
          />
          <div class="text-weight-medium text-center q-mt-md">
            {{ $t("noAccount") }}
            <router-link to="/sign-up" class="link-decoration-none">
              {{ $t("createAccount") }}
            </router-link>
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
async function closeModal(): Promise<void> {
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

async function onLoginGoogle() {
  if (!shop.value) return;

  const config = useRuntimeConfig();
  const storeId = shop.value.id;
  const storeSlug = shop.value.slug;
  const apiUrl = config.public.apiGatewayBase;
  const backendUrl = `${apiUrl}auth/google?storeId=${storeId}&storeSlug=${storeSlug}`;

  window.location.href = backendUrl;
}
</script>
