<template>
  <q-splitter
    v-if="images && images.length > 1"
    v-model="splitterModel"
    style="height: 250px"
  >
    <template #before>
      <q-tabs v-if="images.length > 1" v-model="slide" vertical>
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
          >
            <template #error>
              <div
                class="absolute-full flex flex-center bg-secondary text-white text-center"
                style="max-width: 300px; margin: 0 auto">
                Imagem indisponível
              </div>
            </template>
          </q-img>
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
  
  <q-img
    v-else
    :src="images?.[0] ?? '/favicon.ico	'"
    fit="contain"
    class="cursor-pointer"
    style="height: 220px"
    placeholder-src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNhYWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW08L3RleHQ+Cjwvc3ZnPg=="
    spinner-size="82px"
    @click="handleImageClick()"
  >
    <template #error>
      <div
        class="absolute-full flex flex-center bg-secondary text-white text-center"
        style="max-width: 300px; margin: 0 auto"
      >
        Imagem indisponível
      </div>
    </template>
  </q-img>
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
const slide = ref<number>(1);
const imageSelected = computed(() => props.images?.[(slide.value - 1) as number]);
const props = defineProps<{
  images: string[] | undefined;
}>();
const dialog = ref(false);
const splitterModel = ref(12);
function handleImageClick() {
  dialog.value = true;
}
</script>
