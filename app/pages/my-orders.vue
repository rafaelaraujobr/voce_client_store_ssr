<template>
  <q-page :style-fn="myTweak" padding class="q-gutter-y-sm">
    <div class="wrapper">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <h5 class="text-h5 text-weight-medium">{{ $t("myOrders") }}</h5>
        </div>
        <div
          class="col-12 row"
          :class="{
            'justify-center': !orderDetails,
            'items-center': orderDetails,
          }"
        >
          <q-card
            flat
            bordered
            :class="{ 'search-card-centered': !orderDetails }"
            class="search-card"
          >
            <q-card-section class="q-pa-md">
              <div class="text-center q-mb-md">
                <q-icon
                  name="mdi-package-variant-closed"
                  size="48px"
                  :color="orderDetails ? 'primary' : 'grey-5'"
                />
                <div class="text-h6 text-weight-medium q-mt-sm">
                  {{ $t("searchForOrder") }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ $t("enterOrderNumberToTrack") }}
                </div>
              </div>
              <q-input
                v-model="numberOfOrder"
                :placeholder="$t('numberOfOrder')"
                outlined
                dense
                clearable
                @keyup.enter="getOrders"
                @clear="clearNumberOfOrder"
              >
                <template #prepend>
                  <q-icon name="mdi-magnify" color="primary" />
                </template>
              </q-input>
              <q-btn
                :label="$t('search')"
                color="primary"
                class="full-width q-mt-md"
                unelevated
                :loading="loading"
                :disable="!numberOfOrder"
                @click="getOrders"
              />
            </q-card-section>
          </q-card>
        </div>
        <div v-if="orderDetails" class="col-12">
          <q-card class="q-mb-md" flat bordered>
            <q-card-section>
              <div class="text-h6">{{ $t("orderDetails") }}</div>
              <div class="text-subtitle2 text-grey-7">
                {{ $t("orderId") }}: {{ orderDetails.order.id }}
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-body2 text-grey-7">
                    {{ $t("orderDate") }}
                  </div>
                  <div class="text-body1 text-weight-medium">
                    {{ formatDate(orderDetails.order.createdAt) }}
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="text-body2 text-grey-7">{{ $t("status") }}</div>
                  <div class="text-body1 text-weight-medium">
                    {{ formatStatus(orderDetails.order.status.name) }}
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="text-body2 text-grey-7">
                    {{ $t("totalPrice") }}
                  </div>
                  <div class="text-h6 text-primary text-weight-bold">
                    {{ formatCurrency(orderDetails.order.price) }}
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="text-body2 text-grey-7">
                    {{ $t("commission") }}
                  </div>
                  <div class="text-body1 text-weight-medium">
                    {{ formatCurrency(orderDetails.order.userCommission) }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-card class="q-mb-md" flat bordered>
            <q-card-section>
              <div class="text-h6">{{ $t("products") }}</div>
            </q-card-section>

            <q-separator />

            <q-list>
              <q-expansion-item
                v-for="item in orderDetails.order.orderProducts"
                :key="item.id"
                expand-separator
                :header-class="'bg-grey-1'"
              >
                <template #header>
                  <q-item-section avatar>
                    <q-avatar rounded size="60px">
                      <img
                        :src="getProductImage(item.sku)"
                        :alt="item.sku.product.name"
                        @error="handleImageError"
                      >
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ item.sku.product.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ $t("quantity") }}: {{ item.amount }} |
                      {{ formatCurrency(item.price) }}
                    </q-item-label>
                  </q-item-section>
                </template>

                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2 text-weight-medium q-mb-sm">
                      {{ $t("productDescription") }}
                    </div>
                    <div class="text-body2 text-grey-8">
                      {{
                        item.sku.product.description ||
                        $t("noDescriptionAvailable")
                      }}
                    </div>

                    <q-separator class="q-my-md" />

                    <div class="row q-col-gutter-md">
                      <div class="col-6">
                        <div class="text-caption text-grey-7">
                          {{ $t("model") }}
                        </div>
                        <div class="text-body2">{{ item.sku.model }}</div>
                      </div>
                      <div class="col-6">
                        <div class="text-caption text-grey-7">EAN</div>
                        <div class="text-body2">{{ item.sku.ean }}</div>
                      </div>
                      <div class="col-6">
                        <div class="text-caption text-grey-7">
                          {{ $t("weight") }}
                        </div>
                        <div class="text-body2">{{ item.sku.weight }}g</div>
                      </div>
                      <div class="col-6">
                        <div class="text-caption text-grey-7">
                          {{ $t("dimensions") }}
                        </div>
                        <div class="text-body2">
                          {{ item.sku.height }}x{{ item.sku.width }}x{{
                            item.sku.length
                          }}
                          cm
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </q-card>
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6">{{ $t("orderHistory") }}</div>
            </q-card-section>
            <q-separator />
            <q-card-section clas="q-pa-lg">
              <q-timeline color="primary">
                <q-timeline-entry
                  v-for="(historyItem, index) in orderDetails.history"
                  :key="index"
                  :title="formatStatus(historyItem.status)"
                  :subtitle="formatDate(historyItem.createdAt)"
                  :icon="getStatusIcon(historyItem.status)"
                  :color="historyItem.flag ? 'positive' : 'negative'"
                >
                  <div v-if="historyItem.id">
                    <div class="text-caption text-grey-7">
                      ID: {{ historyItem.id }}
                    </div>
                  </div>
                </q-timeline-entry>
              </q-timeline>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useShopService } from "~/services/shop.service";
