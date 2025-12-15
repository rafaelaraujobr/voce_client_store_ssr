<template>
  <q-dialog v-model="modalRegister" @@before-hide="closeModal">
    <q-card style="width: 420px" class="q-pa-sm">
      <q-toolbar>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="mdi-close"
          class="q-mr-xs"
          @click="closeModal"
        />
      </q-toolbar>
      <q-card-section>
        <div class="text-h5 text-weight-bold text-center">
          {{ $t("createAccount") }}
        </div>
        <div class="text-weight-medium text-center">
          {{ $t("createAccountDescription") }}
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const modalRegister = computed<boolean>(() => route.query.modal === "register");


async function closeModal(): Promise<void> {
  const currentQuery = { ...route.query };
  delete currentQuery.modal;
  await router.push({
    path: route.path,
    query: currentQuery,
  });
}
</script>
