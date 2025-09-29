<template>
  <div class="row q-col-gutter-md full-width">
    <div class="col-12">
      <q-card flat>
        <q-card-section>
          <q-item-label class="text-weight-bold">Filtros</q-item-label>
        </q-card-section>
        <q-card-section>
          <q-item-label class="text-weight-bold q-mb-sm">Preço</q-item-label>
          <q-option-group
            v-model="priceSelected"
            :options="optionsPrices"
            color="primary"
            type="checkbox"
            keep-color
          />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup lang="ts">
const priceSelected = ref<{ min: number; max: number }[]>([]);
const optionsPrices = ref([
  {
    label: "Até R$ 50",
    value: {
      min: 0,
      max: 50,
    },
  },
  {
    label: "De R$ 51 a R$ 150",
    value: {
      min: 51,
      max: 100,
    },
  },
  {
    label: "De R$ 151 a R$ 300",
    value: {
      min: 151,
      max: 300,
    },
  },
  {
    label: "De R$ 301 a R$ 500",
    value: {
      min: 301,
      max: 500,
    },
  },
  {
    label: "Mais de R$ 501",
    value: {
      min: 501,
      max: 1000000000,
    },
  },
]);
</script>
