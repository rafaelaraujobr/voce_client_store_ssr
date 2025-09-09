export const useTenantSlug = () => {
  const route = useRoute();
  const ev = import.meta.server ? useRequestEvent() : null;
  const fromHost = ev?.context?.tenantSlug;
  console.log("fromHost", fromHost);
  const fromRoute = route.params.slug as string | undefined;
  return fromHost || fromRoute || null;
};
