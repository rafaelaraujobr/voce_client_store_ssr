<script setup lang="ts">
// Exemplo de uso do sistema de tenant em uma página

// Obtém informações do tenant
const tenant = useTenant();
const tenantSlug = useTenantSlug();
const { buildUrl } = useTenantUrl();

// Meta da página dinâmica baseada no tenant
useHead({
  title: computed(() => {
    const slug = tenant.value?.slug;
    return slug ? `${slug} - VoceLab` : 'VoceLab';
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        const slug = tenant.value?.slug;
        return slug ? `Página inicial de ${slug}` : 'Plataforma VoceLab';
      })
    }
  ]
});

// Dados reativos baseados no tenant
const welcomeMessage = computed(() => {
  const slug = tenant.value?.slug;
  if (slug) {
    return `Bem-vindo ao ${slug}!`;
  }
  return 'Bem-vindo ao VoceLab!';
});

// Exemplo de navegação com tenant
const navigateToAbout = () => {
  const aboutUrl = buildUrl('/sobre');
  navigateTo(aboutUrl);
};

// Informações de debug (apenas em desenvolvimento)
const debugInfo = computed(() => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return {
    tenant: tenant.value,
    tenantSlug: tenantSlug.value,
    host: import.meta.client ? window.location.host : 'SSR',
  };
});
</script>

<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h4 text-center">
              {{ welcomeMessage }}
            </div>
            
            <div class="text-center q-mt-md" v-if="tenant?.slug">
              <q-chip color="primary" text-color="white" icon="domain">
                Tenant: {{ tenant.slug }}
              </q-chip>
            </div>
            
            <div class="text-center q-mt-md" v-else>
              <q-chip color="grey" text-color="white" icon="public">
                Domínio Principal
              </q-chip>
            </div>
          </q-card-section>
          
          <q-card-actions align="center">
            <q-btn 
              color="primary" 
              @click="navigateToAbout"
              :label="tenant?.slug ? `Sobre ${tenant.slug}` : 'Sobre nós'"
            />
            
            <q-btn 
              color="secondary" 
              :to="buildUrl('/contato')"
              label="Contato"
            />
          </q-card-actions>
        </q-card>
        
        <!-- Informações de debug (apenas em desenvolvimento) -->
        <q-card v-if="debugInfo" class="q-mt-md">
          <q-card-section>
            <div class="text-h6">Debug Info</div>
            <pre class="text-caption">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
          </q-card-section>
        </q-card>
        
        <!-- Exemplo de conteúdo condicional baseado no tenant -->
        <q-card class="q-mt-md" v-if="tenant?.slug">
          <q-card-section>
            <div class="text-h6">Conteúdo Personalizado</div>
            <p>
              Este conteúdo é específico para o tenant <strong>{{ tenant.slug }}</strong>.
              Aqui você pode mostrar informações, configurações ou funcionalidades
              específicas para cada cliente.
            </p>
          </q-card-section>
        </q-card>
        
        <!-- Conteúdo do domínio principal -->
        <q-card class="q-mt-md" v-else>
          <q-card-section>
            <div class="text-h6">Página Principal</div>
            <p>
              Esta é a página principal do VoceLab. Aqui você pode mostrar
              informações gerais sobre a plataforma, permitir que usuários
              se cadastrem ou façam login em seus respectivos tenants.
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
