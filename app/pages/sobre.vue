<script setup lang="ts">
// Exemplo de página que adapta o conteúdo baseado no tenant
const tenant = useTenant();

// Meta dinâmica baseada no tenant
useHead({
  title: computed(() => {
    const slug = tenant.value?.slug;
    return slug ? `Sobre ${slug} - VoceLab` : 'Sobre - VoceLab';
  })
});

// Conteúdo específico do tenant
const companyInfo = computed(() => {
  const slug = tenant.value?.slug;
  
  if (!slug) {
    return {
      name: 'VoceLab',
      description: 'Plataforma de gestão empresarial',
      mission: 'Facilitar a gestão de negócios através de tecnologia'
    };
  }
  
  // Em um cenário real, você buscaria essas informações do banco de dados
  return {
    name: `${slug.charAt(0).toUpperCase()}${slug.slice(1)} Corp`,
    description: `Empresa ${slug} utilizando a plataforma VoceLab`,
    mission: `Missão específica da empresa ${slug}`
  };
});
</script>

<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-breadcrumbs class="q-mb-md">
          <q-breadcrumbs-el label="Início" :to="useTenantUrl().buildUrl('/')" />
          <q-breadcrumbs-el label="Sobre" />
        </q-breadcrumbs>
        
        <q-card>
          <q-card-section>
            <div class="text-h4 q-mb-md">
              Sobre {{ companyInfo.name }}
            </div>
            
            <div class="text-body1 q-mb-md">
              {{ companyInfo.description }}
            </div>
            
            <q-separator class="q-my-md" />
            
            <div class="text-h6 q-mb-sm">Nossa Missão</div>
            <div class="text-body2">
              {{ companyInfo.mission }}
            </div>
            
            <div v-if="tenant?.slug" class="q-mt-lg">
              <q-chip color="primary" text-color="white" icon="business">
                Tenant: {{ tenant.slug }}
              </q-chip>
            </div>
          </q-card-section>
          
          <q-card-actions>
            <q-btn 
              flat 
              color="primary" 
              :to="useTenantUrl().buildUrl('/')"
              label="Voltar ao Início"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>
