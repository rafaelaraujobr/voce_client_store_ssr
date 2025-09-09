/**
 * Middleware global para validação de tenant e redirecionamento de rotas legacy
 */
export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig();
  const baseDomain = config.baseDomain;
  
  // No servidor, verifica o tenant do contexto da requisição
  if (import.meta.server) {
    const event = useRequestEvent();
    const tenant = event?.context?.tenant;
    
    // Se temos um tenant no subdomínio mas ele é inválido, retorna 404
    if (tenant?.slug && !tenant.isValid) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tenant não encontrado'
      });
    }
    
    // Redirecionamento de compatibilidade: /in/{slug} → https://{slug}.vocelab.com.br
    if (to.path.startsWith('/in/')) {
      const slugFromPath = to.path.split('/')[2];
      
      if (slugFromPath && isValidTenantSlug(slugFromPath)) {
        // Constrói a URL de destino
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const remainingPath = to.path.replace(`/in/${slugFromPath}`, '') || '/';
        const queryString = to.fullPath.includes('?') ? to.fullPath.split('?')[1] : '';
        const targetUrl = `${protocol}://${slugFromPath}.${baseDomain}${remainingPath}${queryString ? `?${queryString}` : ''}`;
        
        // Redirecionamento permanente para a nova estrutura
        return navigateTo(targetUrl, {
          redirectCode: 301,
          external: true
        });
      } else {
        // Slug inválido na rota legacy
        throw createError({
          statusCode: 404,
          statusMessage: 'Tenant não encontrado'
        });
      }
    }
    
    // Se estamos em uma rota que requer tenant mas não temos um válido
    if (!tenant?.slug && to.path !== '/' && !to.path.startsWith('/in/')) {
      // Verifica se a rota atual é do domínio principal sem tenant
      const host = event?.node?.req?.headers?.host || '';
      if (host === baseDomain || host === `www.${baseDomain}`) {
        // Pode permitir acesso ao domínio principal sem tenant
        // ou redirecionar para uma página de seleção de tenant
        return;
      }
    }
  }
  
  // No cliente, verifica se temos informações de tenant válidas
  if (import.meta.client) {
    const tenantCookie = useCookie<string>('x-tenant', { default: () => '' });
    
    // Se estamos em uma rota legacy no cliente, redireciona
    if (to.path.startsWith('/in/')) {
      const slugFromPath = to.path.split('/')[2];
      
      if (slugFromPath && isValidTenantSlug(slugFromPath)) {
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const remainingPath = to.path.replace(`/in/${slugFromPath}`, '') || '/';
        const queryString = to.fullPath.includes('?') ? to.fullPath.split('?')[1] : '';
        const targetUrl = `${protocol}://${slugFromPath}.${baseDomain}${remainingPath}${queryString ? `?${queryString}` : ''}`;
        
        // Redirecionamento no client
        window.location.href = targetUrl;
        return;
      }
    }
  }
});
