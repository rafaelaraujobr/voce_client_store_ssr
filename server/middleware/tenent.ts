/**
 * Middleware que extrai e injeta informações do tenant no contexto da requisição
 */
export default defineEventHandler((event) => {
<<<<<<< HEAD
  const { host } = getRequestURL(event)
  const base = process.env.BASE_DOMAIN || 'vocelab.com.br'
  const isSub = host.endsWith(base) && host !== base && !host.startsWith('www.')
  if (isSub) {
    const slug = host.replace(`.${base}`, '')
    // Lista de subdomínios reservados
    const reserved = ['www', 'app', 'api', 'static', 'assets']
    if (!reserved.includes(slug)) {
      event.context.tenantSlug = slug
    }
  }
})
=======
  const { host } = getRequestURL(event);
  const config = useRuntimeConfig();
  const baseDomain = config.baseDomain;
  
  // Extrai o slug do tenant a partir do host
  const tenantSlug = extractTenantSlug(host, baseDomain);
  
  // Injeta as informações do tenant no contexto do evento
  event.context.tenant = {
    slug: tenantSlug,
    host: host,
    baseDomain: baseDomain,
    isValid: tenantSlug ? isValidTenantSlug(tenantSlug) : false
  };
  
  // Para compatibilidade com código existente
  event.context.tenantSlug = tenantSlug;
  
  // Define cookie x-tenant para facilitar hidratação no client (bônus)
  if (tenantSlug && event.context.tenant.isValid) {
    setCookie(event, 'x-tenant', tenantSlug, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 dias
    });
  }
});
>>>>>>> b7fba83f100f8ad5ac9f5be0b4930972840060cc
