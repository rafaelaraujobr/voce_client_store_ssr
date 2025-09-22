<template>
  <q-tabs v-model="tab" inline-label no-caps>
    <q-tab name="all">
      <q-item-section>
        <q-item-label>Todos os produtos</q-item-label>
      </q-item-section>
    </q-tab>
    <q-tab v-for="category in categories" :key="category.id" :name="category.id">
      <q-item-section>
        <q-item-label>{{ category.name }}</q-item-label>
      </q-item-section>
    </q-tab>
  </q-tabs>
</template>
<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
const tab = ref<string | null>(null);
const { shop } = useShop();
const categories = computed(() => shop?.value?.categories || []);
</script>
<style lang="sass"></style>
