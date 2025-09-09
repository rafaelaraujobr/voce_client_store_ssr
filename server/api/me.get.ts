/**
 * Exemplo de API que utiliza informações do tenant
 * GET /api/me - Retorna informações do usuário baseadas no tenant
 */
export default defineEventHandler(async (event) => {
  // Obtém informações do tenant do contexto da requisição
  const tenant = event.context.tenant;
  const tenantSlug = event.context.tenantSlug; // Para compatibilidade
  
  // Verifica se temos um tenant válido
  if (!tenant?.isValid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tenant inválido ou não especificado'
    });
  }
  
  // Simula busca de dados do usuário baseada no tenant
  // Em um cenário real, você faria consultas no banco de dados
  // filtrando pelos dados do tenant
  
  const mockUserData = {
    id: '123',
    name: 'João da Silva',
    email: 'joao@email.com',
    tenant: {
      slug: tenant.slug,
      name: `${tenant.slug.charAt(0).toUpperCase()}${tenant.slug.slice(1)} Corp`,
      domain: `${tenant.slug}.${tenant.baseDomain}`,
      isValid: tenant.isValid
    },
    permissions: ['read', 'write'],
    lastLogin: new Date().toISOString(),
    preferences: {
      language: 'pt-BR',
      theme: 'light',
      notifications: true
    }
  };
  
  // Exemplo de lógica específica do tenant
  if (tenant.slug === 'demo') {
    mockUserData.permissions = ['read']; // Usuário demo só pode ler
  }
  
  // Log para debug (remover em produção)
  console.log(`[API] Usuário acessado via tenant: ${tenant.slug}`);
  
  // Headers específicos do tenant
  setHeader(event, 'X-Tenant-Slug', tenant.slug);
  setHeader(event, 'X-Tenant-Domain', tenant.host);
  
  return {
    success: true,
    data: mockUserData,
    meta: {
      tenant: tenant.slug,
      timestamp: new Date().toISOString(),
      api_version: '1.0'
    }
  };
});
