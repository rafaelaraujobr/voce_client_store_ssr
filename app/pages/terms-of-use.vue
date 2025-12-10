<!-- <script setup>
import { useTenant } from "~/composables/tenant.composable";
definePageMeta({
  layout: "empty",
});
const tenant = useTenant();
</script>
<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">Política de privacidade</div>
      <div>{{ tenant }}</div>

      <div class="text-h2" style="opacity: 0.4">Política de privacidade</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template> -->

<template>
  <q-page class="terms-container q-pa-md">
    <q-card class="terms-card q-mb-lg q-mt-xl">
      <q-card-section>
        <div class="text-h5 text-weight-bold q-mx-sm q-mb-md">TERMOS DE USO – <strong>VOCÊ.COM.BR</strong></div>
        <div class="text-subtitle2 q-mx-sm q-mb-lg">Última atualização em 20 de Maio de 2024.</div>
        
        <q-list bordered separator class="rounded-borders">
          <q-expansion-item
            v-for="(sec, idx) in sections"
            :key="idx"
            :model-value="expandedOpen === idx"
            @update:model-value="val => {
              expandedOpen = val ? idx : null;
              if (val) scrollTo(idx)
            }"
            :icon="sec.icon"
            :label="sec.label"
            expand-separator
          >
            <q-card class="q-mx-md">
              <q-card-section v-html="sec.content.join('')"/>

            </q-card>
          </q-expansion-item>
        </q-list>
        
        <div class="row q-my-lg justify-between q-col-gutter-x-lg q-col-gutter-y-md">
          <div class="col-md-6 col-12">
            <q-btn
              color="primary"
              label="Aceitar Termos de Uso"
              @click="acceptTerms"
              class="full-width"
              unelevated
            />
          </div>
          <div class="col-md-6 col-12">
            <q-btn
              outline
              color="primary"
              label="Imprimir"
              @click="printTerms"
              class="full-width"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import sections from '~/assets/json/privacy.json'
import { ref, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'

const expandedOpen = ref<number|null>(null)
const accepted = ref(false)
const lastUpdate = '20 de Maio de 2024'
const $q = useQuasar()
const emit = defineEmits(['terms-accepted'])

const acceptTerms = () => {
  accepted.value = true
  localStorage.setItem('termsAccepted', JSON.stringify({
    accepted: true,
    date: new Date().toISOString(),
    version: lastUpdate
  }))

  $q.notify({
    color: 'positive',
    message: 'Termos de Uso aceitos com sucesso!',
    icon: 'check_circle'
  })
  emit('terms-accepted')
}

const printTerms = () => {
  window.open('/pdf/termos_uso.pdf', '_blank')
}

const checkPreviousAcceptance = () => {
  const stored = localStorage.getItem('termsAccepted')
  if (stored) {
    const parsed = JSON.parse(stored)
    accepted.value = parsed.accepted
    if (parsed.version !== lastUpdate) {
      accepted.value = false
      $q.notify({
        color: 'warning',
        message: 'Nossos Termos de Uso foram atualizados desde sua última aceitação.',
        icon: 'warning'
      })
    }
  }
}

const scrollTo = async (idx: number) => {
  await nextTick()
  const header = document.querySelectorAll('.q-expansion-item__header')[idx] as HTMLElement;
  header?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  checkPreviousAcceptance()
})

</script>

<style lang="scss" scoped>
.terms-container {
  max-width: 1000px;
  margin: 0 auto;
}

.terms-card {
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

@media print {
  .q-btn {
    display: none;
  }
  
  .q-expansion-item {
    page-break-inside: avoid;
  }
  
  .q-card {
    box-shadow: none !important;
  }
}
</style>