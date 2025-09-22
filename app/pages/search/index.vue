<template>
  <q-page :style-fn="myTweak" padding class="q-gutter-y-sm">
    <div class="wrapper">
      <ShowCaseCategories />
    </div>
    <q-separator spaced />
    <div class="wrapper row">
      <div class="col-3">
        <ShowCaseCampaings />
      </div>
      <div class="col-9">
        <SeachList />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SeachList from "~/components/search/SeachList.vue";
import ShowCaseCategories from "~/components/showcase/ShowCaseCategories.vue";
function myTweak(offset: number): { minHeight: string } {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}
</script>
