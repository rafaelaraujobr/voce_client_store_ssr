export default defineEventHandler((event) => {
  const slug = (event as any)?.context?.tenantSlug
  const url = getRequestURL(event)
  if (slug && url.pathname === '/') {
    return sendRedirect(event, `/in/${slug}`, 307)
  }
})