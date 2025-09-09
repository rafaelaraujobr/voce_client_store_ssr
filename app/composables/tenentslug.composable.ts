export const useTenantSlug = () => {
  const ev = import.meta.server ? useRequestEvent() : null
  const fromHost = ev?.context?.tenantSlug
  const route = useRoute()
  const fromRoute = route.params.slug as string | undefined
  return fromHost || fromRoute || null
}