const { getOrdersService } = useShopService();

definePageMeta({
  ssr: false,
});

const numberOfOrder = ref<string | undefined>(undefined);
const orderDetails = ref<any | null>(null);
const loading = ref<boolean>(false);

async function getOrders() {
  if (!numberOfOrder.value) return;

  try {
    loading.value = true;
    const response = await getOrdersService(numberOfOrder.value as string);
    console.log(response);

    if (response?.history && response?.order) orderDetails.value = response;
  } catch (error) {
    console.error(error);
    orderDetails.value = null;
  } finally {
    loading.value = false;
  }
}

function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}

function clearNumberOfOrder() {
  numberOfOrder.value = undefined;
  orderDetails.value = null;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateString: string): string {
  if (!dateString) return "-";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    paid: "Pago",
    invoice_created: "Nota Fiscal Criada",
    in_separation: "Em Separação",
    in_transit: "Em Trânsito",
    delivered: "Entregue",
    commission_approved: "Comissão Aprovada",
    cancelled: "Cancelado",
    pending: "Pendente",
  };

  return statusMap[status] || status;
}

function getStatusIcon(status: string): string {
  const iconMap: Record<string, string> = {
    paid: "mdi-credit-card-check",
    invoice_created: "mdi-file-document",
    in_separation: "mdi-package-variant",
    in_transit: "mdi-truck-delivery",
    delivered: "mdi-check-circle",
    commission_approved: "mdi-cash-check",
    cancelled: "mdi-close-circle",
    pending: "mdi-clock-outline",
  };

  return iconMap[status] || "mdi-circle";
}

function getProductImage(sku: any): string {
  try {
    if (sku.pictures) {
      const pictures = JSON.parse(sku.pictures);
      if (pictures && pictures[0]?.images && pictures[0].images[0]?.medium) {
        return pictures[0].images[0].medium;
      }
    }
  } catch (error) {
    console.error("Error parsing pictures:", error);
  }

  return "/placeholder-image.jpg";
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = "/placeholder-image.jpg";
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.rounded-borders {
  border-radius: 8px;
}

.search-card {
  width: 100%;
  transition: all 0.3s ease;
}

.search-card-centered {
  margin-top: 2rem;
}

:deep(.q-expansion-item__container) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.q-expansion-item__container:last-child) {
  border-bottom: none;
}

.q-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.q-timeline__dot) {
  font-size: 20px;
}

:deep(.q-timeline__title) {
  font-weight: 600;
}

@media (max-width: 600px) {
  :deep(.q-avatar) {
    width: 50px !important;
    height: 50px !important;
  }

  .search-card {
    max-width: 100%;
  }
}
</style>
