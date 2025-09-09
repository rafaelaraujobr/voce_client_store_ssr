<template>
  <q-splitter v-model="splitterModel" style="height: 250px" class="">
    <template #before>
      <q-tabs v-model="slide" vertical>
        <q-tab
          v-for="(image, index) in images"
          :key="index"
          :name="index + 1"
          :class="slide === index + 1 ? 'bg-default text-white' : ''"
        >
          <q-img
            :src="image"
            fit="contain"
            class="cursor-pointer"
            :class="slide === index + 1 ? 'product-image' : ''"
          />
        </q-tab>
      </q-tabs>
    </template>

    <template #after>
      <q-tab-panels
        v-model="slide"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel
          v-for="(image, index) in images"
          :key="index"
          :name="index + 1"
          style="height: 250px"
        >
          <q-img
            :src="image"
            fit="contain"
            style="height: 220px"
            class="cursor-pointer"
            @click="handleImageClick()"
          />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
  <q-dialog v-model="dialog">
    <q-card style="width: 800px">
      <q-toolbar>
        <q-toolbar-title class="text-subtitle1">
          Visualizar imagem
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="mdi-close" />
      </q-toolbar>
      <q-separator />
      <q-card-section>
        <q-img :src="imageSelected" fit="contain" style="height: 100%" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
const images = computed(() => props.product?.skus[0].images);
const slide = ref<number>(1);
const imageSelected = computed(() => images.value[(slide.value - 1) as number]);
const props = defineProps<{
  product: any;
}>();
const dialog = ref(false);
const splitterModel = ref(12);
function handleImageClick() {
  dialog.value = true;
}
</script>
