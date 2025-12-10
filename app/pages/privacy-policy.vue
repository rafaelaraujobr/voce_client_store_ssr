<template>
  <q-page class="privacy-container q-pa-md">
    <q-card class="privacy-card q-mb-lg q-mt-xl">
      <q-card-section>
        <div class="text-h5 text-weight-bold q-mx-sm q-mb-md">POLÍTICA DE PRIVACIDADE – "VOCÊ.COM.BR"</div>
        <div class="text-subtitle2 q-mx-sm q-mb-lg">Última atualização em 21 de Maio de 2024.</div>
        
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
              label="Aceitar Política de Privacidade"
              @click="acceptPrivacyPolicy"
              class="full-width"
              unelevated
            />
          </div>
          <div class="col-md-6 col-12">
            <q-btn
              outline
              color="primary"
              label="Imprimir"
              @click="printPrivacyPolicy"
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
const lastUpdate = '21 de Maio de 2024'
const $q = useQuasar()
const emit = defineEmits(['privacy-policy-accepted'])

const acceptPrivacyPolicy = () => {
  accepted.value = true
  localStorage.setItem('privacyPolicyAccepted', JSON.stringify({
    accepted: true,
    date: new Date().toISOString(),
    version: lastUpdate
  }))

  $q.notify({
    color: 'positive',
    message: 'Política de Privacidade aceita com sucesso!',
    icon: 'check_circle'
  })

  emit('privacy-policy-accepted')
}

const printPrivacyPolicy = () => {
  window.open('/pdf/politica_privacidade.pdf', '_blank')
}

const checkPreviousAcceptance = () => {
  const storedAcceptance = localStorage.getItem('privacyPolicyAccepted')
  if (storedAcceptance) {
    const parsedData = JSON.parse(storedAcceptance)
    accepted.value = parsedData.accepted

  
    if (parsedData.version !== lastUpdate) {
      accepted.value = false
      $q.notify({
        color: 'warning',
        message: 'Nossa Política de Privacidade foi atualizada desde sua última aceitação.',
        icon: 'warning'
      })
    }
  }
}

const scrollTo = async (idx: number) => {
  await nextTick()
  const header = document.querySelectorAll('.q-expansion-item__header')[idx] as HTMLElement
  header?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  checkPreviousAcceptance()
})
</script>

<style lang="scss" scoped>
:deep(.iluminador) {
  background-color: #FFFF00;
  padding: 2px;
  border-radius: 5px;
}
.privacy-container {
  max-width: 1000px;
  margin: 0 auto;
}

.privacy-card {
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