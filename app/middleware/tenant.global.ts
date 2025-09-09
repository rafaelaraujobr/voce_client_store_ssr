function getSubdomain(
  host: string,
  baseDomain: string,
  reserved: string[] = []
): string | null {
  const hostname = (host || "").split(":")[0]?.toLowerCase() || "";
  const cleanBaseDomain = (baseDomain || "").split(":")[0]?.toLowerCase() || "";
  if (!hostname || !cleanBaseDomain) return null;
  const suffix = `.${cleanBaseDomain}`;
  if (!hostname.endsWith(suffix)) return null;
  const subdomain = hostname.slice(0, -suffix.length);
  if (!subdomain || reserved.includes(subdomain)) return null;
  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain)) return null;
  return subdomain;
}

export default defineNuxtRouteMiddleware((to) => {
  const {
    public: { baseDomain, reservedSubs },
  } = useRuntimeConfig();
  const host = import.meta.server
    ? useRequestEvent()?.node?.req?.headers?.host ?? ""
    : window.location.hostname;

  // 2) Extrair subdomínio
  const sub = getSubdomain(host, baseDomain, reservedSubs);

  // 3) Disponibilizar globalmente (state reativo)
  const tenant = useState<string | null>("tenant", () => null);
  tenant.value = sub;

  // 4) (Opcional) redirecionar rotas legacy /in/{slug} -> {slug}.domínio
  if (to.path.startsWith("/in/")) {
    const slug = to.params?.slug || to.path.split("/")[2];
    if (slug)
      return navigateTo(`https://${slug}.${baseDomain}`, {
        external: true,
        redirectCode: 301,
      });
  }

  // 5) (Opcional) bloquear páginas que exigem tenant
  if (!sub && to.meta?.requiresTenant) {
    return abortNavigation({
      statusCode: 404,
      statusMessage: "Tenant não encontrado",
    });
  }
});
