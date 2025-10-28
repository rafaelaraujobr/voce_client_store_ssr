<template>
  <q-page :style-fn="myTweak" padding class="q-gutter-y-sm">
    <div class="wrapper">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-7">
          <CheckoutStepper />
        </div>
        <div class="col-12 col-md-5">
          <OrderSummary />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import OrderSummary from "~/components/checkout/OrderSummary.vue";
import CheckoutStepper from "~/components/checkout/CheckoutStepper.vue";
definePageMeta({
  ssr: false,
});
function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}
</script>
