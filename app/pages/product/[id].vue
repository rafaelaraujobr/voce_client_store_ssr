<!-- eslint-disable vue/no-v-html -->
<template>
  <q-page :style-fn="myTweak" padding class="wrapper">
    <q-breadcrumbs class="text-grey q-my-lg text-caption" active-color="purple">
      <template #separator>
        <q-icon size="1.2em" name="mdi-chevron-right" color="purple" />
      </template>
      <q-breadcrumbs-el :label="shop?.name" :to="`/`" />
      <q-breadcrumbs-el :label="category" />
      <q-breadcrumbs-el
        :label="product?.name"
        class="ellipsis"
        :style="{ maxWidth: $q.screen.lt.sm ? '120px' : '200px' }"
      />
    </q-breadcrumbs>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <ProductCarousel :images="skuSelected?.sku?.images" />
      </div>
      <div class="col-12 col-md-6 q-gutter-y-sm">
        <q-item-label class="row items-center q-gutter-x-sm">
          <q-icon name="mdi-star" color="primary" size="1.2em" />
          <div class="text-primary">4.8</div>
          <div class="text-grey">({{ $t("reviews") }} 120)</div>
          <q-btn
            :label="$t('copyLink')"
            color="positive"
            unelevated
            padding="sm md"
            flat
            dense
            icon="mdi-content-copy"
            size="xs"
            @click="copyLink"
          />
        </q-item-label>
        <q-item-label>
          {{ product?.name }}
        </q-item-label>
        <div v-if="sortedSkus.length > 0" class="q-mb-md">
          <q-select
            v-model="skuSelectedId"
            :options="skuOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            outlined
            dense
            :label="skuOptions.length > 1 ? $t('selectAnOption') : undefined"
            class="full-width"
            behavior="menu"
            :display-value="selectedSkuLabel"
            :readonly="skuOptions.length === 1"
            :dropdown-icon="skuOptions.length > 1 ? 'mdi-chevron-down' : 'none'"
          >
            <q-tooltip v-if="skuOptions.length === 1" class="bg-grey-8">
              {{ $t("lastOptionAvailable") }}
            </q-tooltip>
          </q-select>
        </div>
        <q-item-label
          v-if="
            skuSelected?.sku?.price_discount < skuSelected?.sku?.price &&
            skuSelected?.sku?.price_discount > 0
          "
          class="text-caption text-negative q-pt-sm"
          style="text-decoration: line-through"
        >
          {{ $t("from") + " " + numberToReal(skuSelected.sku?.price) }}
          <q-badge
            v-if="
              skuSelected.sku?.price &&
              skuSelected.sku?.price_discount > 0 &&
              skuSelected.sku?.price_discount < skuSelected.sku?.price
            "
            :style="{
              backgroundColor: '#FFC107',
              top: '10px',
            }"
            text-color="black"
            class="text-subtitle1 text-weight-bold q-ml-sm"
            >-
            {{
              getDiscountPercent(
                skuSelected?.sku?.price,
                skuSelected?.sku?.price_discount
              )
            }}%</q-badge
          >
        </q-item-label>
        <q-item-label
          v-if="
            skuSelected?.sku?.price > skuSelected?.sku?.price_discount &&
            skuSelected.sku?.price_discount > 0
          "
          class="text-h5 text-weight-bold"
        >
          {{ $t("by") + " " + numberToReal(skuSelected.sku?.price_discount) }}
        </q-item-label>
        <q-item-label v-else class="text-h5 text-weight-bold">
          {{ numberToReal(skuSelected?.sku?.price) }}
        </q-item-label>
        <q-item-label
          v-if="installments?.installment > 1"
          class="text-caption row items-center no-wrap q-mb-md"
        >
          {{ $t("until") }} {{ installments?.installment }}x {{ $t("of") }}
          {{ numberToReal(installments?.value) }}</q-item-label
        >

        <div class="q-mb-md">
          <div class="relative-position" style="max-width: 120px">
            <q-select
              v-model="selectedQuantity"
              :options="quantityOptions"
              outlined
              dense
              emit-value
              map-options
              :label="$t('quantity')"
              class="full-width"
              :disable="isQuantitySelectDisabled"
            />
            <q-tooltip
              v-if="isQuantitySelectDisabled"
              class="bg-negative text-white"
              anchor="center right"
              self="center left"
              :offset="[10, 0]"
            >
              {{ $t("maxQuantityReached") }}
            </q-tooltip>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mt-md">
          <div class="col-12 col-sm-6">
            <q-btn
              :label="$t('buyNow')"
              color="dark"
              unelevated
              padding="md"
              class="full-width"
              size="md"
              @click="buyNow"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-btn
              :label="$t('addCart')"
              color="default"
              unelevated
              padding="md"
              text-color="dark"
              class="bg-default full-width"
              icon="mdi-cart-plus"
              size="md"
              :disable="!canAddToCart"
              @click="addProductToCartWithQuantity"
            />
          </div>
        </div>

        <q-item-label
          class="text-caption row items-center no-wrap q-gutter-x-sm"
          :class="{
            'justify-center': $q.screen.lt.md,
            'justify-start': $q.screen.gt.sm,
          }"
        >
          {{ $t("soldBy") }}:
          <q-img
            :src="product?.company?.logotipo"
            fit="contain"
            height="50px"
            width="80px"
          />
        </q-item-label>
      </div>
    </div>
    <q-separator spaced />
    <q-card flat>
      <q-card-section class="row items-center justify-between q-pa-none">
        <div class="col-auto">
          <q-item>
            <q-item-section>
              <q-item-label
                ><q-icon
                  name="mdi-truck-outline"
                  color="primary"
                  size="md"
                  class="q-mr-sm"
                />Calcular frete e estimativa de entrega</q-item-label
              >
            </q-item-section>
          </q-item>
        </div>
        <div class="col-auto row items-center q-gutter-x-sm">
          <div class="col-auto">
            <q-input
              v-model="zipcode"
              label="CEP"
              mask="#####-###"
              placeholder="Insira o CEP"
              dense
              outlined
              class="full-width"
              @keyup.enter="getFreightDetails(zipcode)"
            />
          </div>
          <div class="col-auto">
            <q-btn
              label="Calcular frete"
              color="dark"
              unelevated
              dense
              padding="sm lg"
              :loading="loadingFreight"
              @click="getFreightDetails(zipcode)"
            />
          </div>
        </div>
        <div class="col-6">
          <q-card v-if="addressToZipcode" flat>
            <q-card-section>
              <div class="text-subtitle2 text-weight-bold q-mb-sm">
                Endereço:
              </div>
              <q-item dense class="q-pa-none">
                <q-item-section>
                  <q-item-label>
                    {{ addressToZipcode?.logradouro }}
                  </q-item-label>
                  <q-item-label>
                    {{ addressToZipcode?.bairro }}, {{ addressToZipcode?.uf }}
                  </q-item-label>
                  <q-item-label> CEP: {{ zipcode }} </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-6">
          <q-list v-if="deliveryOptions.length > 0">
            <template v-for="(option, index) in deliveryOptions" :key="index">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle1">{{
                    option?.description
                  }}</q-item-label>
                  <q-item-label class="text-subtitle2">{{
                    formatBusinessDays(option?.estimatedDeliveryDays)
                  }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-weight-bold">{{
                    formatValueShipping(option?.totalPrice || 0)
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator v-if="index < deliveryOptions.length - 1" spaced />
            </template>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
    <q-separator spaced />
    <div class="q-gutter-y-md q-pt-md">
      <q-list class="rounded-borders">
        <q-expansion-item default-opened expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-text" color="primary" />
            </q-item-section>
            <q-item-section> {{ $t("productDescription") }} </q-item-section>
          </template>
          <q-card>
            <q-card-section>
              <div
                v-if="product?.description"
                class="q-pa-none"
                style="white-space: pre-line; word-break: break-word"
                aria-label="Descrição do produto"
                role="region"
                v-html="formatDescription(product?.description)"
              />
              <div v-else class="text-grey">
                {{ $t("noDescriptionAvailable") }}
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-information-outline" color="primary" />
            </q-item-section>
            <q-item-section> {{ $t("productFeatures") }} </q-item-section>
          </template>
          <q-card>
            <q-card-section> 
              <q-item v-for="(item, index) in selectGroup" :key="index" dense>
                <q-item-section>
                  <q-item-label> {{ item.description }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ item.value }}</q-item-label>
                </q-item-section>
              </q-item>
              <div v-if="selectGroup.length === 0" class="text-grey">
                {{ $t("noFeaturesAvailable") }}
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-ruler-square" color="primary" />
            </q-item-section>
            <q-item-section> {{ $t("dimensions") }} </q-item-section>
          </template>
          <q-card>
            <q-card-section> 
             <div v-if="skuSelected?.sku">
               <q-item-label>{{ $t("weight") }}: {{ skuSelected.sku.weight }} kg</q-item-label>
               <q-item-label>{{ $t("height") }}: {{ skuSelected.sku.height }} cm</q-item-label>
               <q-item-label>{{ $t("width") }}: {{ skuSelected.sku.width }} cm</q-item-label>
               <q-item-label>{{ $t("length") }}: {{ skuSelected.sku.length }} cm</q-item-label>
              </div>
              <div v-else class="text-grey">
                {{ $t("noDimensionsAvailable") }}
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
      <q-list class="rounded-borders">
        <q-expansion-item expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-check-decagram-outline" color="primary" />
            </q-item-section>
            <q-item-section> {{ $t("securePurchase.title") }} </q-item-section>
          </template>
          <q-card>
            <q-card-section>
              <div class="text-weight-bold q-mb-sm">
                {{ $t("securePurchase.description1") }}<br >
                {{ $t("securePurchase.description2") }}
              </div>
              <div class="text-body2 q-mb-sm">
                {{ $t("securePurchase.description3") }}
              </div>
              <div class="text-body2">
                {{ $t("securePurchase.description4") }}
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-lock-check-outline" color="primary" />
            </q-item-section>
            <q-item-section> {{ $t("securePayment.title") }} </q-item-section>
          </template>
          <q-card>
            <q-card-section>
              <div class="text-weight-bold q-mb-sm">
                {{ $t("securePayment.paymentMethods") }}<br >
                {{ $t("securePayment.paymentMethodsCredit") }}<br >
                {{ $t("securePayment.paymentMethodsPix") }}
              </div>
              <div class="text-body2 q-mb-sm">
                <span class="text-weight-bold"
                  >{{ $t("securePayment.protectedTransactions") }} </span
                ><br >
                {{ $t("securePayment.protectedTransactionsDesc") }}
              </div>
              <div class="text-body2">
                <span class="text-weight-bold"
                  >{{ $t("securePayment.dataPrivacy") }} </span
                ><br >
                {{ $t("securePayment.dataPrivacyDesc") }}
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-separator>
          <template #header>
            <q-item-section side>
              <q-icon name="mdi-autorenew" color="primary" />
            </q-item-section>
            <q-item-section> {{ $t("returnPolicy.title") }} </q-item-section>
          </template>
          <q-card>
            <q-card-section>
              <div class="text-weight-bold q-mb-sm">
                {{ $t("returnPolicy.description1") }}<br ><br >
                {{ $t("returnPolicy.description2") }}
              </div>
              <div class="text-body2 q-mb-sm">
                {{ $t("returnPolicy.description3") }}
              </div>
              <div class="text-body2 q-mb-sm">
                {{ $t("returnPolicy.description4") }}
              </div>
              <div class="text-body2">
                {{ $t("returnPolicy.description5") }}
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
    <q-separator spaced inset />
    <RelatedProducts />
  </q-page>
