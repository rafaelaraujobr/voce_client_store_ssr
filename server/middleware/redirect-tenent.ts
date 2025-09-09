export default defineEventHandler((event) => {
  console.log("redirect-tenent");
  const slug = (event as any)?.context?.tenantSlug
  const url = getRequestURL(event)
  console.log("slug", slug);
  console.log("url", url);
  if (slug && url.pathname === '/') {
    return sendRedirect(event, `/in/${slug}`, 307)
  }
})