<template>
  <q-stepper
    ref="stepper"
    v-model="step"
    color="primary"
    animated
    flat
    bordered
  >
    <q-step :name="1" :title="$t('yourData')" icon="settings" :done="step > 1">
      <q-form @submit="verifyFormData()">
        <div class="text-weight-bold text-subtitle1 q-mb-md">
          {{ $t("personalData") }}
        </div>
        <div class="row q-col-gutter-x-sm">
          <div class="col-12 col-md-6">
            <q-input
              v-model="user.name"
              :label="$t('fullName')"
              outlined
              dense
              :rules="[(val) => !!val || $t('fullNameRequired')]"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="user.email"
              :label="$t('email')"
              type="email"
              :rules="[(val) => !!val || $t('emailRequired')]"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="user.phone"
              :label="$t('phone')"
              type="tel"
              mask="(##) #####-####"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="user.cpf"
              :rules="[(val) => !!val || $t('cpfRequired')]"
              outlined
              dense
              :label="$t('cpf')"
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
              :rules="[(val) => !!val || $t('zipcodeRequired')]"
              :label="$t('zipcode')"
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
              :rules="[(val) => !!val || $t('streetRequired')]"
              :label="$t('street')"
              type="text"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              ref="numberRef"
              v-model="address.number"
              :rules="[(val) => !!val || $t('numberRequired')]"
              :label="$t('number')"
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
              :label="$t('complement')"
              maxlength="50"
              type="text"
              max-length="50"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="address.neighborhood"
              :rules="[(val) => !!val || $t('neighborhoodRequired')]"
              :label="$t('neighborhood')"
              type="text"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="address.city"
              :rules="[(val) => !!val || $t('cityRequired')]"
              :label="$t('city')"
              type="text"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="address.state"
              :rules="[(val) => !!val || $t('stateRequired')]"
              :label="$t('state')"
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
            :label="$t('continue')"
            padding="sm lg"
            dense
            unelevated
          />
        </div>
      </q-form>
    </q-step>

    <q-step
      :name="2"
      :title="$t('yourDelivery')"
      icon="mdi-map-marker"
      :done="step > 2"
    >
      <div class="text-weight-bold text-subtitle1 q-mb-md">
        {{ $t("selectDelivery") }}
      </div>
      <div class="row">
        <div class="col-12 q-gutter-y-sm">
          <template v-for="(item, index) in freight" :key="index">
            <q-expansion-item
              expand-separator
              default-opened
              group="delivery"
              class="rounded-borders border-1 border-default"
            >
              <template #header>
                <q-item-section avatar>
                  <div
                    class="avatar-stack"
                    :style="`width: ${
                      40 +
                      (getFirstImageProductBySkuIds(item.skus).length - 1) * 18
                    }px`"
                  >
                    <q-avatar
                      v-for="(
                        image, indexImage
                      ) in getFirstImageProductBySkuIds(item.skus)"
                      :key="indexImage"
                      class="border-1 border-default avatar-overlapping"
                      size="40px"
                      :style="`left: ${indexImage * 18}px; z-index: ${
                        10 - indexImage
                      }`"
                      clickable
                      @click.stop="openProductsModal(item.skus)"
                    >
                      <q-img
                        :src="image"
                        style="border-radius: 50%"
                        width="40px"
                        height="40px"
                        fit="contain"
                      />
                    </q-avatar>
                  </div>
                </q-item-section>

                <q-item-section>
                  <q-item-label
                    class="text-weight-medium text-subtitle1 ellipsis"
                    style="max-width: 200px"
                  >
                    {{ getProductCartBySkuId(item.skus[0]).name }}
                    <q-tooltip>{{
                      getProductCartBySkuId(item.skus[0]).name
                    }}</q-tooltip>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center justify-end q-col-gutter-x-sm">
                    <div class="text-weight-bold text-subtitle2 text-dark">
                      {{ getSelectedDelivery(item)?.description || "" }}
                    </div>
                    <div class="text-weight-bold text-subtitle1 text-dark">
                      {{
                        formatValueShipping(
                          getSelectedDelivery(item)?.totalPrice || 0
                        )
                      }}
                    </div>
                    <div class="text-weight-medium text-caption text-grey-7">
                      {{
                        formatBusinessDays(
                          getSelectedDelivery(item)?.estimatedDeliveryDays || 0
                        )
                      }}
                    </div>
                  </div>
                </q-item-section>
              </template>
              <q-card flat>
                <q-card-section>
                  <q-list class="q-gutter-y-sm">
                    <q-item
                      v-for="(delivery, indexDelivery) in item?.deliveries"
                      :key="indexDelivery"
                      v-ripple
                      tag="label"
                      dense
                      class="q-py-md rounded-borders border-1 border-default"
                    >
                      <q-item-section side>
                        <q-radio
                          v-model="selectedFreight[item.skus[0]]"
                          :val="delivery?.totalPrice"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label
                          class="text-weight-bold text-subtitle1 ellipsis text-dark"
                          >{{ delivery?.description }}</q-item-label
                        >
                        <q-item-label
                          class="text-weight-medium text-subtitle2"
                          >{{
                            formatBusinessDays(
                              delivery.estimatedDeliveryDays || 0
                            )
                          }}</q-item-label
                        >
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label
                          class="text-weight-bold text-subtitle1 text-dark"
                          >{{
                            formatValueShipping(delivery.totalPrice)
                          }}</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </template>
        </div>
        <div class="row q-mt-md items-center justify-between full-width">
          <q-btn
            color="primary"
            :label="$t('back')"
            padding="sm lg"
            flat
            icon="mdi-arrow-left"
            dense
            unelevated
            @click="step = 1"
          />
          <q-btn
            color="primary"
            :label="$t('continue')"
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
        {{ $t("paymentMethod") }}
      </div>
      <q-card flat bordered>
        <q-expansion-item
          expand-separator
          icon="mdi-credit-card"
          :label="$t('creditCard')"
        >
          <q-card flat>
            <q-form @submit="handleSubmitCreditCard()">
              <div class="row q-col-gutter-x-sm q-pa-sm">
                <div class="col-12">
                  <q-input
                    v-model="creditCard.number"
                    :rules="[(val) => !!val || $t('creditCardNumberRequired')]"
                    :label="$t('creditCardNumber')"
                    mask="#### #### #### ####"
                    type="tel"
                    outlined
                    dense
                  >
                    <template #prepend>
                      <q-img
                        v-if="cardBrandImage"
                        :src="cardBrandImage"
                        width="30px"
                        height="30px"
                        fit="contain"
                        spinner-size="30px"
                        spinner-color="primary"
                        loading="lazy"
                        placeholder-src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNhYWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW08L3RleHQ+Cjwvc3ZnPg=="
                      />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="creditCard.expirationDate"
                    :rules="[(val) => !!val || $t('expirationDateRequired')]"
                    :label="$t('expirationDate')"
                    mask="##/##"
                    type="tel"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="creditCard.cvv"
                    :rules="[(val) => !!val || $t('cvvRequired')]"
                    :label="$t('cvv')"
                    mask="###"
                    type="tel"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="creditCard.name"
                    :rules="[(val) => !!val || $t('cardholderNameRequired')]"
                    :label="$t('cardholderName')"
                    type="text"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12">
                  <q-select
                    v-model="creditCard.installments"
                    :options="installmentsOptions"
                    :rules="[(val) => !!val || $t('installmentsRequired')]"
                    :label="$t('installments')"
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
          :label="$t('back')"
          padding="sm lg"
          flat
          icon="mdi-arrow-left"
          dense
          unelevated
          @click="step = 2"
        />
        <q-btn
          color="positive"
          :label="`${$t('pay')} ${numberToReal(getTotalPrice())}`"
          padding="sm lg"
          dense
          unelevated
          type="submit"
        />
      </div>
    </q-step>
  </q-stepper>
  <q-dialog v-model="productsModal">
    <q-card style="width: 800px">
      <q-toolbar>
        <q-toolbar-title>
          {{ $t("products") }}
        </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="mdi-close"
          @click="productsModal = false"
        />
      </q-toolbar>
      <q-card-section>
        <div class="text-weight-bold text-subtitle1 q-mb-md">
          <q-item v-for="product in productsModalProducts" :key="product.id">
            <q-item-section avatar>
              <q-img
                :src="product.sku?.images[0]"
                width="40px"
                height="40px"
                fit="contain"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label
                class="text-weight-bold text-subtitle1 ellipsis"
                style="max-width: 200px"
                >{{ product.name }}</q-item-label
              >
              <q-item-label
                class="text-weight-medium text-subtitle2 text-grey-6"
              >
                {{ $t("quantity") }}: {{ product.quantity }}
                {{ product.quantity }}</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-weight-bold text-subtitle1 text-dark">{{
                numberToReal(product.sku?.price)
              }}</q-item-label>
              <q-item-label
                class="text-weight-medium text-subtitle2 text-grey-6"
                >{{ numberToReal(product.sku?.price_discount) }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { QStepper } from "quasar";
import { useCart } from "~/composables/cart.composable";
import { useShopService } from "~/services/shop.service";

import amexImage from "@/assets/images/cardbrand/amex.svg";
import discoverImage from "@/assets/images/cardbrand/discover.svg";
import eloImage from "@/assets/images/cardbrand/elo.svg";
import mastercardImage from "@/assets/images/cardbrand/mastercard.svg";
import visaImage from "@/assets/images/cardbrand/visa.svg";

const { getAddressByZipcodeService } = useShopService();
const { productsInCart, getFreight, freight, getTotalPrice, setFreightTotal } =
  useCart();
const step = ref<number>(1);
const productsModal = ref<boolean>(false);
const productsModalIds = ref<string[]>([]);
const productsModalProducts = ref<any[]>([]);
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
const selectedFreight = ref<any>({});
watch(
  selectedFreight,
  () => {
    const totalFreight = Object.values(selectedFreight.value).reduce(
      (acc: number, curr) => acc + Number(curr),
      0
    );
    console.log(totalFreight);
    setFreightTotal(totalFreight);
  },
  { immediate: true, deep: true }
);

function selectCheapestFreight(): void {
  if (!freight.value || freight.value.length === 0) return;

  freight.value.forEach((item: any) => {
    if (!item.deliveries || item.deliveries.length === 0) return;

    const cheapestDelivery = item.deliveries.reduce(
      (min: any, delivery: any) => {
        if (!min || delivery.totalPrice < min.totalPrice) {
          return delivery;
        }
        return min;
      },
      null
    );

    if (cheapestDelivery && item.skus?.[0])
      selectedFreight.value[item.skus[0]] = cheapestDelivery.totalPrice;
  });
}

watch(
  freight,
  () => {
    selectCheapestFreight();
  },
  { immediate: true, deep: true }
);

function getSelectedDelivery(item: any): any {
  if (!item?.deliveries || !item?.skus?.[0]) return null;
  const selectedPrice = selectedFreight.value[item.skus[0]];
  return (
    item.deliveries.find((d: any) => d.totalPrice === selectedPrice) || null
  );
}

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

function getProductCartBySkuId(id: string): any {
  const product = productsInCart.value.find((product: any) =>
    product.sku?.id.includes(id)
  );
  return product;
}

function getProductsModalProducts(ids: string[]): any[] {
  const products = productsInCart.value.filter((product: any) =>
    ids.includes(product.sku?.id)
  );
  return products;
}

function getFirstImageProductBySkuIds(ids: string[]): string[] {
  const products = productsInCart.value
    .filter((product: any) => ids.includes(product.sku?.id))
    .map((product: any) => product.sku?.images[0]);
  return products.flatMap((product: any) => product);
}

function openProductsModal(ids: string[]): void {
  productsModal.value = true;
  productsModalIds.value = ids;
  productsModalProducts.value = getProductsModalProducts(ids);
}

async function verifyFormData(): Promise<void> {
  const payloadFreight = {
    skus: productsInCart.value.map((product: any) => {
      return {
        id: product.sku?.id as string,
        qtd: product.quantity || (1 as number),
      };
    }) as any[],
    zipcode: address.value.zipcode,
  };
  try {
    await getFreight(payloadFreight);
    step.value = 2;
  } catch (error: any) {
    console.error("Erro ao verificar dados:", error);

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

const cardBrand = computed(() => {
  return getCardBrand(creditCard.value.number);
});

const cardBrandImage = computed(() => {
  const brand = cardBrand.value;
  const brandImages: Record<string, string> = {
    visa: visaImage,
    mastercard: mastercardImage,
    amex: amexImage,
    elo: eloImage,
    discover: discoverImage,
  };
  return brandImages[brand] || "";
});

function getCardBrand(cardNumber: string): string {
  const number = cardNumber.replace(/\D/g, "");
  if (/^4/.test(number)) return "visa";

  if (/^(5[1-5]|22[2-9]|2[3-7][0-9])/.test(number)) return "mastercard";

  if (/^3[47]/.test(number)) return "amex";

  if (
    /^(401178|401179|431274|438935|451416|457393|457631|457632|504175|5067|506699|509|627780|636297|636368)/.test(
      number
    )
  )
    return "elo";

  if (/^(606282|3841)/.test(number)) return "hipercard";

  if (/^6(011|5)/.test(number)) return "discover";

  return "desconhecida";
}

async function handleSubmitCreditCard(): Promise<void> {
  console.log(creditCard.value);
}
</script>

<style lang="sass" scoped>
.avatar-stack
  position: relative
  height: 40px
  display: flex
  align-items: center

.avatar-overlapping
  border: 2px solid white
  position: absolute
  top: 0
</style>