</template>
<script setup lang="ts">
import ProductCarousel from "~/components/ProductCarousel.vue";
import RelatedProducts from "~/components/RelatedProducts.vue";
import {
  numberToReal,
  formatDiscount,
  formatBusinessDays,
  formatDescription,
} from "~/utils/functions";
import { useShopService } from "~/services/shop.service";
const { getCalculateFreightService, getAddressByZipcodeService } =
  useShopService();
const { getProductById, getRelatedProducts, product, shop, slug } = useShop();
const { addProductToCart, productsInCart } = useCart();
const route = useRoute();
const id = computed(() => route.params?.id);
const skuSelectedId = ref<string | null>(null);
const selectedQuantity = ref<number>(1);
const deliveryOptions = ref<any[]>([]);
const loadingFreight = ref<boolean>(false);

watch(product, () => {
  if (sortedSkus.value && sortedSkus.value.length > 0)
    skuSelectedId.value = sortedSkus.value[0].id;
  else skuSelectedId.value = null;
});

const zipcode = ref<string>("");
const addressToZipcode = ref<any>(null);
async function getAddressByZipcode(zipcode: string) {
  const response = await getAddressByZipcodeService(zipcode);
  addressToZipcode.value = response;
}
async function getFreightDetails(zipcode: string) {
  if (!zipcode || !skuSelected.value?.sku?.id) return;
  loadingFreight.value = true;
  try {
    await getAddressByZipcode(zipcode);
    if (addressToZipcode.value.erro) return;
    const { records } = await getCalculateFreightService({
      zipcode: zipcode,
      skus: [{ id: skuSelected.value.sku.id, qtd: 1 }],
    });
    deliveryOptions.value = records[0]?.results[0]?.deliveries || [];
  } catch (error) {
    console.error("Erro ao calcular frete:", error);
  } finally {
    loadingFreight.value = false;
  }
}
const sizeOrder = ["XP", "P", "M", "G", "XG", "XXG", "EXG"];

