<template>
    <client-only>
      <q-page class="flex flex-center bg-primary" padding>
        <q-stepper
          v-model="step"
          animated
          alternative-labels
          flat
          spinner-size="82px"
          done-color="secondary"
          active-color="dark"
          inactive-color="grey-5"
          class="bg-transparent"
          style="width: 100vw; max-width: 400px"
        >
          <q-step :name="1" title="initial" :done="step > 1" class="">
            <q-form @submit="step++">
              <q-card flat>
                <q-card-section class="text-center">
                  <div class="text-h6">Vamos começar!</div>
                  <div class="text-caption">
                    Por favor, Informe os dados abaixo:
                  </div>
                </q-card-section>
                <q-form @submit="checkDocuments">
                  <q-card-section class="text-center q-gutter-y-sm">
                    <q-input
                      v-model="form.firstName"
                      type="text"
                      label="Primeiro nome"
                      :error="errorName"
                      :error-message="erroMessageName"
                      dense
                      :rules="[(val: any) => !!val || 'Nome obrigatório']"
                      @blur="form.firstName = form.firstName.trim()"
                    />
                    <q-input
                      v-model="form.lastName"
                      type="text"
                      label="Sobrenome"
                      :error="errorName"
                      :error-message="erroMessageName"
                      dense
                      :rules="[(val: any) => !!val || 'Sobrenome obrigatório']"
                      @blur="form.lastName = form.lastName.trim()"
                    />
                    <q-input
                      ref="refEmail"
                      v-model="form.email"
                      type="email"
                      label="E-mail"
                      dense
                      :error="errorEmail"
                      :error-message="erroMessageEmail"
                      :rules="[(val: any) => !!val || 'E-mail obrigatório']"
                    />
                  </q-card-section>
                  <q-card-section class="q-gutter-y-md q-mt-sm">
                    <q-btn
                      color="dark"
                      icon-right="sym_r_chevron_right"
                      label="Continuar"
                      class="full-width"
                      unelevated
                      no-caps
                      type="submit"
                      dense
                      :loading="loading"
                    />
                    <div class="row items-center q-my-md">
                      <div class="col">
                        <q-separator />
                      </div>
                      <div class="q-mx-sm text-grey">ou</div>
                      <div class="col">
                        <q-separator />
                      </div>
                    </div>
                    <q-btn
                      outline
                      color="primary"
                      class="full-width q-mt-xs items-center"
                      no-caps
                      :dense="!$q.screen.lt.sm"
                      @click="onLoginGoogle()"
                    >
                      <div class="row items-center justify-center q-gutter-sm">
                        <q-img
                          :src="GoogleIcon"
                          alt="Google icon"
                          style="width: 20px; height: 20px"
                        />
                        <span>Criar com Google</span>
                      </div>
                    </q-btn>

                    <q-btn
                      color="white"
                      text-color="black"
                      label="Já tenho uma conta"
                      class="q-mt-lg full-width"
                      outline
                      unelevated
                      no-caps
                      :dense="!$q.screen.lt.sm"
                      icon="sym_r_chevron_left"
                      @click="navigateTo(`${route.path}?modal=signin`)"
                    />
                  </q-card-section>
                </q-form>
              </q-card>
            </q-form>
          </q-step>
          <q-step :name="2" title="password" :done="step > 2">
            <q-form @submit="onCreateAccount">
              <q-card flat>
                <q-card-section class="text-center">
                  <div class="text-h6">Criar senha</div>
                  <div class="text-caption">
                    Defina uma senha para acessar sua conta
                  </div>
                </q-card-section>
                <q-card-section class="q-py-none">
                  <q-input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    label="Senha"
                    color="primary"
                    input-class=""
                    class=""
                    dense
                    :rules="[(val: any) => !!val || 'Senha obrigatória']"
                  >
                    <template #prepend>
                      <q-icon name="sym_r_lock" color="primary" />
                    </template>
                    <template #append>
                      <q-btn
                        color="primary"
                        round
                        :icon="
                          !showPassword
                            ? 'sym_r_visibility'
                            : 'sym_r_visibility_off'
                        "
                        flat
                        dense
                        @click="showPassword = !showPassword"
                      />
                    </template>
                  </q-input>
                  <q-input
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    label="Confirmar Senha"
                    color="primary"
                    input-class=""
                    class=""
                    dense
                    :rules="[
                  (val: any) => !!val || 'Confirmar senha obrigatório',
                  (val: any) => val === form.password || 'Senhas não conferem'
                ]"
                  >
                    <template #prepend>
                      <q-icon name="sym_r_lock" color="primary" />
                    </template>
                    <template #append>
                      <q-btn
                        color="primary"
                        round
                        :icon="
                          !showConfirmPassword
                            ? 'sym_r_visibility'
                            : 'sym_r_visibility_off'
                        "
                        flat
                        dense
                        @click="showConfirmPassword = !showConfirmPassword"
                      />
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-section class="text-caption q-px-none q-pt-none">
                  <q-list dense>
                    <q-item>
                      <q-item-section side>
                        <q-avatar
                          size="xs"
                          font-size="15px"
                          :color="
                            checkPassword('minLength', form.password)
                              ? 'positive'
                              : 'grey-5'
                          "
                          text-color="white"
                          icon="check"
                        />
                      </q-item-section>
                      <q-item-section>Mínimo de 8 dígitos</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section side>
                        <q-avatar
                          size="xs"
                          :color="
                            checkPassword('number', form.password)
                              ? 'positive'
                              : 'grey-5'
                          "
                          font-size="15px"
                          text-color="white"
                          icon="check"
                        />
                      </q-item-section>
                      <q-item-section>Ao menos 1 número</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section side>
                        <q-avatar
                          size="xs"
                          :color="
                            checkPassword('uppercase', form.password)
                              ? 'positive'
                              : 'grey-5'
                          "
                          font-size="15px"
                          text-color="white"
                          icon="check"
                        />
                      </q-item-section>
                      <q-item-section
                        >Ao menos 1 letra maiúscula(Aa)</q-item-section
                      >
                    </q-item>
                    <q-item>
                      <q-item-section side>
                        <q-avatar
                          size="xs"
                          :color="
                            checkPassword('special', form.password)
                              ? 'positive'
                              : 'grey-5'
                          "
                          font-size="15px"
                          text-color="white"
                          icon="check"
                        />
                      </q-item-section>
                      <q-item-section
                        >Ao menos 1 carácter especial (@#)</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-card-section>
                <div class="text-caption text-justify q-mx-md">
                  Ao criar uma conta, você estará concordando com nossos
                  <span
                    class="text-weight-medium text-primary"
                    style="text-decoration: none; cursor: pointer"
                    @click="openTerms"
                  >
                    termos e condições
                  </span>
                  e nossa
                  <span
                    class="text-weight-medium text-primary"
                    style="text-decoration: none; cursor: pointer"
                    @click="openPrivacy"
                  >
                    Politica de privacidade
                  </span>
                </div>
                <q-item
                  v-ripple
                  tag="label"
                  class="q-px-none q-my-sm q-mx-sm"
                  dense
                >
                  <q-item-section side class="q-pr-sm">
                    <q-checkbox v-model="terms" />
                  </q-item-section>
                  <q-item-section class="text-caption text-left">
                    Aceito receber notificações e comunicados promocionais por
                    e-mail, SMS e WhatsAPP.
                  </q-item-section>
                </q-item>
                <q-item
                  v-ripple
                  tag="label"
                  class="q-px-none q-mx-sm q-mb-lg"
                  dense
                >
                  <q-item-section side class="q-pr-sm">
                    <q-checkbox v-model="dataConsent" />
                  </q-item-section>
                  <q-item-section class="text-caption q-mr-md text-left">
                    Concordo com o compartilhamento dos meus dados necessários
                    para a entrega dos produtos e emissão da Nota Fiscal.
                  </q-item-section>
                </q-item>
                <q-card-section class="q-pt-none q-gutter-y-sm">
                  <q-btn
                    color="dark"
                    label="Continuar"
                    unelevated
                    class="full-width"
                    no-caps
                    :loading="loading"
                    icon-right="sym_r_chevron_right"
                    :disabled="
                      !checkPasswordMatch(
                        form.password,
                        form.confirmPassword
                      ) || !dataConsent
                    "
                    type="submit"
                    dense
                  />
                </q-card-section>
              </q-card>
            </q-form>
          </q-step>
          <q-step :name="3" title="verify" :done="step > 2">
            <q-card flat class="text-center">
              <q-card-section class="text-center q-py-lg">
                <q-img src="@/assets/images/send.svg" width="50px" />
                <div class="text-h6 q-mt-md" style="font-size: 18px">
                  Ative sua conta para continuar
                </div>
                <div class="text-grey-8">
                  Enviamos um e-mail para {{ form.email }} com um link de
                  ativação.Abra seu e-mail e clique no link de confirmação.
                </div>
                <q-btn
                  color="primary"
                  icon="sym_r_email"
                  label="Acessar e-mail"
                  no-caps
                  dense
                  class="q-mt-md"
                  @click="openEmail"
                />
              </q-card-section>
            </q-card>
          </q-step>
        </q-stepper>
      </q-page>
      <q-dialog v-model="showTerms" persistent>
        <q-card
          style="width: 900px; max-width: 70vw; height: 700px; max-height: 70vw"
        >
          <q-card-section class="row justify-end q-pb-none">
            <q-btn v-close-popup icon="close" flat round dense />
          </q-card-section>
          <q-card-section>
            <iframe :src="fullUrl" width="100%" height="600px" />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="showPrivacy" persistent>
        <q-card
          style="width: 900px; max-width: 70vw; height: 700px; max-height: 70vw"
        >
          <q-card-section class="row justify-end q-pb-none">
            <q-btn v-close-popup icon="close" flat round dense />
          </q-card-section>
          <q-card-section>
            <iframe :src="fullUrl" width="100%" height="600px" />
          </q-card-section>
        </q-card>
      </q-dialog>
    </client-only>
</template>

<script setup lang="ts">
import GoogleIcon from "@/assets/images/google-icon.svg";
import { useShop } from "~/composables/shop.composable";
import { useAccountService } from "~/services/account.service";
import { useQuasar } from "quasar";
import type { QInput } from "quasar";
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  emailProviders,
  checkPassword,
  checkPasswordMatch,
} from "@/utils/functions";


