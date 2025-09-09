/**
 * Composable para acessar informações do tenant no client e server
 */
interface TenantInfo {
  slug: string | null;
  host: string;
  baseDomain: string;
  isValid: boolean;
}

/**
 * Hook para acessar informações do tenant
 * No server, lê do context da requisição
 * No client, faz fallback para cookie x-tenant
 */
export const useTenant = (): Readonly<Ref<TenantInfo | null>> => {
  // No server, obtém do context da requisição
  if (import.meta.server) {
    const event = useRequestEvent();
    const tenant = event?.context?.tenant || null;
    return readonly(ref(tenant));
  }
  
  // No client, usa cookie como fallback
  const tenantCookie = useCookie<string>('x-tenant', {
    default: () => '',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  const config = useRuntimeConfig();
  const baseDomain = config.public.baseDomain || 'vocelab.com.br';
  
  const tenantInfo = computed((): TenantInfo | null => {
    const slug = tenantCookie.value || null;
    
    if (!slug) {
      return {
        slug: null,
        host: '',
        baseDomain,
        isValid: false
      };
    }
    
    return {
      slug,
      host: `${slug}.${baseDomain}`,
      baseDomain,
      isValid: isValidTenantSlug(slug)
    };
  });
  
  return readonly(tenantInfo);
};

/**
 * Hook simplificado que retorna apenas o slug do tenant
 * Mantém compatibilidade com código existente
 */
export const useTenantSlug = (): ComputedRef<string | null> => {
  // Mantém a implementação original para compatibilidade
  const route = useRoute();
  const ev = import.meta.server ? useRequestEvent() : null;
  const fromHost = ev?.context?.tenantSlug;
  const fromRoute = route.params.slug as string | undefined;
  
  // No client, também verifica o cookie
  const tenantCookie = import.meta.client ? useCookie<string>('x-tenant', { default: () => '' }) : null;
  const fromCookie = tenantCookie?.value || null;
  
  return computed(() => fromHost || fromRoute || fromCookie || null);
};

/**
 * Hook para construir URLs do tenant
 */
export const useTenantUrl = () => {
  const tenant = useTenant();
  
  const buildUrl = (path: string = '/'): string => {
    const tenantInfo = tenant.value;
    if (!tenantInfo?.slug || !tenantInfo.isValid) {
      return path;
    }
    
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${protocol}://${tenantInfo.slug}.${tenantInfo.baseDomain}${cleanPath}`;
  };
  
  return {
    buildUrl,
    tenant: readonly(tenant)
  };
};