const sortedSkus = computed(() => {
  const allActiveSkus = (product.value as any)?.skus?.filter(
    (sku: any) => sku.active === true
  );
  if (!Array.isArray(allActiveSkus)) return [];

  const hasValidModel = (sku: any) => {
    if (!sku.model) return false;
    const trimmedModel = sku.model.trim();
    return (
      trimmedModel !== "" &&
      trimmedModel !== "." &&
      !/^[.,\-_\s]+$/.test(trimmedModel)
    );
  };

  const skusToShow =
    allActiveSkus.length > 1
      ? allActiveSkus
      : allActiveSkus.filter(hasValidModel);

  return [...skusToShow].sort((a, b) => {
    const aIndex = sizeOrder.indexOf(a.model?.toUpperCase() || "");
    const bIndex = sizeOrder.indexOf(b.model?.toUpperCase() || "");

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1 && bIndex === -1) return -1;
    if (aIndex === -1 && bIndex !== -1) return 1;
    return (a.model || "").localeCompare(b.model || "");
  });
});

const skuOptions = computed(() => {
  return sortedSkus.value.map((sku: any, index: number) => {
    const hasValidModel =
      sku.model &&
      sku.model.trim() !== "" &&
      sku.model.trim() !== "." &&
      !/^[.,\-_\s]+$/.test(sku.model.trim());

    const label = hasValidModel ? sku.model : `Opção ${index + 1}`;

    return {
      label: label,
      value: sku.id,
    };
  });
});

