<template>
  <q-page class="flex flex-center" padding>
    <div class="payment-container">
      <div class="payment-header bg-positive">
        <h4 class="text-center text-white text-h6 q-ma-lg q-mt-xl">{{ $t('payViaPixTitle') }}</h4>
        <q-badge color="primary" class="q-pa-sm q-mb-xl">{{ $t('pendingPayment') }}</q-badge>
      </div>

      <div class="payment-timer q-mt-md">
        <p class="text-center q-mb-sm">{{ $t('codeExpiresIn') }}</p>
        <p class="text-center text-bold">{{ formatTime }}</p>
      </div>

      <div class="payment-qrcode q-mt-md">
        <q-spinner v-if="isQrCodeLoading" color="primary" size="50px" />
        <div v-else class="q-pa-md flex flex-center">
          <div class="flex justify-center">
            <img :src="pixUrlImage" 
                alt="QR Code" class="q-mb-md" />
            <div class="pix-code-display text-center q-pa-xs">
              {{ shortenedCode }}
            </div>
            <q-btn 
              color="primary" 
              class="full-width q-mt-sm q-mt-lg" 
              :label="$t('copyPixCode')"
              @click="copyPixCode"
              icon-right="content_copy"
            >
            </q-btn>
          </div>
        </div>
      </div>

      <div class="payment-alert q-mt-lg">
        <q-banner class="bg-amber-1 text-amber-9">
          <template v-slot:avatar>
            <q-icon name="fa-solid fa-triangle-exclamation" color="amber-9" />
          </template>
          <div>
            <span class="text-weight-bold">{{ $t('important') }}</span> {{ $t('paymentCancelWarning') }}
          </div>
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useShopStore } from '@/stores/shop'
const { pixPayment } = storeToRefs(useShopStore())
const $q = useQuasar()
const { shop } = useShop()
const router = useRouter()
const isQrCodeLoading = computed(() => { return !pixPayment.value?.qrCode && !pixPayment.value?.qrCodeBase64 })
const transactionId = computed(() => pixPayment.value?.transactionId)
const qrCode = computed(() => pixPayment.value?.qrCode)
const pixUrlImage = computed(() => { 
  return pixPayment.value?.qrCodeBase64 && pixPayment.value?.qrCodeBase64.startsWith('data:') 
    ? pixPayment.value?.qrCodeBase64 
    : pixPayment.value?.qrCodeBase64 
      ? `data:image/png;base64,${pixPayment.value?.qrCodeBase64}` 
      : '' 
})
const expirationTime = ref(pixPayment.value?.expirationTime * 60)
const websocket = ref<WebSocket | null>(null)
const timer = ref<ReturnType<typeof setInterval> | null>(null)
const reconnectAttempts = ref(0)
const maxReconnectAttempts = 5

