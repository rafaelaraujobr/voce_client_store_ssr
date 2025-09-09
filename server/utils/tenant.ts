/**
 * Utilitários para extração e validação de tenant a partir do host
 */

// Lista de subdomínios reservados que não podem ser usados como tenant
const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'static', 'assets'];

/**
 * Extrai o slug do tenant a partir do host
 * @param host - Host da requisição (ex: meucliente.vocelab.com.br)
 * @param baseDomain - Domínio base (ex: vocelab.com.br)
 * @returns Slug do tenant ou null se não for um subdomínio válido
 */
export function extractTenantSlug(host: string, baseDomain: string): string | null {
  // Remove porta se existir
  const cleanHost = host.split(':')[0];
  
  // Verifica se é um subdomínio do domínio base
  if (!cleanHost.endsWith(baseDomain) || cleanHost === baseDomain) {
    return null;
  }
  
  // Extrai o subdomínio
  const subdomain = cleanHost.replace(`.${baseDomain}`, '');
  
  // Verifica se não contém pontos (apenas um nível de subdomínio)
  if (subdomain.includes('.')) {
    return null;
  }
  
  // Verifica se não é um subdomínio reservado
  if (RESERVED_SUBDOMAINS.includes(subdomain)) {
    return null;
  }
  
  // Validação básica do slug (apenas letras, números e hífens)
  if (!/^[a-z0-9-]+$/i.test(subdomain)) {
    return null;
  }
  
  return subdomain;
}

/**
 * Verifica se um slug de tenant é válido
 * @param slug - Slug para validar
 * @returns true se válido, false caso contrário
 */
export function isValidTenantSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false;
  }
  
  // Não pode ser um subdomínio reservado
  if (RESERVED_SUBDOMAINS.includes(slug.toLowerCase())) {
    return false;
  }
  
  // Validação do formato
  return /^[a-z0-9-]+$/i.test(slug) && slug.length >= 2 && slug.length <= 50;
}

/**
 * Constrói a URL do tenant
 * @param slug - Slug do tenant
 * @param baseDomain - Domínio base
 * @param path - Caminho adicional (opcional)
 * @returns URL completa do tenant
 */
export function buildTenantUrl(slug: string, baseDomain: string, path: string = '/'): string {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${protocol}://${slug}.${baseDomain}${cleanPath}`;
}