const selectedSkuLabel = computed(() => {
  const selectedOption = skuOptions.value.find(
    (option: any) => option.value === skuSelectedId.value
  );
  return selectedOption?.label || "Selecione uma opção";
});

const installments = computed(() => {
  if (
    Array.isArray((product.value as any)?.installments) &&
    (product.value as any)?.installments.length > 0
  ) {
    const count = (product.value as any).installments.length;
    return (product.value as any).installments[count - 1];
  }
  return { installment: 0, value: 0 };
});

const skuSelected = computed(() => {
  if (!product.value) return null;
  const { skus, ...rest } = product.value as any;
  if (Array.isArray(skus)) {
    let selectedSku = skus.find((sku: any) => sku.id === skuSelectedId.value);
    if (!selectedSku) {
      selectedSku = skus.find((sku: any) => sku.active === true);
    }
    return {
      sku: selectedSku,
      ...rest,
    };
  }

  return { ...rest, sku: { ...skus[0], images: skus[0].images ?? [] } };
});

const selectGroup = computed<any>(() => {
  if (!skuSelected.value?.sku?.groups) return [];
  
  try {
    const groups = typeof skuSelected.value.sku.groups === 'string' 
      ? JSON.parse(skuSelected.value.sku.groups) 
      : skuSelected.value.sku.groups;
    
    return groups?.[0]?.items || [];
  } catch (error) {
    console.error('Erro ao fazer parse dos grupos:', error);
    return [];
  }
})

