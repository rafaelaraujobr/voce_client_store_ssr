<template>
  <q-page class="flex flex-center" padding>
    <div class="text-center row q-col-gutter-y-sm q-px-sm">
      <div class="col-12">
        <q-img src="@/assets/images/card_not_found.svg" width="134px" spinner-color="primary" spinner-size="82px" />
      </div>
      <div class="col-12">
        <div class="text-subtitle1 text-weight-bolder">Que pena!</div>
        <div class="text-subtitle1">O pagamento não foi efetuado, seu pedido foi cancelado!</div>
      </div>
      <div class="col-12 q-gutter-y-md">
        <q-btn
          color="primary"
          label="Ver pedido cancelado"
          outline
          class="full-width"
          no-caps
          :to="`/my-order`"
        />
        <q-btn
          color="primary"
          label="Comprar novamente"
          unelevated
          class="full-width"
          no-caps
          :to="`/`"
        />
      </div>
    </div>
  </q-page>
</template>
<script lang="ts" setup>

</script>