const formatTime = computed(() => {
  const minutes = Math.floor(expirationTime.value / 60)
  const seconds = expirationTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const shortenedCode = computed(() => {
  if (!qrCode.value) return ''
  if (qrCode.value.length <= 40) return qrCode.value
  return qrCode.value.substring(0, 40) + '...'
})

const copyPixCode = () => {
  navigator.clipboard.writeText(qrCode.value)
    .then(() => {
      $q.notify({
        color: 'positive',
        message: $t('pixCodeCopied'),
        icon: 'done',
        position: 'top'
      })
    })
    .catch(err => {
      console.error('Erro ao copiar: ', err)
      $q.notify({
        color: 'negative',
        message: $t('copyError'),
        icon: 'error',
        position: 'top'
      })
    })
}

const clearTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const startTimer = () => {
  clearTimer()
  
  timer.value = setInterval(() => {
    if (expirationTime.value > 0) {
      expirationTime.value--
    } else {
      clearTimer()
      $q.notify({
        color: 'negative',
        message: $t('paymentTimeExpired'),
        icon: 'timer_off',
        position: 'top'
      })
      router.push(`/order-canceled`)
    }
  }, 1000)
}
const closeWebSocketConnection = () => {
  if (websocket.value) {
    websocket.value.close()
    websocket.value = null
  }
  reconnectAttempts.value = 0
}

const reconnectWebSocket = () => {
  if (reconnectAttempts.value < maxReconnectAttempts) {
    reconnectAttempts.value++
    console.log(`Tentativa de reconexão ${reconnectAttempts.value}/${maxReconnectAttempts}`)
    
    setTimeout(() => {
      initWebSocket()
    }, 2000 * reconnectAttempts.value)
  } else {
    console.error('Máximo de tentativas de reconexão atingido')
    $q.notify({
      color: 'negative',
      message: $t('connectionError'),
      icon: 'error',
      position: 'top'
    })
  }
}

const initWebSocket = () => {
  if (!transactionId.value) {
    console.error('Erro: ID da transação não fornecido')
    return
  }

  if (websocket.value) {
    websocket.value.close()
  }

  const websocketUrl = `${import.meta.env.VITE_WS_CONNECTION}?transaction_id=${transactionId.value}`
  
  try {
    websocket.value = new WebSocket(websocketUrl)
    
    websocket.value.onopen = () => {
      console.log('Conexão WebSocket estabelecida')
      reconnectAttempts.value = 0 
    }
    
    websocket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Mensagem recebida do WebSocket:', data)

        const status = data?.status?.toLowerCase() || '';
        if (status === 'canceled') {
          $q.notify({
            color: 'negative',
            message: $t('paymentCanceled'),
            icon: 'cancel',
            position: 'top'
          })
          
          closeWebSocketConnection()
          clearTimer()
          router.push(`/order-canceled`)
        } else if (status === 'paid') {
          $q.notify({
            color: 'positive',
            message: $t('paymentReceived'),
            icon: 'done',
            position: 'top'
          })
          
          closeWebSocketConnection()
          clearTimer()
          router.push(`/order-placed`)
        }
      } catch (error) {
        console.error('Erro ao processar mensagem do WebSocket:', error)
      }
    }
    
    websocket.value.onerror = (error) => {
      console.error('Erro na conexão WebSocket:', error)
    }
    
    websocket.value.onclose = (event) => {
      console.log('Conexão WebSocket fechada', event.code, event.reason)
      
      if (event.code !== 1000 && expirationTime.value > 0) {
        reconnectWebSocket()
      }
    }
  } catch (error) {
    console.error('Erro ao criar WebSocket:', error)
    reconnectWebSocket()
  }
}
const handleVisibilityChange = () => {
  if (!document.hidden && expirationTime.value > 0) {
    const initialExpirationTime = pixPayment.value?.expirationTime * 60
    const currentTime = Math.floor(Date.now() / 1000)
    const startTime = currentTime - (initialExpirationTime - expirationTime.value)
    const newExpirationTime = Math.max(0, initialExpirationTime - (currentTime - startTime))
    
    if (newExpirationTime !== expirationTime.value) {
      expirationTime.value = newExpirationTime
      
      if (newExpirationTime <= 0) {
        clearTimer()
        closeWebSocketConnection()
        router.push(`/order-canceled`)
      }
    }
  }
}

onMounted(() => {
  if (!pixPayment.value) {
    console.error('Dados do pagamento não encontrados')
    router.push(`/`)
    return
  }

  if (!pixPayment.value.expirationTime) {
    console.error('Tempo de expiração do pagamento não encontrado')
    return
  }

  expirationTime.value = pixPayment.value.expirationTime * 60

  if (expirationTime.value > 0) {
    startTimer()
    initWebSocket()
  } else {
    router.push(`/order-canceled`)
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  clearTimer()
  closeWebSocketConnection()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.payment-container {
  max-width: 500px;
  width: 100%;
}

.payment-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.payment-timer p {
  margin: 0;
}

.payment-qrcode {
  display: flex;
  justify-content: center;
}

.payment-qrcode img {
  max-width: 200px;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.pix-code-display {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  word-break: break-all;
  font-family: monospace;
  overflow: hidden;
}
</style>