const productInCart = computed(() => {
  return productsInCart.value.find((p) => p.id === skuSelected.value?.id);
});

const quantityOptions = computed(() => {
  const currentQuantityInCart = productInCart.value?.quantity || 0;
  const maxAllowed = 6 - currentQuantityInCart;

  if (maxAllowed <= 0) return [];

  return Array.from({ length: maxAllowed }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));
});

const isQuantitySelectDisabled = computed(() => {
  const currentQuantityInCart = productInCart.value?.quantity || 0;
  return currentQuantityInCart >= 6;
});

const canAddToCart = computed(() => {
  const currentQuantityInCart = productInCart.value?.quantity || 0;
  return currentQuantityInCart < 6;
});

watch(quantityOptions, (newOptions) => {
  if (newOptions.length === 0) {
    selectedQuantity.value = 1;
  } else if (selectedQuantity.value > newOptions.length) {
    selectedQuantity.value = newOptions.length;
  }
});

const { refresh } = await useLazyAsyncData(`product-${id.value}`, async () => {
  await getProductById(slug.value as string, id.value as string);
  await getRelatedProducts(id.value as string);
});

async function buyNow() {
  await refresh();
  if (!productInCart.value) {
    addProductToCartWithQuantity();
  }

  navigateTo("/checkout");
}

function addProductToCartWithQuantity() {
  if (!skuSelected.value) return;

  const quantityToAdd = selectedQuantity.value;

  for (let i = 0; i < quantityToAdd; i++) {
    addProductToCart(skuSelected.value);
  }

  Notify.create({
    message: `${quantityToAdd} ${
      quantityToAdd > 1 ? "produtos adicionados" : "produto adicionado"
    } ao carrinho com sucesso!`,
    color: "positive",
    icon: "mdi-check-circle-outline",
    position: "top",
    timeout: 3000,
  });

  selectedQuantity.value = 1;
}

watch(id, async (newId, oldId) => {
  if (newId && newId !== oldId) await refresh();
});

function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}

const currentUrl = computed(() => {
  if (import.meta.client && window?.location) return window.location.href;

  return `${process.env.SITE_URL || "https://seu-dominio.com"}${
    route.fullPath
  }`;
});
const image = computed(() => {
  const skus = (product.value as any)?.skus;
  if (Array.isArray(skus) && skus.length > 0 && skus[0]?.images?.length > 0) {
    return skus[0].images[0];
  }
  return "/favicon.ico";
});

const title = computed(() => product?.value?.name || "Produto");
const description = computed(() =>
  product?.value?.description
    ? product.value.description
    : "Confira este produto incrível!"
);
const category = computed(() =>
  product?.value?.category_id ? product.value?.category_id : "Produto"
);

function copyLink() {
  navigator.clipboard.writeText(currentUrl.value);
  Notify.create({
    message: "Link copiado para a área de transferência",
    color: "positive",
    icon: "mdi-content-copy",
  });
}

function getDiscountPercent(price: number, priceDiscount: number) {
  if (!price || !priceDiscount || priceDiscount >= price) return 0;
  const percent = 100 - (priceDiscount / price) * 100;
  return formatDiscount(percent);
}

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
<style scoped>
.custom-height {
  height: 55px;
}
</style>
