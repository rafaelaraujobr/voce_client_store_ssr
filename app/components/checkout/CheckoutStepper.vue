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
              type="text"
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

    <q-step :name="2" title="Sua entrega" icon="mdi-map-marker">
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
      Try out different ad text to see what brings in the most customers, and
      learn how to enhance your ads using features like ad extensions. If you
      run into any problems with your ads, find out how to tell if they're
      running and how to resolve approval issues.
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
const step = ref(1);
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
const selectedFreight = ref("economico");
async function getAddressByZipcode(zipcode: string): Promise<void> {
  const response = await getAddressByZipcodeService(zipcode);
  if (response.erro) return;
  address.value.street = response.logradouro;
  address.value.number = response.numero;
  address.value.complement = response.complemento;
  address.value.neighborhood = response.bairro;
  address.value.city = response.localidade;
  address.value.state = response.uf;
  numberRef.value?.focus();
}

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
</script>
