<template>
  <q-dialog v-model="modalSignIn" @@before-hide="closeModal">
    <q-card :style="$q.screen.lt.sm ? 'width: 95vw; max-width: 420px' : 'width: 420px'" class="q-pa-sm">
      <q-toolbar>
        <q-space />
        <q-btn flat round dense icon="mdi-close" class="q-mr-xs" @click="closeModal" />
      </q-toolbar>

      <q-card-section>
        <div class="text-h5 text-weight-bold text-center" :class="$q.screen.lt.sm ? 'text-h6' : 'text-h5'">
          Acessar conta
        </div>
        <div class="text-weight-medium text-center" :class="$q.screen.lt.sm ? 'text-body2' : ''">
          Acesse sua conta para continuar com sua compra
        </div>
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md" @submit="handleSubmit">
          <!-- Campo de E-mail -->
          <div class="row">
            <div class="col-12">
              <q-input v-model="email" label="E-mail" color="primary" type="email" outlined :dense="$q.screen.lt.sm" />
            </div>
          </div>

          <!-- Campo de Senha -->
          <div class="row">
            <div class="col-12">
              <q-input v-model="password" label="Password" color="primary" :type="showPassword ? 'text' : 'password'"
                outlined :dense="$q.screen.lt.sm">
                <template #append>
                  <q-icon :name="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" color="primary"
                    class="cursor-pointer" @click="togglePassword" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Botão Entrar -->
          <div class="row">
            <div class="col-12">
              <q-btn label="Entrar" :loading="loading" color="primary" type="submit" padding="sm md" class="full-width"
                :size="$q.screen.lt.sm ? 'md' : 'lg'" />
            </div>
          </div>

          <!-- Divisor -->
          <div class="row items-center">
            <div class="col-5">
              <q-separator />
            </div>
            <div class="col-2">
              <div class="text-weight-medium text-center">ou</div>
            </div>
            <div class="col-5">
              <q-separator />
            </div>
          </div>

          <!-- Botão Google -->
          <div class="row">
            <div class="col-12">
              <q-btn label="Entrar com Google" color="white" text-color="dark" type="submit" padding="sm md" unelevated
                :icon="`img:${GoogleIcon}`" class="full-width border-primary bg-white border-1"
                :size="$q.screen.lt.sm ? 'md' : 'lg'" />
            </div>
          </div>

          <!-- Link Criar conta -->
          <div class="row">
            <div class="col-12">
              <div class="text-weight-medium text-center" :class="$q.screen.lt.sm ? 'text-body2' : ''">
                Ainda não tem uma conta?
                <router-link to="/signup" class="link-decoration-none">Criar conta</router-link>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import GoogleIcon from "@/assets/images/google-icon.svg";
import { useQuasar } from "quasar";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
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
</script>
