<template>
  <q-stepper
    ref="stepper"
    v-model="step"
    color="primary"
    animated
    flat
    bordered
  >
    <q-step :name="1" title="Seus dados" icon="settings" :done="step > 1">
      <q-form @submit="verifyFormData()">
        <div class="text-weight-bold text-subtitle1 q-mb-md">
          Dados pessoais
        </div>
        <div class="row q-col-gutter-x-sm">
          <div class="col-12 col-md-6">
            <q-input
              v-model="user.name"
              label="Nome completo"
              outlined
              dense
              :rules="[(val) => !!val || 'Nome completo é obrigatório']"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="user.email"
              label="E-mail"
              type="email"
              :rules="[(val) => !!val || 'E-mail é obrigatório']"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="user.phone"
              label="Telefone"
              type="tel"
              mask="(##) #####-####"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="user.cpf"
              :rules="[(val) => !!val || 'CPF é obrigatório']"
              outlined
              dense
              label="CPF"
              type="text"
              mask="###.###.###-##"
            />
          </div>
        </div>
        <div class="text-weight-bold text-subtitle1 q-my-md">
          Local de entrega
        </div>
        <div class="row q-col-gutter-x-sm">
          <div class="col-12 col-md-6">
            <q-input
              ref="zipcodeRef"
              v-model="address.zipcode"
              :rules="[(val) => !!val || 'CEP é obrigatório']"
              label="CEP"
              outlined
              type="tel"
              mask="#####-###"
              dense
              @blur="getAddressByZipcode(address.zipcode)"
              @keyup.enter="getAddressByZipcode(address.zipcode)"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="address.street"
              :rules="[(val) => !!val || 'Rua é obrigatório']"
              label="Rua"
              type="text"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              ref="numberRef"
              v-model="address.number"
              :rules="[(val) => !!val || 'Número é obrigatório']"
              label="Número"
              type="number"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="address.complement"
              outlined
              dense
              label="Complemento"
              maxlength="50"
              type="text"
              max-length="50"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="address.neighborhood"
              :rules="[(val) => !!val || 'Bairro é obrigatório']"
              label="Bairro"
              type="text"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="address.city"
              :rules="[(val) => !!val || 'Cidade é obrigatório']"
              label="Cidade"
              type="text"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="address.state"
              :rules="[(val) => !!val || 'Estado é obrigatório']"
              label="Estado"
              type="text"
              outlined
              dense
            />
          </div>
        </div>
        <div class="row justify-end">
          <q-btn
            type="submit"
            color="primary"
            label="Continuar"
            padding="sm lg"
            dense
            unelevated
          />
        </div>
      </q-form>
    </q-step>

    <q-step
      :name="2"
      title="Sua entrega"
      icon="mdi-map-marker"
      :done="step > 2"
    >
      <div class="text-weight-bold text-subtitle1 q-mb-md">
        Selecione a entrega / retirada
      </div>
      <div class="row">
        <div class="col-12">
          <q-list>
            <q-card flat bordered class="border-1 border-primary">
              <q-item v-ripple tag="label" dense class="q-py-md">
                <q-item-section side top>
                  <q-radio v-model="selectedFreight" val="economico" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-subtitle1">
                    Economico
                  </q-item-label>
                  <q-item-label
                    class="text-weight-medium text-subtitle2 q-mb-sm"
                  >
                    {{ freight?.estimatedTime || "0" }} dias úteis
                  </q-item-label>
                  <q-item-label class="text-weight-medium text-subtitle1">
                    Local de entrega
                  </q-item-label>
                  <q-item-label class="text-subtitle2">
                    {{ address?.street || "0" }}, {{ address?.number || "0" }}
                    {{ address?.complement || "" }}
                  </q-item-label>
                  <q-item-label class="text-subtitle2">
                    {{ address?.neighborhood || "" }} -
                    {{ address?.city || "" }} - {{ address?.state || "" }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label
                    class="text-weight-bold text-subtitle1 text-dark"
                  >
                    {{ numberToReal(freight?.total || 0) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </q-list>
        </div>
        <div class="row q-mt-md items-center justify-between full-width">
          <q-btn
            color="primary"
            label="Voltar"
            padding="sm lg"
            flat
            icon="mdi-arrow-left"
            dense
            unelevated
            @click="step = 1"
          />
          <q-btn
            color="primary"
            label="Continuar"
            padding="sm lg"
            dense
            unelevated
            @click="step = 3"
          />
        </div>
      </div>
    </q-step>

    <q-step :name="3" title="Pagamento" icon="mdi-comment-plus">
      <div class="text-weight-bold text-subtitle1 q-mb-md">
        Forma de pagamento
      </div>
      <q-card flat bordered>
        <q-expansion-item
          expand-separator
          icon="mdi-credit-card"
          label="Cartão de crédito"
        >
          <q-card flat>
            <q-form @submit="handleSubmitCreditCard()">
              <div class="row q-col-gutter-x-sm q-pa-sm">
                <div class="col-12">
                  <q-input
                    v-model="creditCard.number"
                    :rules="[
                      (val) => !!val || 'Número do cartão é obrigatório',
                    ]"
                    label="Número do cartão"
                    mask="#### #### #### ####"
                    type="tel"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="creditCard.expirationDate"
                    :rules="[
                      (val) => !!val || 'Data de expiração é obrigatória',
                    ]"
                    label="Data de expiração"
                    mask="##/##"
                    type="tel"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="creditCard.cvv"
                    :rules="[(val) => !!val || 'CVV é obrigatório']"
                    label="CVV"
                    mask="###"
                    type="tel"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="creditCard.name"
                    :rules="[(val) => !!val || 'Nome do titular é obrigatório']"
                    label="Nome do titular"
                    type="text"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12">
                  <q-select
                    v-model="creditCard.installments"
                    :options="installmentsOptions"
                    :rules="[(val) => !!val || 'Parcelas é obrigatório']"
                    label="Parcelas"
                    type="number"
                    outlined
                    dense
                    min="1"
                    max="12"
                    emit-value
                    map-options
                  />
                </div>
              </div>
            </q-form>
          </q-card>
        </q-expansion-item>
      </q-card>
      <div class="row q-mt-md items-center justify-between full-width">
        <q-btn
          color="primary"
          label="Voltar"
          padding="sm lg"
          flat
          icon="mdi-arrow-left"
          dense
          unelevated
          @click="step = 2"
        />
        <q-btn
          color="positive"
          :label="`Pagar ${numberToReal(getTotalPrice())}`"
          padding="sm lg"
          dense
          unelevated
          type="submit"
        />
      </div>
    </q-step>
  </q-stepper>
</template>

<script setup lang="ts">
import type { QStepper } from "quasar";
import { useCart } from "~/composables/cart.composable";
import { useShop } from "~/composables/shop.composable";
import { useShopService } from "~/services/shop.service";
const { getAddressByZipcodeService } = useShopService();
const { shop } = useShop();
const { productsInCart, getFreight, freight, getTotalPrice } = useCart();
const step = ref<number>(1);
const stepper = ref<InstanceType<typeof QStepper> | null>(null);
const user = ref({
  name: "",
  email: "",
  phone: "",
  cpf: "",
});
const zipcodeRef = ref<any>(null);
const numberRef = ref<any>(null);
const address = ref({
  zipcode: "" as string,
  street: "" as string,
  number: "" as string,
  complement: "" as string,
  neighborhood: "" as string,
  city: "" as string,
  state: "" as string,
});

const creditCard = ref({
  number: "" as string,
  name: "" as string,
  expirationDate: "" as string,
  cvv: "" as string,
  installments: 1 as number,
});
const selectedFreight = ref("economico");
async function getAddressByZipcode(zipcode: string): Promise<void> {
  const response = await getAddressByZipcodeService(zipcode);
  if (response.erro) return;
  address.value.street = response.logradouro;
  address.value.number = response.numero;
  address.value.neighborhood = response.bairro;
  address.value.city = response.localidade;
  address.value.state = response.uf;
  numberRef.value?.focus();
}

const installmentsOptions = computed(() => {
  if (productsInCart.value.length === 0) return [];

  const productInstallments = productsInCart.value.map(
    (product) => product.installments || []
  );

  if (productInstallments.some((inst) => inst.length === 0)) return [];

  const installmentNumbersByProduct = productInstallments.map((installments) =>
    installments
      .filter((inst: any) => inst?.installment >= 1)
      .map((inst: any) => inst.installment)
  );

  const commonNumbers =
    installmentNumbersByProduct.length === 1
      ? installmentNumbersByProduct[0]
      : installmentNumbersByProduct.reduce((acc: number[], curr: number[]) =>
          acc.filter((num: number) => curr.includes(num))
        );

  const cartTotal = productsInCart.value.reduce(
    (total: number, product: any) => {
      const productTotal = product.installments?.[0]?.total || 0;
      return total + productTotal * (product.quantity || 1);
    },
    0
  );

  return commonNumbers
    .map((num: number) => ({
      value: num,
      label: `${num}x de ${numberToReal(cartTotal / num)}`,
    }))
    .sort((a: { value: number }, b: { value: number }) => a.value - b.value);
});

async function verifyFormData(): Promise<void> {
  const campaigns = shop.value?.campaigns;
  const productsCampaigns = productsInCart.value.map(
    (product) => product?.company?.id
  );
  const selectedCampaigns = campaigns?.filter((campaign) =>
    productsCampaigns.includes(campaign.id)
  );
  const payloadFreight = {
    skus: productsInCart.value.map((product: any) => {
      return {
        id: product.sku?.id as string,
        amount: product.quantity || (1 as number),
      };
    }) as any[],
    accountName: selectedCampaigns?.[0]?.name || "extra",
    zipcode: address.value.zipcode,
  };
  try {
    await getFreight(payloadFreight);
    step.value = 2;
  } catch (error: any) {
    console.error("Erro ao verificar dados:", error);

    // O erro é um Response object com _data.error contendo a mensagem
    const errorData =
      error?._data?.error || error?._data || error?.data || error;
    const errorMessage =
      errorData?.message ||
      (typeof errorData === "string" ? errorData : null) ||
      error?.statusText ||
      "Erro ao verificar dados. Tente novamente.";

    Notify.create({
      message: errorMessage,
      color: "negative",
      icon: "mdi-alert-circle",
      timeout: 3000,
    });
  }
}

async function handleSubmitCreditCard(): Promise<void> {
  console.log(creditCard.value);
}
</script>