const { checkEmailService, createAccountService } = useAccountService();
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const { shop } = useShop();
const form = reactive({
  email: "",
  firstName: "",
  lastName: "",
  cpf: "",
  birthDate: "",
  password: "",
  confirmPassword: "",
});
const errorEmail = ref<boolean>(false);
const erroMessageEmail = ref<string>("");
const refEmail = ref<QInput | null>(null);
const errorName = ref<boolean>(false);
const erroMessageName = ref<string>("");
const errorDate = ref<boolean>(false);
const loading = ref<boolean>(false);
const terms = ref<boolean>(false);
const dataConsent = ref<boolean>(false);
const step = ref<number>(1);
const showPassword = ref<boolean>(false);
const showConfirmPassword = ref<boolean>(false);
const showTerms = ref<boolean>(false);
const showPrivacy = ref<boolean>(false);
const currentUrl = ref<string>("");
const fullUrl = ref<string>("");

// Inicializa currentUrl apenas no cliente
onMounted(() => {
  currentUrl.value = window.location.origin;
});
const checkDocuments = async () => {
  loading.value = true;
  errorName.value = false;
  errorEmail.value = false;

  try {
    const response = await checkEmailService(
      form.email,
      shop.value?.id || ("" as string)
    );
    if (response == "true") {
      console.log("email disponível");
      step.value++;
    } else {
      refEmail.value?.focus();
      erroMessageEmail.value = "Este E-mail já está em uso em nosso sistema.";
      errorEmail.value = true;
    }
  } catch (error: any) {
    if (!errorDate.value) {
      if (
        error.response?.data?.message ===
        "Os dados informados não são válidos. Por favor, revise e insira informações reais."
      ) {
        erroMessageName.value = error.response.data.message;
        errorName.value = true;
      }
    }
  } finally {
    loading.value = false;
  }
};
const onCreateAccount = async () => {
  loading.value = true;
  const { ...rest } = form;
  const account = {
    ...rest,
    storeId: shop.value?.id,
    storeSlug: shop.value?.slug,
    acceptPromoCommunications: terms.value,
  };
  try {
    const response = await createAccountService(account);
    if (response?.status === 1) {
      step.value++;
    } else {
      $q.notify({
        type: "negative",
        message: "Erro ao criar conta. Tente novamente.",
      });
    }
  } catch (error: any) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: error.response?.data?.message || "Erro ao criar conta",
    });
  } finally {
    loading.value = false;
  }
};
function openTerms() {
  const termsUrl = `${currentUrl.value}/pdf/termos_uso.pdf`;
  if ($q.screen.lt.sm) window.open(termsUrl, "_blank");
  else {
    fullUrl.value = termsUrl;
    showTerms.value = true;
  }
}
function openPrivacy() {
  const privacyUrl = `${currentUrl.value}/pdf/politica_privacidade.pdf`;
  if ($q.screen.lt.sm) window.open(privacyUrl, "_blank");
  else {
    fullUrl.value = privacyUrl;
    showPrivacy.value = true;
  }
}
const openEmail = () => {
  const emailDomain = form.email.split("@")[1];
  const mailUrl = emailProviders[emailDomain as keyof typeof emailProviders];

  if (mailUrl) window.open(mailUrl, "_blank");
  else window.location.href = `mailto:${form.email}`;

  setTimeout(() => {
    router.push(`/in/${shop.value?.slug}`);
  }, 5000);
};
async function onLoginGoogle() {
  const storeId = shop.value?.id;
  const storeSlug = shop.value?.slug;
  const apiUrl = import.meta.env.VITE_API_BASE;
  const backendUrl = `${apiUrl}auth/google?storeId=${storeId}&storeSlug=${storeSlug}`;

  window.location.href = backendUrl;
}
</script>

<style lang="sass">
.q-stepper__header
    display: none
</style>
