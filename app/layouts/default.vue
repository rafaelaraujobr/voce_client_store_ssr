<template>
  <q-layout view="lHh LpR lFf">
    <q-header class="text-dark backdrop-blur bg-white" bordered>
      <q-toolbar>
        <q-toolbar-title>
          <q-img
            :src="shop?.logotipo"
            height="30px"
            spinner-color="primary"
            spinner-size="82px"
            fit="contain"
            class="q-img-logo"
          />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-grey-1">
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useShop } from "~/composables/shop.composable";
const { shop } = useShop();
</script>

<style lang="sass"></style>
