<template>
  <q-stepper ref="stepper" v-model="step" color="primary" animated flat bordered>
    <q-step :name="1" title="Seus dados" icon="settings" :done="step > 1">
      <div class="text-weight-medium text-subtitle1 q-mb-md">
        Dados pessoais
      </div>
      <div class="row q-col-gutter-sm q-col-gutter-md-md">
        <!-- Nome completo -->
        <div class="col-12 col-sm-12 col-md-6">
          <q-input v-model="user.name" label="Nome completo" outlined dense />
        </div>
        <!-- E-mail -->
        <div class="col-12 col-sm-12 col-md-6">
          <q-input v-model="user.email" label="E-mail" type="email" outlined dense />
        </div>
        <!-- Telefone -->
        <div class="col-12 col-sm-6 col-md-6">
          <q-input v-model="user.phone" label="Telefone" type="tel" outlined dense />
        </div>
        <!-- CPF -->
        <div class="col-12 col-sm-6 col-md-6">
          <q-input v-model="user.cpf" outlined dense label="CPF" type="text" mask="###.###.###-##" />
        </div>
      </div>
      <div class="text-weight-medium text-subtitle1 q-my-md">
        Endereço de entrega
      </div>
      <div class="row q-col-gutter-sm q-col-gutter-md-md">
        <!-- CEP -->
        <div class="col-12 col-sm-6 col-md-4">
          <q-input v-model="address.zipcode" label="CEP" outlined dense />
        </div>
        <!-- Rua -->
        <div class="col-12 col-sm-6 col-md-8">
          <q-input v-model="address.street" label="Rua" type="text" outlined dense />
        </div>
        <!-- Número -->
        <div class="col-6 col-sm-4 col-md-3">
          <q-input v-model="address.number" label="Número" type="number" outlined dense />
        </div>
        <!-- Complemento -->
        <div class="col-6 col-sm-8 col-md-5">
          <q-input v-model="address.complement" outlined dense label="Complemento" type="text" />
        </div>
        <!-- Bairro -->
        <div class="col-12 col-sm-12 col-md-4">
          <q-input v-model="address.neighborhood" label="Bairro" type="text" outlined dense />
        </div>
        <!-- Cidade -->
        <div class="col-12 col-sm-8 col-md-6">
          <q-input v-model="address.city" label="Cidade" type="text" outlined dense />
        </div>
        <!-- Estado -->
        <div class="col-12 col-sm-4 col-md-6">
          <q-input v-model="address.state" label="Estado" type="text" outlined dense />
        </div>
      </div>
    </q-step>

    <q-step :name="2" title="Sua entrega" icon="mdi-map-marker" disable>
      This step won't show up because it is disabled.
    </q-step>

    <q-step :name="3" title="Pagamento" icon="mdi-comment-plus">
      Try out different ad text to see what brings in the most customers, and
      learn how to enhance your ads using features like ad extensions. If you
      run into any problems with your ads, find out how to tell if they're
      running and how to resolve approval issues.
    </q-step>

    <template #navigation>
      <q-stepper-navigation>
        <div class="row q-gutter-sm">
          <!-- Botão Avançar/Finalizar -->
          <div class="col-12 col-sm-auto">
            <q-btn
              color="primary"
              :label="step === 2 ? 'Finalizar compra' : 'Avançar'"
              class="full-width"
              @click="stepper?.next()"
            />
          </div>
          <!-- Botão Voltar -->
          <div v-if="step > 1" class="col-12 col-sm-auto">
            <q-btn flat color="primary" label="Voltar" class="full-width" @click="stepper?.previous()" />
          </div>
        </div>
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>

<script setup lang="ts">
import type { QStepper } from "quasar";

const step = ref(1);
const stepper = ref<InstanceType<typeof QStepper> | null>(null);
const user = ref({
  name: "",
  email: "",
  phone: "",
  cpf: "",
});
const address = ref({
  zipcode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
});
</script>
